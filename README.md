# CampusConnect – College Helpdesk & Campus Assistant

CampusConnect is a full-stack college helpdesk and campus assistant web application designed to provide students with important college information in one place.

The application allows students to access faculty details, subjects, timetable, notices, FAQs, helpdesk support, and an AI-powered campus assistant.

---

## 🚀 Features

* 🏠 **Home Dashboard** – Quick access to important campus services
* 👩‍🏫 **Faculty Directory** – Search faculty by name, subject, or department
* 📚 **Subjects** – View and search subjects and subject codes
* 🗓️ **Timetable** – View the weekly class timetable
* 📢 **Notices** – View and filter academic, examination, event, and general notices
* ❓ **FAQs** – Frequently asked questions with expandable answers
* 📩 **Helpdesk Contact Form** – Students can submit queries directly to the college helpdesk
* 🤖 **AI Campus Assistant** – Ask questions about college-related information
* 🔎 **Search & Filtering** – Search and filter campus information easily
* 📱 **Responsive Design** – Works across desktop and mobile devices
* 🗄️ **MySQL Database** – College information is stored and retrieved from a database
* 🔐 **Environment Variables** – Sensitive credentials are kept outside the source code

---

## 🛠️ Technologies Used

### Frontend

* React
* JavaScript (ES6+)
* HTML5
* CSS3
* Vite
* Fetch API

### Backend

* Python
* Flask
* Flask-CORS
* REST API

### Database

* MySQL
* MySQL Connector/Python

### AI

* Anthropic API
* Python-based assistant logic
* Database-grounded college information

### Development Tools

* Git
* GitHub
* npm
* Python virtual environment

---

## 📁 Project Structure

```text
CampusConnect/
│
├── backend/
│   ├── app.py
│   ├── assistant.py
│   ├── db.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
│
├── public/
│   └── .gitkeep
│
├── src/
│   ├── components/
│   │   ├── AIAssistant.jsx
│   │   ├── AIAssistant.css
│   │   ├── Contact.jsx
│   │   ├── Faculty.jsx
│   │   ├── FAQ.jsx
│   │   ├── Footer.jsx
│   │   ├── Home.jsx
│   │   ├── Navbar.jsx
│   │   ├── Notices.jsx
│   │   ├── SearchFilter.jsx
│   │   ├── StatusMessage.jsx
│   │   ├── Subjects.jsx
│   │   └── Timetable.jsx
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
├── package-lock.json
├── vite.config.js
├── README.md
└── .gitignore
```

---

## 🏗️ Application Architecture

```text
                    Student
                       │
                       ▼
              React Frontend
                       │
                       │ Fetch API
                       ▼
                Flask REST API
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
           MySQL          AI Assistant
             │                   │
             │            Anthropic API
             │                   │
             └─────────┬─────────┘
                       ▼
                 Response to
                    Student
```

---

## 🔄 How the Application Works

### Faculty / Subjects / Timetable / Notices / FAQs

```text
React Component
      ↓
useFetch.js
      ↓
api.js
      ↓
Flask REST API
      ↓
MySQL Database
      ↓
JSON Response
      ↓
React Component
      ↓
User Interface
```

### Helpdesk Query

```text
Student fills contact form
          ↓
       Contact.jsx
          ↓
       POST request
          ↓
   Flask /api/helpdesk
          ↓
       Validation
          ↓
      MySQL Database
          ↓
    Query is stored
```

### AI Assistant

```text
Student asks a question
          ↓
     AIAssistant.jsx
          ↓
    /api/assistant
          ↓
       Flask
          ↓
    assistant.py
          ↓
    College Database
          ↓
   AI API / Fallback Logic
          ↓
       Answer
          ↓
     Student
```

---

## 🔌 API Endpoints

| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/`                | Check backend status           |
| GET    | `/api/faculty`     | Get faculty information        |
| GET    | `/api/subjects`    | Get subjects                   |
| GET    | `/api/timetable`   | Get timetable                  |
| GET    | `/api/notices`     | Get notices                    |
| GET    | `/api/faqs`        | Get frequently asked questions |
| GET    | `/api/departments` | Get departments                |
| POST   | `/api/helpdesk`    | Submit a helpdesk query        |
| POST   | `/api/assistant`   | Ask the AI campus assistant    |

---

## 🗄️ Database

CampusConnect uses **MySQL** to store college-related information.

The backend connects to MySQL using:

```text
mysql-connector-python
```

The application uses environment variables for database credentials.

Example database configuration:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=campusconnect
DB_PORT=3306
```

### Important

The actual `.env` file containing passwords and API keys should **never be committed to GitHub**.

Only a `.env.example` file with placeholder values should be included in the repository.

---

## 🤖 AI Assistant

CampusConnect includes an AI-powered campus assistant.

The assistant can answer questions related to available college information such as:

* Faculty
* Departments
* Subjects
* Timetable
* Notices
* FAQs
* Helpdesk information

The assistant can use the Anthropic API when an API key is configured.

If an AI API key is not available, the application can use its built-in basic response logic for supported college-related queries.

This provides a fallback mechanism instead of making the application completely dependent on an external AI API.

---

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/pragya111000/CampusConnect.git
```

```bash
cd CampusConnect
```

---

### 2. Install Frontend Dependencies

```bash
npm install
```

---

### 3. Create Python Virtual Environment

Move into the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell does not allow script execution, use Command Prompt:

```cmd
venv\Scripts\activate
```

---

### 4. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

### 5. Configure Environment Variables

Create:

```text
backend/.env
```

based on:

```text
backend/.env.example
```

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD
DB_NAME=campusconnect
DB_PORT=3306
```

If AI functionality is enabled, add the required AI API configuration to `.env`.

**Never upload the real `.env` file to GitHub.**

---

### 6. Configure MySQL

Create the required MySQL database and tables.

Make sure your MySQL server is running and the database name matches:

```env
DB_NAME=campusconnect
```

Also make sure the required college data has been inserted into the database.

---

### 7. Start the Backend

From the `backend` folder:

```bash
python app.py
```

The Flask backend will run on:

```text
http://127.0.0.1:5000
```

---

### 8. Start the Frontend

Open a new terminal and return to the project root:

```bash
cd CampusConnect
```

Then run:

```bash
npm run dev
```

Vite will provide the local development URL, usually:

```text
http://localhost:5173
```

Open that URL in your browser.

---

## 🔐 Security

Sensitive information is stored using environment variables.

The following files and folders should not be committed to GitHub:

```text
.env
venv/
node_modules/
__pycache__/
*.pyc
```

The project uses `.gitignore` files to prevent sensitive and generated files from being tracked.

---

## 📌 Important Project Files

| File                             | Purpose                                       |
| -------------------------------- | --------------------------------------------- |
| `src/main.jsx`                   | Entry point of the React application          |
| `src/App.jsx`                    | Main React application and section navigation |
| `src/api.js`                     | Handles frontend API requests                 |
| `src/useFetch.js`                | Reusable data-fetching React hook             |
| `src/components/`                | React UI components                           |
| `src/components/AIAssistant.jsx` | AI assistant interface                        |
| `backend/app.py`                 | Flask application and REST API routes         |
| `backend/db.py`                  | MySQL database connection                     |
| `backend/assistant.py`           | AI assistant and fallback response logic      |
| `backend/requirements.txt`       | Python dependencies                           |
| `vite.config.js`                 | Vite configuration                            |
| `package.json`                   | Frontend dependencies and scripts             |

---

## 🚀 Available Frontend Commands

### Start development server

```bash
npm run dev
```

### Create production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 📈 Future Improvements

* Student authentication and login
* Admin dashboard for managing college data
* Faculty and notice management through the web interface
* More advanced RAG-based AI assistant
* Voice input and text-to-speech support
* Deployment to a cloud platform
* Role-based access control
* Real-time notifications
* Better analytics for helpdesk queries

---

## 👩‍💻 Author

**Pragya Pandey**

B.Tech – Computer Science & Engineering (AI/ML)

GitHub: `pragya111000`

---

## 📄 License

This project is developed for educational and academic purposes.
