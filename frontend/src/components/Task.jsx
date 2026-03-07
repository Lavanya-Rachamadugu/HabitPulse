import React from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Task = ({ task, API, onUpdate }) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const completedDays = task.WeekProgress.filter(Boolean).length;

  // ✅ Get token
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleCheck = async (index) => {
    const updatedTask = { ...task };
    const currentValue = updatedTask.WeekProgress[index];
    updatedTask.WeekProgress[index] = !currentValue;

    if (!currentValue) {
      if (updatedTask.Days > 0) updatedTask.Days -= 1;
      updatedTask.Streak += 1;
      updatedTask.LongestStreak = Math.max(
        updatedTask.Streak,
        updatedTask.LongestStreak
      );
    } else {
      updatedTask.Days += 1;
      updatedTask.Streak -= 1;
    }

    try {
      const res = await axios.put(
        `${API}/${task._id}`,
        updatedTask,
        config   // ✅ send token
      );
      onUpdate(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${API}/${task._id}`,
        config   // ✅ send token
      );
      onUpdate({ ...task, deleted: true });
    } catch (err) {
      console.error(err);
    }
  };

  const graphData =
    task.WeekHistory.length > 0
      ? task.WeekHistory.map((value, index) => ({
          name: `Week ${index + 1}`,
          consistency: value,
        }))
      : [{ name: "Week 1", consistency: 0 }];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
      <h3
        className={`text-xl font-bold mb-2 ${
          task.Days === 0 ? "text-green-500 line-through" : "text-pink-600"
        }`}
      >
        {task.Task}
      </h3>

      <div className="text-sm space-y-1 text-gray-600">
        <p>Days Left: {task.Days}</p>
        <p>Current Streak: {task.Streak}</p>
        <p>Longest Streak: {task.LongestStreak}</p>
      </div>

      <div className="flex justify-between mt-4">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center text-xs">
            <span>{day}</span>
            <input
              type="checkbox"
              checked={task.WeekProgress[index]}
              onChange={() => handleCheck(index)}
              className="mt-1 accent-pink-500 w-4 h-4"
            />
          </div>
        ))}
      </div>

      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-pink-500 rounded-full transition-all"
            style={{ width: `${(completedDays / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {task.Days === 0 && (
        <button
          onClick={handleDelete}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg w-full"
        >
          Delete Task
        </button>
      )}

      <div className="mt-6">
        <p className="text-sm font-semibold mb-2">Weekly Consistency</p>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={graphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 7]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="consistency"
              stroke="#ec4899"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Task;