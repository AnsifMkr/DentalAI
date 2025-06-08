// App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

import Navbar from './components/Navbar';
import Content from './components/Content';
import Chatbot from './components/Chatbot';

const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

function App() {
  // ─────── State ─────────────────────────────────────────────
  const [currentView, setCurrentView] = useState('login');
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');

  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Auth forms state
  const [authForm, setAuthForm] = useState({
    username: '',
    email: '',
    password: '',
    role: 'patient',
    full_name: '',
  });

  // Patient form state
  const [patientForm, setPatientForm] = useState({
    name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    medical_notes: '',
    last_visit: '',
  });

  // Appointment form state
  const [appointmentForm, setAppointmentForm] = useState({
    appointment_date: '',
    appointment_time: '',
    reason: '',
    notes: '',
  });

  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  // ─────── Effects ────────────────────────────────────────────
  useEffect(() => {
    if (token && userRole) {
      setCurrentView('dashboard');
      if (userRole === 'doctor') {
        fetchPatients();
        fetchNotifications();
      }
      fetchAppointments();
    }
  }, [token, userRole]);

  // ─────── Handlers ───────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/login`, {
        username: authForm.username,
        password: authForm.password,
      });
      const { access_token, user_role, user_id } = response.data;
      setToken(access_token);
      setUserRole(user_role);
      setUserId(user_id);
      localStorage.setItem('token', access_token);
      localStorage.setItem('userRole', user_role);
      localStorage.setItem('userId', user_id);
      setCurrentView('dashboard');
    } catch (err) {
      alert('Login failed: ' + (err.response?.data?.detail || 'Unknown error'));
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/register`, authForm);
      alert(`Registration successful as ${authForm.role}! Please login.`);
      setCurrentView('login');
    } catch (err) {
      alert(
        'Registration failed: ' + (err.response?.data?.detail || 'Unknown error')
      );
    }
    setLoading(false);
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    setCurrentView('login');
    setPatients([]);
    setAppointments([]);
    setNotifications([]);
    setChatMessages([]);
    setSelectedPatient(null);
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/patients`, axiosConfig);
      setPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/appointments`,
        axiosConfig
      );
      setAppointments(res.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/notifications`,
        axiosConfig
      );
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const createPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/patients`,
        patientForm,
        axiosConfig
      );
      setPatientForm({
        name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        medical_notes: '',
        last_visit: '',
      });
      setShowPatientForm(false);
      fetchPatients();
      alert('Patient created successfully!');
    } catch (err) {
      alert(
        'Failed to create patient: ' + (err.response?.data?.detail || 'Unknown')
      );
    }
    setLoading(false);
  };

  const createAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/appointments`,
        appointmentForm,
        axiosConfig
      );
      setAppointmentForm({
        appointment_date: '',
        appointment_time: '',
        reason: '',
        notes: '',
      });
      setShowAppointmentForm(false);
      fetchAppointments();
      alert('Appointment booked successfully!');
    } catch (err) {
      alert(
        'Failed to book appointment: ' +
          (err.response?.data?.detail || 'Unknown')
      );
    }
    setLoading(false);
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/appointments/${appointmentId}`,
        {
          status: status,
          notes: `Status updated to ${status} by doctor`,
        },
        axiosConfig
      );
      fetchAppointments();
      fetchNotifications();
      alert(`Appointment ${status} successfully!`);
    } catch (err) {
      alert(
        'Failed to update appointment: ' +
          (err.response?.data?.detail || 'Unknown')
      );
    }
  };

  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    // Add user message
    setChatMessages((prev) => [
      ...prev,
      { type: 'user', content: chatInput, timestamp: new Date() },
    ]);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/chat`,
        {
          message: chatInput,
          patient_id: selectedPatient?.id,
        },
        axiosConfig
      );

      setChatMessages((prev) => [
        ...prev,
        { type: 'ai', content: res.data.response, timestamp: new Date() },
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    }

    setChatInput('');
  };

  // ─────── Rendering ──────────────────────────────────────────
  const renderAuthView = (isLogin) => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">🦷 DentalAI</h1>
          <p className="text-gray-600">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </p>
        </div>

        <form
          onSubmit={isLogin ? handleLogin : handleRegister}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={authForm.username}
              onChange={(e) =>
                setAuthForm({ ...authForm, username: e.target.value })
              }
              placeholder={isLogin ? 'Enter your username' : 'Choose a username'}
            />
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={authForm.full_name}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, full_name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  I am a:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="patient"
                      checked={authForm.role === 'patient'}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, role: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Patient</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value="doctor"
                      checked={authForm.role === 'doctor'}
                      onChange={(e) =>
                        setAuthForm({ ...authForm, role: e.target.value })
                      }
                      className="mr-2"
                    />
                    <span className="text-sm">Doctor</span>
                  </label>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={authForm.password}
              onChange={(e) =>
                setAuthForm({ ...authForm, password: e.target.value })
              }
              placeholder={isLogin ? 'Enter your password' : 'Create a password'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            onClick={() =>
              setCurrentView(isLogin ? 'register' : 'login')
            }
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            {isLogin ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );

  if (currentView === 'login') return renderAuthView(true);
  if (currentView === 'register') return renderAuthView(false);

  // ─────── Dashboard View ───────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        userRole={userRole}
        notifications={notifications}
        onLogout={logout}
      />

      <div className="flex">
        <Content
          userRole={userRole}
          patients={patients}
          appointments={appointments}
          notifications={notifications}
          selectedPatient={selectedPatient}
          setSelectedPatient={setSelectedPatient}
          showPatientForm={showPatientForm}
          setShowPatientForm={setShowPatientForm}
          showAppointmentForm={showAppointmentForm}
          setShowAppointmentForm={setShowAppointmentForm}
          patientForm={patientForm}
          setPatientForm={setPatientForm}
          appointmentForm={appointmentForm}
          setAppointmentForm={setAppointmentForm}
          createPatient={createPatient}
          createAppointment={createAppointment}
          updateAppointmentStatus={updateAppointmentStatus}
          loading={loading}
        />

        <div className="hidden lg:block lg:col-span-2">
          <Chatbot
            chatMessages={chatMessages}
            chatInput={chatInput}
            setChatInput={setChatInput}
            sendChatMessage={sendChatMessage}
            userRole={userRole}
            selectedPatient={selectedPatient}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
