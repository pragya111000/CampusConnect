import re

import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS

from assistant import (
    MAX_MESSAGE_LENGTH,
    get_answer,
)
from db import get_db_connection


app = Flask(__name__)

CORS(app)


@app.route("/")
def home():
    return jsonify({
        "message": "CampusConnect API is running"
    })


@app.route("/api/faculty")
def get_faculty():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            f.id,
            f.name,
            f.role,
            d.name AS department,
            f.subject,
            f.email
        FROM faculty f
        JOIN departments d
            ON f.department_id = d.id
    """)

    faculty = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(faculty)


@app.route("/api/subjects")
def get_subjects():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            s.id,
            s.name,
            s.code,
            d.name AS department
        FROM subjects s
        JOIN departments d
            ON s.department_id = d.id
    """)

    subjects = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(subjects)


@app.route("/api/timetable")
def get_timetable():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            day,
            time_slot,
            subject
        FROM timetable
        ORDER BY id
    """)

    rows = cursor.fetchall()

    cursor.close()
    connection.close()

    timetable = {}

    for row in rows:
        time = row["time_slot"]
        day = row["day"]
        subject = row["subject"]

        if time not in timetable:
            timetable[time] = {
                "time": time,
                "Monday": "",
                "Tuesday": "",
                "Wednesday": "",
                "Thursday": "",
                "Friday": ""
            }

        timetable[time][day] = subject

    return jsonify(list(timetable.values()))


@app.route("/api/notices")
def get_notices():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            notice_date AS date,
            category,
            title,
            description
        FROM notices
        ORDER BY notice_date DESC
    """)

    notices = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(notices)


@app.route("/api/faqs")
def get_faqs():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            question,
            answer
        FROM faqs
        ORDER BY id
    """)

    faqs = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(faqs)


HELPDESK_CATEGORIES = ["Academic", "Examination", "Fees", "Library", "Technical", "Other"]


@app.route("/api/helpdesk", methods=["POST"])
def submit_helpdesk_query():

    # silent=True -> if the body is not valid JSON we get None instead of a crash
    data = request.get_json(silent=True) or {}

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    category = str(data.get("category", "Other")).strip()
    query = str(data.get("query", "")).strip()

    # Never trust the browser: validate again on the server.
    errors = {}

    if len(name) < 2:
        errors["name"] = "Please enter your name (at least 2 characters)."

    if not re.match(r"^\S+@\S+\.\S+$", email):
        errors["email"] = "Please enter a valid email address."

    if category not in HELPDESK_CATEGORIES:
        errors["category"] = "Please choose a valid category."

    if len(query) < 10:
        errors["query"] = "Please describe your query in at least 10 characters."

    if errors:
        return jsonify({"message": "Please correct the highlighted fields.", "errors": errors}), 400

    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        try:
            cursor.execute("""
                INSERT INTO helpdesk_queries
                (name, email, category, query)
                VALUES (%s, %s, %s, %s)
            """, (name, email, category, query))
        except mysql.connector.Error as error:
            # Error 1054 = "unknown column". It means the optional `category`
            # column has not been added to the table yet (see
            # backend/add_category_column.sql). The app should still work, so we
            # save the category inside the query text instead.
            if error.errno != 1054:
                raise
            cursor.execute("""
                INSERT INTO helpdesk_queries
                (name, email, query)
                VALUES (%s, %s, %s)
            """, (name, email, "[" + category + "] " + query))

        connection.commit()

    except mysql.connector.Error as error:
        print("Helpdesk save failed:", error)  # technical detail stays in the server log
        return jsonify({"message": "Sorry, we could not save your query right now. Please try again later."}), 500

    finally:
        # always close, even when something went wrong
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()

    return jsonify({
        "message": "Query submitted successfully"
    }), 201


@app.route("/api/departments")
def get_departments():

    connection = get_db_connection()

    cursor = connection.cursor(dictionary=True)

    cursor.execute("""
        SELECT
            id,
            name
        FROM departments
        ORDER BY id
    """)

    departments = cursor.fetchall()

    cursor.close()
    connection.close()

    return jsonify(departments)


def load_college_data():
    """Read everything the assistant needs from MySQL (same tables the other APIs use)."""
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    try:
        cursor.execute("SELECT id, name FROM departments ORDER BY id")
        departments = cursor.fetchall()

        cursor.execute("""
            SELECT f.id, f.name, f.role, d.name AS department, f.subject, f.email
            FROM faculty f
            JOIN departments d ON f.department_id = d.id
        """)
        faculty = cursor.fetchall()

        cursor.execute("""
            SELECT s.id, s.name, s.code, d.name AS department
            FROM subjects s
            JOIN departments d ON s.department_id = d.id
        """)
        subjects = cursor.fetchall()

        cursor.execute("""
            SELECT id, notice_date AS date, category, title, description
            FROM notices
            ORDER BY notice_date DESC
        """)
        notices = cursor.fetchall()

        cursor.execute("SELECT id, question, answer FROM faqs ORDER BY id")
        faqs = cursor.fetchall()

        cursor.execute("SELECT day, time_slot, subject FROM timetable ORDER BY id")
        rows = cursor.fetchall()
    finally:
        cursor.close()
        connection.close()

    # Same grouping as /api/timetable: one entry per time slot.
    slots = {}
    for row in rows:
        slot = slots.setdefault(row["time_slot"], {"time": row["time_slot"]})
        slot[row["day"]] = row["subject"]

    return {
        "departments": departments,
        "faculty": faculty,
        "subjects": subjects,
        "notices": notices,
        "faqs": faqs,
        "timetable": list(slots.values()),
    }


@app.route("/api/assistant", methods=["POST"])
def ask_assistant():

    data = request.get_json(silent=True) or {}

    message = data.get("message", "")

    if not isinstance(message, str) or not message.strip():
        return jsonify({"message": "Please type a question."}), 400

    message = message.strip()

    if len(message) > MAX_MESSAGE_LENGTH:
        return jsonify({"message": f"Please keep your question under {MAX_MESSAGE_LENGTH} characters."}), 400

    try:
        college_data = load_college_data()
    except mysql.connector.Error as error:
        print("Assistant could not read college data:", error)
        return jsonify({"message": "The assistant cannot reach the college database right now."}), 503

    answer, mode = get_answer(message, data.get("history", []), college_data)

    # mode is "ai" (real AI model) or "basic" (answered directly from the data)
    return jsonify({"answer": answer, "mode": mode})


if __name__ == "__main__":
    app.run(debug=True)