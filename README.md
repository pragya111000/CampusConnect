# CampusConnect – College Helpdesk & Campus Assistant

## Overview

CampusConnect is a full-stack college helpdesk and campus information portal that provides students with a single platform to access faculty details, subjects, weekly timetables, notices, FAQs, and helpdesk services.

The application uses **React and Vite** for the frontend, **Flask REST API** for the backend, and **MySQL** for storing and retrieving college data.

## Features

* **AI College Assistant** - floating "Ask CampusConnect" chat on every page, answering from the college database
* Responsive navigation with mobile menu
* Home dashboard with campus information and helpdesk details
* Faculty directory with search by name, subject or department
* Department-based faculty filtering
* Subject directory with search by name or subject code
* Department-based subject filtering
* Weekly timetable fetched from the database
* Notices with dates, "Latest" labels, search and category filtering
* FAQ section with interactive accordion
* Helpdesk contact form with category, validation (browser + server), success and error messages
* Helpdesk queries stored in MySQL
* REST APIs for faculty, subjects, timetable, notices, FAQs, departments, and helpdesk queries
* Responsive layout for desktop, tablet, and mobile devices
* Loading, error (with "Try again") and friendly no-results messages

## Technologies Used

### Frontend

* HTML5
* CSS3
* JavaScript (ES6+)
* React.js
* Vite

### Backend

* Python
* Flask
* Flask-CORS
* REST API

### Database

* MySQL
* MySQL Connector/Python

### Other

* python-dotenv
* Git & GitHub

## Project Architecture

```text
React + Vite
      ↓
Flask REST API
      ↓
    MySQL
```

The React frontend communicates with the Flask backend through REST API endpoints. The Flask backend handles database operations using MySQL.

## Project Structure

```text
CampusConnect/
│
├── backend/
│   ├── app.py
│   ├── db.py
│   ├── assistant.py
│   ├── .env.example
│   ├── requirements.txt
│   ├── .gitignore
│   └── .env
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Home.jsx
│   │   ├── Faculty.jsx
│   │   ├── Subjects.jsx
│   │   ├── Timetable.jsx
│   │   ├── Notices.jsx
│   │   ├── FAQ.jsx
│   │   ├── Contact.jsx
│   │   ├── SearchFilter.jsx
│   │   ├── StatusMessage.jsx
│   │   ├── AIAssistant.jsx
│   │   ├── AIAssistant.css
│   │   └── Footer.jsx
│   │
│   ├── api.js
│   ├── useFetch.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
│
├── index.html
├── package.json
└── README.md
```

## Database

The MySQL database is named:

```text
campusconnect
```

It contains the following tables:

```text
departments
faculty
subjects
timetable
notices
faqs
helpdesk_queries
```

The database stores the college information used by the application, while helpdesk form submissions are inserted into the `helpdesk_queries` table.

## API Endpoints

| Method | Endpoint           | Purpose                          |
| ------ | ------------------ | -------------------------------- |
| GET    | `/api/faculty`     | Fetch faculty information        |
| GET    | `/api/subjects`    | Fetch subject information        |
| GET    | `/api/timetable`   | Fetch weekly timetable           |
| GET    | `/api/notices`     | Fetch college notices            |
| GET    | `/api/faqs`        | Fetch frequently asked questions |
| GET    | `/api/departments` | Fetch departments                |
| POST   | `/api/helpdesk`    | Submit a student helpdesk query  |
| POST   | `/api/assistant`   | Ask the AI College Assistant     |

## How to Run

### 1. Clone the repository

```bash
git clone https://github.com/pragya111000/CampusConnect.git
cd CampusConnect
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Set up the backend

Open the backend folder:

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv
```

Windows PowerShell:

```powershell
.\venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

Create a `.env` file inside the `backend` folder:

```text
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=campusconnect
```

Replace `YOUR_MYSQL_PASSWORD` with your local MySQL password.

### 5. Start the Flask backend

From the `backend` folder:

```bash
python app.py
```

The backend will run at:

```text
http://127.0.0.1:5000
```

### 6. Start the React frontend

Open another terminal in the main `CampusConnect` folder:

```bash
npm run dev
```

Then open the URL shown in the terminal, usually:

```text
http://localhost:5173
```

## AI College Assistant

A floating **🤖 Ask CampusConnect** button (bottom-right, on every page) opens a chat window.

```text
User question  ->  React chat window  ->  POST /api/assistant  ->  Flask
                                                                     |
                                              reads faculty, subjects, notices, FAQs from MySQL
                                                                     |
                              AI_API_KEY set?  yes -> AI model answers using ONLY that data
                                               no  -> "basic mode": answer looked up in the data
```

* The answer always comes from the college data in MySQL.
* The AI key (if you use one) is stored only in `backend/.env` and is used only by Flask. It is never sent to the browser.
* Without a key the assistant still works in basic mode (keyword lookup in the data), so the project runs out of the box.

To turn on the real AI: copy `backend/.env.example` to `backend/.env`, add `AI_API_KEY=your_key`, and restart Flask.

### Optional: helpdesk category column

Run `backend/add_category_column.sql` once in MySQL to store the helpdesk category in its own column. Without it, the category is saved at the start of the query text.

## Security

Database credentials are stored in a `.env` file and are excluded from Git using `.gitignore`.

The virtual environment is also excluded from the repository.

## Future Improvements

Possible future improvements include:

* Authentication and role-based access
* Admin dashboard for managing college data
* Real college data integration
* Rate limiting and admin login for the assistant endpoint
* RAG-based question answering
* Voice-based campus assistant
* Real-time notice updates
* Deployment of frontend, backend, and database

## Note

This is a demonstration project. The names, email addresses, phone numbers, schedules, notices, and other college information used in the application are dummy data.
