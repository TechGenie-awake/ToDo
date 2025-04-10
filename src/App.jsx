/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthForm from "./components/AuthForm";
import TodoList from "./components/TodoList";

const API = "https://to-do-jewk.vercel.app/api";

function App() {
  const [view, setView] = useState("login"); // login | signup | todo
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState({ completed: [], incomplete: [] });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const storedUsername = localStorage.getItem("username");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/tasks`, { headers });
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch tasks failed:", err);
      setMessage("Login again.");
      setView("login");
    }
  };

  useEffect(() => {
    if (token) {
      setUsername(storedUsername || "");
      setView("todo");
      fetchTasks();
    }
  }, []);

  const handleAuth = async (type) => {
    try {
      const res = await axios.post(`${API}/${type}`, { username, password });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username); // ✅ Save username
        setView("todo");
        fetchTasks();
        setMessage("Welcome!");
      } else {
        setMessage("Signup successful! Now log in.");
        setView("login");
      }
    } catch (err) {
      setMessage(err?.response?.data?.msg || "Error occurred");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username"); // ✅ Clear username
    setView("login");
    setUsername("");
    setPassword("");
    setTask("");
    setTasks({ completed: [], incomplete: [] });
  };

  const addTask = async () => {
    if (!task.trim()) return;
    try {
      await axios.post(`${API}/tasks`, { task }, { headers });
      setTasks((prev) => ({
        ...prev,
        incomplete: [...prev.incomplete, task],
      }));
      setTask("");
    } catch (err) {
      console.error("Add task failed:", err);
    }
  };

  const toggleTask = async (taskName, fromList) => {
    try {
      await axios.put(
        `${API}/tasks/toggle`,
        { task: taskName, from: fromList },
        { headers }
      );

      const toList = fromList === "incomplete" ? "completed" : "incomplete";
      setTasks((prev) => ({
        ...prev,
        [fromList]: prev[fromList].filter((t) => t !== taskName),
        [toList]: [...prev[toList], taskName],
      }));
    } catch (err) {
      console.error("Toggle task failed:", err);
    }
  };

  const deleteTask = async (taskName, fromList) => {
    try {
      await axios.delete(`${API}/tasks`, {
        headers,
        data: { task: taskName, from: fromList },
      });

      setTasks((prev) => ({
        ...prev,
        [fromList]: prev[fromList].filter((t) => t !== taskName),
      }));
    } catch (err) {
      console.error("Delete task failed:", err);
    }
  };

  if (view !== "todo") {
    return (
      <AuthForm
        view={view}
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleAuth={handleAuth}
        switchView={() => setView(view === "login" ? "signup" : "login")}
        message={message}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-end p-4">
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded shadow"
        >
          Logout
        </button>
      </div>

      <TodoList
        username={username}
        task={task}
        setTask={setTask}
        tasks={tasks}
        addTask={addTask}
        toggleTask={toggleTask}
        deleteTask={deleteTask}
      />
    </div>
  );
}

export default App;
