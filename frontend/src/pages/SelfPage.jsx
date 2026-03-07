import React, { useState, useEffect } from "react";
import axios from "axios";
import Task from "../components/Task";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const SelfPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [days, setDays] = useState("");

  const API = "http://localhost:5000/self";

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API, config);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addTask = async () => {
    if (!taskName || !days) return;

    try {
      const res = await axios.post(
        `${API}/add`,
        {
          Task: taskName,
          Days: Number(days),
          Streak: 0,
          LongestStreak: 0,
          WeekProgress: [false, false, false, false, false, false, false],
          WeekHistory: [],
        },
        config
      );

      setTasks([...tasks, res.data]);
      setTaskName("");
      setDays("");
    } catch (err) {
      console.error(err);
    }
  };

  const updateTask = (updatedTask) => {
    if (updatedTask.deleted) {
      setTasks((prev) => prev.filter((t) => t._id !== updatedTask._id));
      return;
    }

    setTasks((prev) =>
      prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
    );
  };

  const startNextWeek = async () => {
    try {
      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const res = await axios.put(
            `${API}/reset-week/${task._id}`,
            {},
            config
          );
          return res.data;
        })
      );
      setTasks(updatedTasks);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= SUMMARY CALCULATIONS =================
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.Days === 0).length;
  const ongoingTasks = tasks.filter((t) => t.Days > 0).length;
  const totalDaysLeft = tasks.reduce((sum, t) => sum + t.Days, 0);

  const avgStreak =
    tasks.length > 0
      ? Math.round(tasks.reduce((sum, t) => sum + t.Streak, 0) / tasks.length)
      : 0;

  const avgLongestStreak =
    tasks.length > 0
      ? Math.round(
          tasks.reduce((sum, t) => sum + t.LongestStreak, 0) / tasks.length
        )
      : 0;

  // ================= GRAPH DATA =================
  // Combine all WeekHistory values across tasks
  const maxWeeks = Math.max(
    0,
    ...tasks.map((task) => task.WeekHistory.length)
  );

  const summaryGraphData = Array.from({ length: maxWeeks }, (_, weekIndex) => {
    const totalConsistency = tasks.reduce((sum, task) => {
      return sum + (task.WeekHistory[weekIndex] || 0);
    }, 0);

    return {
      name: `Week ${weekIndex + 1}`,
      total: totalConsistency,
    };
  });

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-pink-600">
        Health Tracker
      </h1>

      <div className="flex justify-center mb-8">
        <button
          onClick={startNextWeek}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Start Next Week
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Add Task */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center">Add Task</h2>

          <input
            type="text"
            placeholder="Task name"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
          />

          <input
            type="number"
            placeholder="Number of days"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="w-full p-2 mb-4 border rounded-lg"
          />

          <button
            onClick={addTask}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg w-full"
          >
            Add Task
          </button>
        </div>

        {/* Summary + Graph */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-center text-pink-500">
            Overall Summary
          </h2>

          <div className="grid grid-cols-2 gap-4 text-gray-700 mb-6">
            <div>Total Tasks:</div>
            <div>{totalTasks}</div>

            <div>Completed Tasks:</div>
            <div>{completedTasks}</div>

            <div>Ongoing Tasks:</div>
            <div>{ongoingTasks}</div>

            <div>Total Days Left:</div>
            <div>{totalDaysLeft}</div>

            <div>Average Current Streak:</div>
            <div>{avgStreak}</div>

            <div>Average Longest Streak:</div>
            <div>{avgLongestStreak}</div>
          </div>

          {/* SUMMARY GRAPH */}
          <div>
            <p className="text-sm font-semibold mb-2">
              Weekly Total Consistency
            </p>

            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={summaryGraphData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#ec4899"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tasks.map((task) => (
          <Task key={task._id} task={task} API={API} onUpdate={updateTask} />
        ))}
      </div>
    </div>
  );
};

export default SelfPage;