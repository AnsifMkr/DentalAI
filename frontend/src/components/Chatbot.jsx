// components/Chatbot.jsx
import React from 'react';

export default function Chatbot({
  chatMessages,
  chatInput,
  setChatInput,
  sendChatMessage,
  userRole,
  selectedPatient,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          🤖 AI Dental Assistant
          {userRole === 'doctor' ? ' (Professional Mode)' : ' (Patient Mode)'}
        </h2>
        {selectedPatient && userRole === 'doctor' && (
          <p className="text-sm text-gray-600 mt-1">
            Consulting about:{' '}
            <span className="font-medium">{selectedPatient.name}</span>
          </p>
        )}
      </div>

      <div
        className="flex-1 p-6 overflow-y-auto"
        style={{ height: '400px' }}
      >
        {chatMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-4">🦷</div>
            <p className="font-medium">Welcome to your AI Dental Assistant!</p>
            <p className="text-sm mt-2">
              {userRole === 'doctor'
                ? "Get professional insights, treatment recommendations, and clinical guidance. Select a patient for personalized consultation."
                : "Ask me about dental health, oral care tips, or any concerns you might have. I'm here to help!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {chatMessages.map((message, idx) => (
              <div
                key={idx}
                className={`flex ${
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : userRole === 'doctor'
                      ? 'bg-green-100 text-green-900'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.type === 'user'
                        ? 'text-blue-200'
                        : userRole === 'doctor'
                        ? 'text-green-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 border-t">
        <form onSubmit={sendChatMessage} className="flex gap-3">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder={
              userRole === 'doctor'
                ? "Ask about treatments, diagnosis, or patient care..."
                : "Ask about dental health, symptoms, or oral care..."
            }
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!chatInput.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
