
# TaskFlow: Advanced Task Manager API

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4%2B-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?logo=jsonwebtokens&logoColor=white)
![bcryptjs](https://img.shields.io/badge/bcryptjs-Password%20Hashing-blue)
![Multer](https://img.shields.io/badge/Multer-File%20Uploads-lightgrey)
![ExcelJS](https://img.shields.io/badge/ExcelJS-Reports-217346?logo=microsoft-excel&logoColor=white)

---

## 📌 Introduction

**TaskFlow** is a robust, production-ready RESTful API designed to power a modern task management application. It provides **role-based access control** for administrators and members, detailed reporting, and comprehensive task tracking.  

Admins can manage users, define tasks with priorities and checklists, visualize system-wide analytics, and export rich reports. Members get a personalized dashboard focused on their own tasks and progress, making TaskFlow suitable for teams, organizations, and productivity-focused applications.

---



## ✨ Key Features

### 👑 Admin Features

- 👑 **Full User Management**
  - View all registered `member` users.
  - See per-user task statistics: **Pending**, **In Progress**, **Completed**.
  - Manage member roles and access permissions (where applicable).

- 👥 **Multi-user Task Assignment**
  - Each task can be assigned to **multiple users**.
  - Perfect for team-based tasks and shared responsibilities.

- 🔺 **Task Priority Levels**
  - Define and manage priority (e.g., Low, Medium, High, Critical).
  - Priority is included in analytics and reports.

- ✅ **Hierarchical Task Structure**
  - Each task can contain multiple **todos** (`todoChecklist` items).
  - Task completion status can be derived from checklist completion.

- 📊 **Comprehensive Admin Dashboard**
  - High-level system overview:
    - Total Tasks
    - Completed Tasks
    - Pending Tasks
    - Overdue Tasks

- 📈 **Visualized Analytics**
  - Aggregated data for:
    - Task distribution by **status**.
    - Task distribution by **priority level**.
  - Designed to be consumed by charts/graphs on the frontend.

- 📝 **Full CRUD on Tasks**
  - Create tasks with title, description, due date, priority, and assignees.
  - Update any task (including reassignment).
  - Delete tasks when no longer needed.

- 📄 **Advanced Reporting (Excel Export)**
  - Export **all tasks** into an Excel (`.xlsx`) report.
  - Export **user task summaries** (per-user counts by status).
  - Built using **ExcelJS** for flexible, structured reporting.

- 🔐 **Secure Admin Registration**
  - New admins can be created **only** with a secret `ADMIN_INVITE_TOKEN`.
  - Prevents unauthorized elevation to admin role.

---

### 👤 Member (User) Features

- 🏠 **Personalized Dashboard**
  - See only tasks assigned to the logged-in user.
  - View personal statistics:
    - Tasks by status.
    - Progress over time (as supported by frontend).

- ✅ **Task Progression**
  - View all assigned tasks.
  - Update task status:
    - e.g., `Pending` → `In Progress` → `Completed`.

- 📋 **Sub-task / Checklist Management**
  - Each task can have a `todoChecklist`.
  - Update checklist items (e.g., mark a sub-task as done).
  - Overall task status can be automatically updated based on checklist completion logic.

- 🔐 **Secure Authentication**
  - Login via **JWT-based** authentication.
  - All private routes are secured using JWT.
  - Tokens can be stored client-side and used for authenticated API requests.

- 🧾 **Profile Management**
  - View current user profile.
  - Update profile fields (e.g., name, avatar URL, etc. as implemented).
  - Support for image upload via **Multer** (depending on frontend usage).

---

## 🛠 Technology Stack

### 🧩 Backend

- **Node.js**
- **Express.js**
- **JWT** – JSON Web Tokens for authentication and authorization.
- **bcryptjs** – Password hashing.
- **Multer** – Handling file uploads (e.g., profile images).
- **ExcelJS** – Generating `.xlsx` task and user reports.

### 🗄 Database

- **MongoDB** – Primary database.
- **Mongoose** – Object Data Modeling (ODM) for MongoDB.

---

## 📚 API Endpoints Documentation

All endpoints are version-agnostic in this document. Prefix them as your project requires (e.g., `/api/...`).

**Access Level Legend:**
- `Public` – No authentication required.
- `Private` – Requires a valid JWT.
- `Admin Only` – Requires JWT and admin role.

### 🔑 Auth Routes (`/api/auth`)

| HTTP Method | Endpoint           | Description                                                                                  | Access Level |
|------------|--------------------|----------------------------------------------------------------------------------------------|-------------|
| POST       | `/api/auth/register`      | Register a new user. User can become an admin by providing a valid `adminInviteToken`.      | Public      |
| POST       | `/api/auth/login`         | Log in a user and return a JWT access token.                                               | Public      |
| GET        | `/api/auth/profile`       | Get the profile of the currently logged-in user.                                           | Private     |
| PUT        | `/api/auth/profile`       | Update the profile of the currently logged-in user.                                        | Private     |
| POST       | `/api/auth/upload-image`  | Upload a profile image (handled via Multer).                                               | Private     |

---

### 👥 User Routes (`/api/user`)

| HTTP Method | Endpoint        | Description                                                              | Access Level |
|------------|-----------------|--------------------------------------------------------------------------|-------------|
| GET        | `/api/user/`    | Get a list of all `member` users with their task counts.                | Admin Only  |
| GET        | `/api/user/:id` | Get detailed information for a specific user by their ID.               | Private     |

---

### 📌 Task Routes (`/api/task`)

| HTTP Method | Endpoint                        | Description                                                                                                        | Access Level |
|------------|----------------------------------|--------------------------------------------------------------------------------------------------------------------|-------------|
| POST       | `/api/task/`                     | Create a new task (title, description, priority, assignees, due date, etc.).                                      | Admin Only  |
| GET        | `/api/task/`                     | For admins: get **all** tasks. For members: get only tasks assigned to the logged-in user.                         | Private     |
| GET        | `/api/task/:id`                  | Get a single task by its ID.                                                                                       | Private     |
| PUT        | `/api/task/:id`                  | Update a task’s details (title, description, priority, due date, assignees, etc.).                                | Private     |
| DELETE     | `/api/task/:id`                  | Delete a task by its ID.                                                                                           | Admin Only  |
| PUT        | `/api/task/:id/status`           | Update only the **status** of a task (e.g., Pending → In Progress).                                               | Private     |
| PUT        | `/api/task/:id/todo`             | Update the `todoChecklist` of a task (add/remove/update checklist items, mark completed, etc.).                    | Private     |
| GET        | `/api/task/dashboard-data`       | Get aggregated statistics and chart data for the **admin dashboard** (system-wide).                                | Admin Only  |
| GET        | `/api/task/user-dashboard-data`  | Get aggregated statistics and chart data for the **member dashboard** (user-specific).                             | Private     |

---

### 📄 Report Routes (`/api/report`)

| HTTP Method | Endpoint                    | Description                                                                          | Access Level |
|------------|-----------------------------|--------------------------------------------------------------------------------------|-------------|
| GET        | `/api/report/export/tasks`  | Download an Excel file with a detailed report of **all tasks**.                     | Admin Only  |
| GET        | `/api/report/export/users`  | Download an Excel file with a **summary of users and their task counts**.          | Admin Only  |

---

## 🔐 Environment Variables

Create a `.env` file in the project root (or use `.env.local` as your setup requires). 
### `.env.example`

```bash
# Server
PORT=8000

# Database
MONGO_URI=mongodb://localhost:27017/taskflow

# Authentication
JWT_SECRET=your-very-long-random-secret-key

# Admin Invitation
ADMIN_INVITE_TOKEN=your-admin-invite-token

# CORS / Client
CLIENT_URL=http://localhost:3000
````

> Replace the placeholder values with your actual configuration.



## 🧩 Getting Started

### ✅ Prerequisites

* **Node.js** (v16+ or v18+ recommended)
* **MongoDB** (local instance or cloud, e.g., MongoDB Atlas)
* Git (for cloning the repository)

---

### 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Yousuf-177/TaskFlow.git
   ```

2. **Navigate into the project directory:**

   ```bash
   cd TaskFlow
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Create your environment file:**

   * Copy the example file (if present) or create a new `.env`:

     ```bash
     cp .env.example .env
     ```
   * Update all values in `.env` with your actual configuration (Mongo URI, secrets, etc.).

5. **Run database (if using local MongoDB):**

   * Ensure your MongoDB service is running:

     ```bash
     # example for local MongoDB
     mongod
     ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

   or, for a production-like start:

   ```bash
   npm start
   ```

7. **Test the API:**

   * Use tools like **Postman**, **Insomnia**, or **curl** to hit:

     * `POST /api/auth/register`
     * `POST /api/auth/login`
   * Attach the returned JWT as `Authorization: Bearer <token>` for private/admin routes.

---


## 🔮 Future Improvements

Some ideas for extending **TaskFlow** in future iterations:

* 🔔 **Real-time Notifications**

  * Notify users instantly when new tasks are assigned or updated (e.g., via WebSockets or push notifications).

* 📎 **File Attachments**

  * Allow users to upload and link files to specific tasks (designs, documents, etc.).
  * Extend Multer configuration and storage strategy (local/Cloud).

* 🔍 **Advanced Filtering & Search**

  * Filter tasks by:

    * Status, priority, assignee, due date range, tags, etc.
  * Full-text search on task titles/descriptions.

* 📊 **Enhanced Reporting**

  * Additional Excel and PDF reports.
  * Time-based productivity analytics and trend charts.

* 🧑‍💼 **Member-Created Tasks (Optional)**

  * Allow `member` users to create tasks for themselves or selected teammates.
  * Admin-configurable permissions for who can create what.

* 🧱 **Role & Permission System**

  * More granular roles (e.g., Manager, Team Lead).
  * Fine-grained permission matrix per route or action.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:

   ```bash
   git commit -m "Add some feature"
   ```
4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.

---




## 📬 Contact

* **Author:** Yousuf Ansari
* **GitHub:** [Yousuf-177](https://github.com/Yousuf-177)
* **Email:** [mohdyousufans177@gmail.com](mailto:mohdyousufans177@gmail.com)

Feel free to open an issue or submit a PR if you find a bug or want to propose a new feature.

