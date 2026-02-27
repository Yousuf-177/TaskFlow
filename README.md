# TaskFlow: Advanced Task Manager

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4%2B-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-orange?logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20Storage-3448C5?logo=cloudinary&logoColor=white)
![ExcelJS](https://img.shields.io/badge/ExcelJS-Reports-217346?logo=microsoft-excel&logoColor=white)
![Deployed](https://img.shields.io/badge/Live-taskflowmanage.vercel.app-00C7B7?logo=vercel&logoColor=white)

---

## 🌐 Live Demo

**[https://taskflowmanage.vercel.app/](https://taskflowmanage.vercel.app/)**

| Role   | Email                                    | Password |
| ------ | ---------------------------------------- | -------- |
| Admin  | _(register with invite token `123456789`)_ | —        |
| Member | _(register normally)_                    | —        |

---

## 📌 Introduction

**TaskFlow** is a full-stack, production-deployed task management platform with a React frontend and a Node.js/Express backend. It provides **role-based access control** for administrators and members, comprehensive task tracking, cloud media storage, and rich Excel reporting.

Admins can manage users, create tasks with priorities and checklists, visualize system-wide analytics, and export reports. Members get a personalized dashboard focused on their assigned tasks and progress.

---

## ✨ Key Features

### 👑 Admin Features

- **Full User Management** — View all members with per-user task stats (Pending / In Progress / Completed). Delete users; removal auto-cleans their task assignments.
- **Multi-user Task Assignment** — Each task can be assigned to multiple users.
- **Task Priority Levels** — Low, Medium, High, Critical — feeds into analytics and reports.
- **Hierarchical Task Structure** — Each task contains a `todoChecklist`; completion status derived from checklist.
- **Admin Dashboard** — Total, Completed, Pending, and Overdue task counts with charts.
- **Excel Report Export** — Download `.xlsx` reports for all tasks or per-user summaries (ExcelJS).
- **Secure Admin Registration** — New admins require a secret `ADMIN_INVITE_TOKEN`.
- **Scoped Workspaces** — Each admin sees only their own tasks; no cross-admin data leakage.

### 👤 Member Features

- **Personalized Dashboard** — Only tasks assigned to the logged-in user.
- **Task Progression** — Update status: `Pending → In Progress → Completed`.
- **Checklist Management** — Mark sub-tasks done; overall task status auto-updates.
- **File Attachments** — Upload images and PDFs that display inline in task details.
- **Secure JWT Auth** — All private routes protected; 401s auto-clear the session.
- **Profile Management** — Upload a profile photo (stored on Cloudinary).

### 🆕 New in This Version

- **Landing Page** — JIRA-style marketing page at `/` with scroll-reveal animations, feature grid, how-it-works steps, admin vs member comparison, tech stack, and CTA.
- **Split-screen Auth Pages** — Login (form left, image right) and Sign Up (image left, form right) with entrance animations. Signed-in users are redirected to their dashboard automatically.
- **Cloud Profile Pictures** — Profile images upload to Cloudinary (not local disk). The permanent `https://` URL is stored in MongoDB and displayed across sidebar, task cards, user table, and task details.
- **Avatar Component** — Reusable `<Avatar />` with image + initials fallback and deterministic color.
- **User Deletion** — Admin can delete members from Manage Users; deletion cascades to remove the user from all task `assignedTo` arrays.
- **Password Strength Meter** — Visual indicator on the Sign Up form.
- **Session Persistence** — Session is restored from `localStorage` on every page load, including the landing page navbar.

---

## 🛠 Technology Stack

### Frontend

- **React 18** + **Vite 7**
- **React Router v6** — client-side routing with protected routes
- **Axios** — HTTP client with JWT interceptor
- **react-hot-toast** — notifications
- **react-icons** — icon library
- **Vanilla CSS** — custom dark design system with CSS variables

### Backend

- **Node.js** + **Express.js**
- **JWT** — authentication & authorization
- **bcryptjs** — password hashing
- **Multer** (memory storage) — in-memory file handling before cloud upload
- **Cloudinary** — permanent cloud media storage for profile images and attachments
- **ExcelJS** — `.xlsx` report generation

### Database

- **MongoDB** + **Mongoose**

### Deployment

- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com)
- **Database** → [MongoDB Atlas](https://cloud.mongodb.com)
- **Media** → [Cloudinary](https://cloudinary.com)

---

## 📚 API Endpoints

**Access Level Legend:** `Public` · `Private` (JWT required) · `Admin Only`

### 🔑 Auth Routes (`/api/auth`)

| Method | Endpoint        | Description                                          | Access  |
| ------ | --------------- | ---------------------------------------------------- | ------- |
| POST   | `/register`     | Register user (admin if `adminInviteToken` provided) | Public  |
| POST   | `/login`        | Login → returns JWT + `profileImage`                 | Public  |
| GET    | `/profile`      | Get current user profile                             | Private |
| PUT    | `/profile`      | Update profile                                       | Private |
| POST   | `/upload-image` | Upload image/PDF → Cloudinary → returns `secure_url` | Private |

### 👥 User Routes (`/api/user`)

| Method | Endpoint | Description                          | Access     |
| ------ | -------- | ------------------------------------ | ---------- |
| GET    | `/`      | All members + task counts            | Admin Only |
| GET    | `/:id`   | User by ID                           | Private    |
| DELETE | `/:id`   | Delete user + clean task assignments | Admin Only |

### 📌 Task Routes (`/api/task`)

| Method | Endpoint               | Description                                  | Access     |
| ------ | ---------------------- | -------------------------------------------- | ---------- |
| POST   | `/`                    | Create task                                  | Admin Only |
| GET    | `/`                    | All tasks (admin) or assigned tasks (member) | Private    |
| GET    | `/:id`                 | Task by ID                                   | Private    |
| PUT    | `/:id`                 | Update task                                  | Private    |
| DELETE | `/:id`                 | Delete task                                  | Admin Only |
| PUT    | `/:id/status`          | Update task status                           | Private    |
| PUT    | `/:id/todo`            | Update checklist                             | Private    |
| GET    | `/dashboard-data`      | Admin dashboard stats                        | Admin Only |
| GET    | `/user-dashboard-data` | Member dashboard stats                       | Private    |

### 📄 Report Routes (`/api/report`)

| Method | Endpoint        | Description            | Access     |
| ------ | --------------- | ---------------------- | ---------- |
| GET    | `/export/tasks` | Excel — all tasks      | Admin Only |
| GET    | `/export/users` | Excel — user summaries | Admin Only |

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```bash
PORT=8000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskflow
JWT_SECRET=your-very-long-random-secret
ADMIN_INVITE_TOKEN=your-admin-invite-token
CLIENT_URL=https://taskflowmanage.vercel.app   # no trailing slash

# Cloudinary (https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (`frontend/.env`)

```bash
VITE_API_BASE_URL=https://taskflow-9egu.onrender.com/api
```

---

## 🧩 Getting Started (Local)

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account (free)
- Git

### Installation

```bash
# 1. Clone
git clone https://github.com/Yousuf-177/TaskFlow.git
cd TaskFlow

# 2. Backend
cd backend
npm install
cp .env.example .env   # fill in all values
npm run dev            # starts on :8000

# 3. Frontend (new terminal)
cd frontend
npm install
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:8000/api
npm run dev            # starts on :5173
```

---

## 🚀 Deployment

| Service  | Platform      | URL                                |
| -------- | ------------- | ---------------------------------- |
| Frontend | Vercel        | https://taskflowmanage.vercel.app  |
| Backend  | Render        | https://taskflow-9egu.onrender.com |
| Database | MongoDB Atlas | —                                  |
| Media    | Cloudinary    | —                                  |

See [deployment_guide.md](./deployment_guide.md) for the full step-by-step guide.

> ⚠️ Render free tier sleeps after 15 min of inactivity — first request may take ~30s.

---

## 🔮 Future Improvements

- 🔔 **Real-time Notifications** via WebSockets
- 🔍 **Advanced Filtering & Search** — by status, priority, assignee, date range
- 📊 **Enhanced Reporting** — PDF exports, trend charts
- 🧑‍💼 **Member-Created Tasks** — admin-configurable permissions
- 🧱 **Granular Role System** — Manager, Team Lead, etc.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m "Add feature"`
4. Push: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📬 Contact

- **Author:** Yousuf Ansari
- **GitHub:** [Yousuf-177](https://github.com/Yousuf-177)
- **Email:** [mohdyousufans177@gmail.com](mailto:mohdyousufans177@gmail.com)
- **Live App:** [taskflowmanage.vercel.app](https://taskflowmanage.vercel.app)
