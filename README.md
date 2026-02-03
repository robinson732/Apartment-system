# 🏠 Rental Management System

> **⚠️ DEMO PROJECT** - This is a learning/portfolio project. No real payments are processed. You can use fake emails for testing.

A full-stack web application for managing rental properties, tenants, and payments. Built with Flask (backend) and React (frontend).

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

> **🎭 Demo Mode:** All payments are simulated - no real money is processed!

### For Tenants
- 🔐 User authentication (signup/login)
- 🏘️ Room type selection (Bedsitter, 1-Bedroom, 2-Bedroom)
- 💳 **Simulated** payment processing for:
  - Monthly rent
  - Water bills
  - Electricity bills
- 📊 Personal dashboard showing payment status
- 💰 Real-time balance tracking

### For Landlords
- 👥 Tenant management (view all tenants)
- 💵 Payment tracking and history
- 🏗️ Property overview
- 📈 Financial reporting

---

## 🛠️ Tech Stack

### Backend
- **Flask** - Python web framework
- **SQLAlchemy** - ORM for database management
- **Flask-CORS** - Cross-Origin Resource Sharing
- **JWT** - JSON Web Tokens for authentication
- **SQLite** - Database (can be switched to PostgreSQL/MySQL)

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **CSS3** - Styling

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.8+** ([Download](https://www.python.org/downloads/))
- **pipenv** - Python dependency manager (`pip install pipenv`)
- **Node.js 16+** and npm ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/downloads))

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/rental-management-system.git
cd rental-management-system
```

### 2. Backend Setup (Flask)

#### Install pipenv (if you don't have it)

```bash
pip install pipenv
```

#### Install dependencies

```bash
# This will create a virtual environment and install from requirements.txt
pipenv install -r requirements.txt

# OR if you have a Pipfile:
pipenv install
```

#### Activate the pipenv shell

```bash
pipenv shell
```

#### Set up environment variables

Create a `.env` file in the backend directory:

```env
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///rental.db
```

#### Initialize the database

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 3. Frontend Setup (React)

Navigate to the frontend directory:

```bash
cd frontend
```

#### Install dependencies

```bash
npm install
```

#### Configure API URL

Create a `.env` file in the frontend directory (or update if it exists):

```env
VITE_API_URL=http://localhost:5000
```

**Note:** Your pages are in `src/pages/` not `src/components/`

---

## ▶️ Running the Application

You need to run both the backend and frontend servers simultaneously.

### Terminal 1: Start Backend Server

```bash
# Activate pipenv shell (if not already activated)
pipenv shell

# Run the Flask app
python app.py
```

The Flask backend will run on `http://127.0.0.1:5000` (or `http://localhost:5000`)

> **Note:** You'll see a warning: "WARNING: This is a development server. Do not use it in a production deployment."  
> This is normal for local development! This warning just means you shouldn't deploy this setup to a live website (you'd use Gunicorn or similar for production).

### Terminal 2: Start Frontend Server

```bash
# Navigate to frontend directory
cd frontend

# Start Vite dev server
npm run dev
```

The React frontend will run on `http://localhost:5173`

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## 📁 Project Structure

```
FULL-STACK/
├── backend/
│   ├── __pycache__/           # Python cache files
│   ├── migrations/            # Database migrations
│   ├── models/
│   │   ├── __pycache__/
│   │   ├── __init__.py
│   │   ├── house.py           # House model
│   │   ├── landlord.py        # Landlord model
│   │   ├── messages.py        # Messages model
│   │   ├── payment.py         # Payment model
│   │   └── tenant.py          # Tenant model
│   ├── routes/
│   │   ├── __pycache__/
│   │   ├── __init__.py
│   │   ├── auth_routes.py     # Authentication routes
│   │   ├── landlord_routes.py # Landlord management routes
│   │   ├── payments_routes.py # Payment routes
│   │   └── tenants_routes.py  # Tenant management routes
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── house.py
│   │   ├── landlord.py
│   │   └── message.py
│   ├── venv/                  # Virtual environment (or use pipenv)
│   ├── app.py                 # Flask application entry point
│   ├── config.py              # Configuration settings
│   ├── extensions.py          # Flask extensions (db, cors)
│   ├── Pipfile                # Pipenv dependencies
│   ├── requirements.txt       # Python dependencies
│   └── seed_data.py           # Sample data seeder
│
├── frontend/
│   ├── node_modules/          # Node dependencies
│   ├── public/                # Static assets
│   ├── src/
│   │   ├── assets/            # Images, fonts, etc.
│   │   ├── pages/
│   │   │   ├── Footer.jsx
│   │   │   ├── Landing.jsx
│   │   │   ├── Landlord.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RoomSelection.jsx
│   │   │   ├── SignUp.jsx
│   │   │   ├── TenantDashboard.jsx
│   │   │   ├── TenantLanding.jsx
│   │   │   └── Tenants.jsx
│   │   ├── styles/
│   │   │   ├── Landing.css
│   │   │   ├── Landlord.css
│   │   │   ├── Login.css
│   │   │   ├── Navbar.css
│   │   │   ├── RoomSelection.css
│   │   │   ├── SignUp.css
│   │   │   ├── TenantDashboard.css
│   │   │   ├── TenantLanding.css
│   │   │   └── Tenants.css
│   │   ├── App.jsx             # Main App component
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # React entry point
│   ├── .gitignore
│   ├── eslint.config.js        # ESLint configuration
│   ├── index.html              # HTML template
│   ├── package-lock.json
│   ├── package.json            # Node dependencies
│   ├── README.md
│   └── vite.config.js          # Vite configuration (if using Vite)
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication (`auth_routes.py`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register new user (tenant/landlord) |
| POST | `/auth/login` | Login user |

### Tenants (`tenants_routes.py`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tenants` | Get all tenants | No |
| GET | `/api/tenants/me` | Get current tenant info | Yes (Tenant) |
| POST | `/api/tenants/select-room` | Select room type | Yes (Tenant) |
| PUT | `/api/tenants/pay/:id` | Process payment | Yes |
| DELETE | `/api/tenants/:id` | Remove tenant | Yes (Landlord) |

### Landlord (`landlord_routes.py`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/landlord/dashboard` | Get landlord dashboard data | Yes (Landlord) |
| GET | `/api/landlord/tenants` | View all tenants | Yes (Landlord) |

### Payments (`payments_routes.py`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/payments` | Get payment history | Yes |
| POST | `/api/payments` | Record new payment | Yes |

---

## 🔑 Demo Credentials

> **Note:** This is a demo project - you can use **any fake email** for testing. No email verification required!

### Example Test Accounts

**Tenant Account:**
- **Email:** `tenant@test.com` (or any fake email)
- **Name:** `John Tenant`
- **Password:** `password123`

**Landlord Account:**
- **Email:** `johndoe@example.com` (must use this specific email)
- **Access Code:** `landlord123`
- **Password:** (set during signup)

💡 **Tip:** You can create multiple tenant accounts with any email format (e.g., `test1@fake.com`, `demo@demo.com`, etc.)

---

## 💡 Usage Guide

> **Remember:** This is a demo! Use any fake email - no verification needed.

### For Tenants

1. **Sign Up**
   - Navigate to signup page
   - Use **any fake email** (e.g., `test@demo.com`, `tenant1@fake.com`)
   - Enter any name
   - Create a password
   - Select "Tenant" as role
   - Click "Sign Up"

2. **Select Room Type**
   - After login, you'll be redirected to room selection
   - Choose: Bedsitter, 1-Bedroom, or 2-Bedroom
   - Proceed to dashboard

3. **Make Payments** (Simulated)
   - View your payment status on the dashboard
   - Click "Pay Now" on any pending payment
   - Payment will be instantly marked as complete (no real money charged!)

### For Landlords

1. **Sign Up** (One-time setup)
   - Must use the email: `johndoe@example.com`
   - Enter the access code: `landlord123`
   - Set your password

2. **View Tenants**
   - See all registered tenants
   - Check payment statuses
   - View outstanding balances (all simulated)

---

## 🎨 Rent Pricing

| Room Type | Monthly Rent |
|-----------|--------------|
| Bedsitter | Ksh 5,000 |
| 1-Bedroom | Ksh 8,000 |
| 2-Bedroom | Ksh 12,000 |

**Utility Bills (Fixed):**
- Water: Ksh 800/month
- Electricity: Ksh 1,200/month

---

### troubleshooting

### Backend won't start
```bash
# Make sure pipenv shell is activated
pipenv shell

# Reinstall dependencies
pipenv install -r requirements.txt --skip-lock

# OR remove and recreate environment
pipenv --rm
pipenv install
```

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database errors
```bash
# Reset database
flask db downgrade
flask db upgrade
```

### CORS errors
- Check that `VITE_API_URL` in frontend `.env` matches backend URL
- Ensure Flask-CORS is installed and configured

---

## 🚧 Upcoming Features

- [ ] Email notifications for payments
- [ ] Payment history tracking
- [ ] PDF receipt generation
- [ ] Property image uploads
- [ ] Maintenance request system
- [ ] Real payment gateway integration (M-Pesa, Stripe)
- [ ] Admin dashboard analytics
- [ ] Multi-language support

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

This is my **first full-stack project** built for learning purposes!

**[Your Name]**
- GitHub: [@robinson732](https://github.com/robinson732)
- Email: kimanirobinson336@gmail,com

---

## 🎓 Learning Journey

This project helped me learn:
- ✅ Full-stack development (React + Flask)
- ✅ RESTful API design
- ✅ JWT authentication
- ✅ Database management with SQLAlchemy
- ✅ State management in React
- ✅ React Router for navigation
- ✅ CORS handling
- ✅ Environment variables

## ⚠️ Disclaimer

**This is a learning/portfolio project:**
- No real payments are processed
- Email validation is not implemented (use any fake email)
- Security features are basic (not production-ready)
- Data is stored in SQLite (demo purposes only)
- Not intended for actual commercial use

**Use this project to learn, practice, and showcase your skills!**

