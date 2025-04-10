import React from "react";

const TodoList = ({
  username,
  task,
  setTask,
  tasks,
  addTask,
  toggleTask,
  deleteTask,
}) => {
  return (
    <div className="min-h-screen bg-cover bg-center p-6">
      <div className="max-w-3xl mx-auto bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/30">
        <div className="flex  justify-start mb-4">
          <h1 className="text-3xl font-bold text-center">
            📋 {username}'s ToDo
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-3 mb-6">
          <input
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded w-full"
            placeholder="Add new task"
          />
          <button
            onClick={addTask}
            className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition w-full md:w-auto"
          >
            Add
          </button>
        </div>

        {/* Incomplete Tasks */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-white">
            🕐 Incomplete
          </h2>
          <ul className="space-y-2">
            {tasks.incomplete.map((t, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white/80 p-3 shadow rounded hover:shadow-md transition"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={false}
                    onChange={() => toggleTask(t, "incomplete")}
                  />

                  <span className="text-gray-800 font-medium">{t}</span>
                </div>
                <button
                  onClick={() => deleteTask(t, "incomplete")}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Completed Tasks */}
        <div>
          <h2 className="text-xl font-semibold mb-3 text-white">
            ✅ Completed
          </h2>
          <ul className="space-y-2">
            {tasks.completed.map((t, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white/60 p-3 shadow rounded hover:shadow-md transition"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={true}
                    onChange={() => toggleTask(t, "completed")}
                  />

                  <span className="line-through text-gray-500">{t}</span>
                </div>
                <button
                  onClick={() => deleteTask(t, "completed")}
                  className="text-red-500 hover:text-red-600 transition"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoList;
