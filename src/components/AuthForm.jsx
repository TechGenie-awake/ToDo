// src/components/AuthForm.jsx
import React from "react";

const AuthForm = ({
  view,
  username,
  password,
  setUsername,
  setPassword,
  handleAuth,
  switchView,
  message,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-semibold mb-4 capitalize">{view}</h2>

        {message && (
          <p className="text-red-500 mb-2 text-sm text-center">{message}</p>
        )}

        <input
          className="w-full mb-2 px-3 py-2 border"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="w-full mb-4 px-3 py-2 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={() => handleAuth(view)}
          className="bg-blue-500 text-white w-full py-2 rounded mb-2"
        >
          {view === "login" ? "Log In" : "Sign Up"}
        </button>

        <button
          onClick={switchView}
          className="text-sm text-blue-500 hover:underline"
        >
          Switch to {view === "login" ? "Sign Up" : "Log In"}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
