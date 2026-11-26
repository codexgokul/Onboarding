# TalentFlow - Employee Onboarding System

An enterprise-grade Employee Onboarding & Identity Lifecycle web application with a **modular Node.js/Express & SQLite backend** and a **React 19 & Tailwind CSS frontend**.

---

## 🏛️ System Architecture

```
Project_Onboarding/
├── package.json              # Root orchestration (concurrently, dev, build)
├── test-e2e.js               # Automated end-to-end API verification suite
│
├── server/                   # 🖥️ BACKEND (Express + SQLite)
│   ├── .env                  # Port, DB path, environment config
│   ├── .env.example          # Environment template
│   ├── package.json          # Backend dependencies (better-sqlite3, express, cors, dotenv)
│   ├── index.js              # Server entry point & startup banner
│   ├── data/
│   │   └── onboarding.db     # SQLite database (WAL mode, foreign keys enabled)
│   └── src/
│       ├── app.js            # Express application factory & middleware
│       ├── config/           # Environment & path configuration
│       ├── db/
│       │   ├── database.js   # SQLite connection, relational schema, migrations
│       │   ├── seed.js       # Standalone CLI database seed script
│       │   └── seedData.js   # Initial rich onboarding cohort dataset
│       ├── controllers/      # REST API controllers
│       │   ├── employeeController.js   # Profile CRUD & auto-workflow triggers
│       │   ├── emailController.js      # Corporate email request & provisioning
│       │   ├── permissionController.js # Software catalog & RBAC seat assignment
│       │   ├── taskController.js       # Milestone proof submission & validation
│       │   └── statsController.js      # Dashboard metrics & immutable audit trail
│       ├── routes/           # Modular Express routers
│       │   ├── employeeRoutes.js
│       │   ├── emailRoutes.js
│       │   ├── permissionRoutes.js
│       │   ├── taskRoutes.js
│       │   ├── statsRoutes.js
│       │   └── index.js
│       └── middleware/
│           ├── errorHandler.js # Centralized HTTP error handling
│           └── requestLogger.js# Request duration & status logging
│
└── client/                   # 💻 FRONTEND (React 19 + Tailwind CSS)
    ├── package.json          # React dependencies (lucide-react, canvas-confetti)
    ├── vite.config.js        # Vite + Tailwind + Proxy (/api -> http://localhost:5000)
    ├── dist/                 # Production compiled build (served automatically by backend)
    └── src/
        ├── App.jsx           # Master layout & role switcher
        ├── components/       # UI hubs, modals, and views
        ├── constants/        # Persona definitions & department presets
        └── services/api.js   # HTTP client connecting to backend REST API
```

---

## 🚀 Running the Project

### 1. Quick Start (Single Command)
From the root folder:
```bash
npm start
```
This runs both the backend server and frontend development server concurrently:
- **Web Application**: [http://localhost:5000](http://localhost:5000) (or [http://localhost:5173](http://localhost:5173))
- **REST API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 2. Run Backend Only
```bash
npm run server
# or: cd server && npm start
```

### 3. Run Automated End-to-End Test Suite
```bash
node test-e2e.js
```
Runs an automated test covering all 5 core requirements against the live SQLite backend.

### 4. Reset / Re-seed Database
```bash
npm run seed
```

---

## 📡 Backend REST API Endpoints

| Category | Method | Endpoint | Description |
|---|---|---|---|
| **Health** | `GET` | `/api/health` | Service uptime and status check |
| **Employees** | `GET` | `/api/employees` | List all employee profiles with calculated milestone progress |
| | `POST` | `/api/employees` | Create new profile (auto-provisions 7 tasks & email request) |
| | `GET` | `/api/employees/:id` | Get 360° employee view (profile, tasks, email, permissions) |
| | `PUT` | `/api/employees/:id` | Update profile information |
| | `DELETE`| `/api/employees/:id` | Archive employee and cascade delete records |
| **Tasks** | `GET` | `/api/tasks` | List tasks (filtered by `employeeId`, `phase`, `status`) |
| | `POST` | `/api/tasks` | Create custom onboarding milestone |
| | `PATCH`| `/api/tasks/:id` | Update task details |
| | `POST` | `/api/tasks/:id/submit-proof` | Employee submits verification evidence (PDF, link, notes) |
| | `POST` | `/api/tasks/:id/validate` | Designated reviewer approves or returns task with comments |
| **Email Access**| `GET` | `/api/email-requests` | List all corporate email access requests |
| | `POST` | `/api/email-requests` | Request corporate email address, aliases & distribution lists |
| | `PATCH`| `/api/email-requests/:id/status` | IT approve/provision mailbox & enforce 2FA |
| **Software** | `GET` | `/api/software/catalog` | Catalog of enterprise tools (GitHub, AWS, Figma, Slack, etc.) |
| | `GET` | `/api/permissions` | Software permissions matrix |
| | `POST` | `/api/permissions` | Assign/request software access seat |
| | `PATCH`| `/api/permissions/:id/status` | IT/SecOps clearance & seat provisioning |
| | `DELETE`| `/api/permissions/:id` | Revoke software permission seat |
| **Dashboard** | `GET` | `/api/stats` | High-level metrics & pending IT queue counts |
| | `GET` | `/api/activity-logs` | Immutable audit trail of all onboarding events |
| | `POST` | `/api/reset-demo` | Restore clean demo dataset |

---

## 🗄️ Database Schema (SQLite)

- **`employees`**: `id`, `fullName`, `personalEmail`, `corporateEmail`, `jobTitle`, `department`, `seniority`, `manager`, `startDate`, `phone`, `location`, `status`, `avatar`, `hardwarePreference`, `emergencyContactJson`, `createdAt`
- **`tasks`**: `id`, `employeeId` *(FK)*, `phase`, `title`, `description`, `category`, `assignedTo`, `validatorRole`, `priority`, `dueDate`, `status`, `proofJson`, `validationJson`
- **`email_requests`**: `id`, `employeeId` *(FK)*, `employeeName`, `department`, `requestedEmail`, `aliasesJson`, `distributionListsJson`, `mailboxTier`, `require2FA`, `securityEnforcement`, `status`, `requestedBy`, `requestedAt`, `approvedBy`, `approvedAt`, `provisionedAt`, `notes`
- **`software_catalog`**: `id`, `name`, `category`, `icon`, `color`, `rolesJson`, `defaultDepartmentsJson`
- **`software_permissions`**: `id`, `employeeId` *(FK)*, `softwareId`, `softwareName`, `role`, `licenseType`, `status`, `assignedBy`, `assignedAt`, `justification`, `securityApproval`
- **`activity_logs`**: `id`, `timestamp`, `action`, `actor`, `target`, `details`
