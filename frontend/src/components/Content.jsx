// components/Main.jsx
import React from 'react';

export default function Content({
  userRole,
  patients,
  appointments,
  notifications,
  selectedPatient,
  setSelectedPatient,
  showPatientForm,
  setShowPatientForm,
  showAppointmentForm,
  setShowAppointmentForm,
  patientForm,
  setPatientForm,
  appointmentForm,
  setAppointmentForm,
  createPatient,
  createAppointment,
  updateAppointmentStatus,
  loading,
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: role-based content */}
        <div className="lg:col-span-1">
          {userRole === 'doctor' ? (
            <div className="space-y-6">
              {/* Patients Panel for Doctors */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Patients
                  </h2>
                  <button
                    onClick={() => setShowPatientForm(!showPatientForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                  >
                    + Add Patient
                  </button>
                </div>

                {showPatientForm && (
                  <form
                    onSubmit={createPatient}
                    className="mb-6 p-4 bg-gray-50 rounded-lg"
                  >
                    <h3 className="font-medium text-gray-900 mb-4">
                      New Patient
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={patientForm.name}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            name: e.target.value,
                          })
                        }
                      />
                      <input
                        type="email"
                        placeholder="Email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={patientForm.email}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            email: e.target.value,
                          })
                        }
                      />
                      <input
                        type="tel"
                        placeholder="Phone"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={patientForm.phone}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            phone: e.target.value,
                          })
                        }
                      />
                      <input
                        type="date"
                        placeholder="Date of Birth"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={patientForm.date_of_birth}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            date_of_birth: e.target.value,
                          })
                        }
                      />
                      <textarea
                        placeholder="Medical Notes"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows="3"
                        value={patientForm.medical_notes}
                        onChange={(e) =>
                          setPatientForm({
                            ...patientForm,
                            medical_notes: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm disabled:opacity-50"
                        >
                          {loading ? 'Saving...' : 'Save Patient'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPatientForm(false)}
                          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {patients.map((patient) => (
                    <div
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className={`p-4 rounded-lg border cursor-pointer transition duration-200 ${
                        selectedPatient?.id === patient.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h3 className="font-medium text-gray-900">
                        {patient.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {patient.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {patient.phone}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointments Panel for Doctors */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Appointments
                </h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {appointment.patient_name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {appointment.appointment_date} at{' '}
                            {appointment.appointment_time}
                          </p>
                          <p className="text-sm text-gray-600">
                            Reason: {appointment.reason}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              appointment.status === 'pending'
                                ? 'text-yellow-600'
                                : appointment.status === 'confirmed'
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            Status: {appointment.status}
                          </p>
                        </div>
                        {appointment.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  'confirmed'
                                )
                              }
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() =>
                                updateAppointmentStatus(
                                  appointment.id,
                                  'cancelled'
                                )
                              }
                              className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Appointment Booking for Patients */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Book Appointment
                  </h2>
                  <button
                    onClick={() =>
                      setShowAppointmentForm(!showAppointmentForm)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 text-sm"
                  >
                    + New Appointment
                  </button>
                </div>

                {showAppointmentForm && (
                  <form
                    onSubmit={createAppointment}
                    className="mb-6 p-4 bg-gray-50 rounded-lg"
                  >
                    <h3 className="font-medium text-gray-900 mb-4">
                      Book New Appointment
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="date"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={appointmentForm.appointment_date}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            appointment_date: e.target.value,
                          })
                        }
                      />
                      <input
                        type="time"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={appointmentForm.appointment_time}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            appointment_time: e.target.value,
                          })
                        }
                      />
                      <input
                        type="text"
                        placeholder="Reason for visit"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        value={appointmentForm.reason}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            reason: e.target.value,
                          })
                        }
                      />
                      <textarea
                        placeholder="Additional notes (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        rows="3"
                        value={appointmentForm.notes}
                        onChange={(e) =>
                          setAppointmentForm({
                            ...appointmentForm,
                            notes: e.target.value,
                          })
                        }
                      />
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm disabled:opacity-50"
                        >
                          {loading ? 'Booking...' : 'Book Appointment'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAppointmentForm(false)}
                          className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500 transition duration-200 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>

              {/* My Appointments for Patients */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  My Appointments
                </h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {appointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="p-4 border rounded-lg"
                    >
                      <p className="font-medium text-gray-900">
                        {appointment.appointment_date} at{' '}
                        {appointment.appointment_time}
                      </p>
                      <p className="text-sm text-gray-600">
                        Reason: {appointment.reason}
                      </p>
                      <p
                        className={`text-sm font-medium ${
                          appointment.status === 'pending'
                            ? 'text-yellow-600'
                            : appointment.status === 'confirmed'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        Status: {appointment.status}
                      </p>
                      {appointment.notes && (
                        <p className="text-sm text-gray-500">
                          Notes: {appointment.notes}
                        </p>
                      )}
                    </div>
                  ))}
                  {appointments.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No appointments yet. Book your first appointment!
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Chatbot */}
        <div className="lg:col-span-2">
          {/* In App.js you will import <Chatbot/> here */}
          {/* e.g.: <Chatbot 
                    chatMessages={chatMessages}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    sendChatMessage={sendChatMessage}
                    userRole={userRole}
                    selectedPatient={selectedPatient}
                  /> 
          */}
        </div>
      </div>
    </div>
  );
}
