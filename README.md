# 🦷 DentalAI - AI-Powered Dental Assistant

A comprehensive dental practice management system with AI-powered chat assistance for both patients and healthcare professionals.

## 🌟 Features

### For Patients
- **User Registration & Authentication**: Secure account creation and login
- **Appointment Booking**: Schedule appointments with preferred dates and times
- **Appointment Management**: View and track appointment status (pending, confirmed, cancelled, completed)
- **AI Chat Assistant**: Get dental health tips, oral care advice, and general guidance
- **Personal Dashboard**: Manage personal appointments and medical information

### For Doctors
- **Professional Dashboard**: Comprehensive view of practice operations
- **Patient Management**: Add, view, and manage patient records
- **Appointment Management**: Review, confirm, or cancel patient appointments
- **AI Clinical Assistant**: Get professional insights, treatment recommendations, and clinical guidance
- **Real-time Notifications**: Receive alerts for new appointments and practice updates
- **Patient Context Chat**: AI assistance with specific patient information for personalized care

## 🏗️ Architecture

### Backend (FastAPI + MongoDB)
- **FastAPI**: Modern, fast web framework for building APIs
- **MongoDB**: NoSQL database with Motor async driver
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Separate permissions for patients and doctors
- **OpenAI Integration**: AI-powered chat functionality

### Frontend (React + Vite)
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Axios**: HTTP client for API communication
- **Component-based Architecture**: Modular and reusable UI components

## 📁 Project Structure

```
DentalAI/
├── backend/
│   ├── routers/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── patients.py      # Patient management
│   │   ├── appointments.py  # Appointment handling
│   │   ├── notifications.py # Doctor notifications
│   │   └── chat.py          # AI chat functionality
│   ├── database.py          # MongoDB connection
│   ├── models.py            # Pydantic models
│   ├── dependencies.py      # Auth dependencies
│   ├── utils.py             # Utility functions
│   └── main.py              # FastAPI application
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx   # Navigation component
│   │   │   ├── Content.jsx  # Main content area
│   │   │   └── Chatbot.jsx  # AI chat interface
│   │   ├── App.jsx          # Main application
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Styles
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- MongoDB database
- OpenAI API key

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd DentalAI/backend
   ```

2. **Install dependencies**
   ```bash
   pip install fastapi uvicorn motor python-dotenv passlib[bcrypt] python-jose[cryptography] openai
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=dental_ai
   SECRET_KEY=your-super-secret-key-change-this-in-production
   OPENAI_API_KEY=your-openai-api-key
   ```

4. **Start the backend server**
   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   VITE_REACT_APP_BACKEND_URL=http://localhost:8000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication with role-based access control:

- **Patients**: Can book appointments, view their own appointments, and chat with AI
- **Doctors**: Can manage patients, handle appointments, receive notifications, and access clinical AI features

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Patients (Doctor only)
- `POST /api/patients` - Create new patient
- `GET /api/patients` - List patients
- `GET /api/patients/{id}` - Get patient details
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Appointments
- `POST /api/appointments` - Book appointment (Patient)
- `GET /api/appointments` - List appointments
- `PUT /api/appointments/{id}` - Update appointment status (Doctor)

### Notifications (Doctor only)
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/{id}/read` - Mark as read

### AI Chat
- `POST /api/chat` - Chat with AI assistant

## 🤖 AI Features

### Patient Mode
- General dental health advice
- Oral care tips and recommendations
- Symptom information (educational only)
- Preventive care guidance

### Doctor Mode
- Clinical insights and recommendations
- Treatment planning assistance
- Patient-specific consultations
- Professional dental knowledge base

## 🔧 Configuration

### Database Models
- **Users**: Authentication and role management
- **Patients**: Patient information and medical history
- **Appointments**: Scheduling and status tracking
- **Notifications**: Real-time alerts for doctors

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Role-based route protection
- CORS configuration for cross-origin requests

## 🚀 Deployment

### Backend Deployment
1. Set up production MongoDB instance
2. Configure environment variables
3. Use production WSGI server (e.g., Gunicorn)
4. Set up reverse proxy (Nginx)

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables

## 🛠️ Development

### Adding New Features
1. Backend: Add new routers in `routers/` directory
2. Frontend: Create new components in `components/` directory
3. Update models in `models.py` for data structure changes
4. Add appropriate authentication and validation

### Testing
- Backend: Add unit tests for API endpoints
- Frontend: Add component tests with React Testing Library
- Integration: Test API and frontend integration

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🔍 Troubleshooting

### Common Issues
- **MongoDB Connection**: Ensure MongoDB is running and connection string is correct
- **OpenAI API**: Verify API key is valid and has sufficient credits
- **CORS Errors**: Check frontend and backend URLs match environment configuration
- **Authentication**: Ensure JWT secret key is consistent between sessions

### Logs
- Backend logs are configured in `main.py`
- Frontend errors appear in browser console
- Check network tab for API request/response issues

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For support, please:
1. Check the troubleshooting section
2. Review API documentation at `/docs`
3. Open an issue on the repository
4. Contact the development team

## 🎯 Future Enhancements

- [ ] Email notifications for appointments
- [ ] SMS reminders
- [ ] Calendar integration
- [ ] Telemedicine video calls
- [ ] Electronic health records integration
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Advanced AI diagnostic tools

---

Built with ❤️ for better dental care management
