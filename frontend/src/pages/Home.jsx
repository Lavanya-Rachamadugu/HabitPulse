import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import { Link } from "react-router-dom";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [overallSummary, setOverallSummary] = useState(null);
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const calculateSummary = (tasks, name, route) => {
    const totalTasks = tasks.length;
    const completed = tasks.filter((t) => t.Days === 0).length;
    const ongoing = tasks.filter((t) => t.Days > 0).length;

    const avgStreak =
      tasks.length > 0
        ? Math.round(tasks.reduce((sum, t) => sum + t.Streak, 0) / tasks.length)
        : 0;

    const performance =
      tasks.reduce((sum, t) => sum + t.LongestStreak, 0) +
      tasks.reduce(
        (sum, t) =>
          sum +
          t.WeekHistory.reduce((weekSum, val) => weekSum + val, 0),
        0
      );

    return {
      name,
      route,
      totalTasks,
      completed,
      ongoing,
      avgStreak,
      performance,
    };
  };

  const fetchAll = async () => {
    try {
      const [health, self, track] = await Promise.all([
        axios.get("http://localhost:5000/health", config),
        axios.get("http://localhost:5000/self", config),
        axios.get("http://localhost:5000/track", config),
      ]);

      const data = [
        calculateSummary(health.data, "Health", "/health"),
        calculateSummary(self.data, "Self", "/self"),
        calculateSummary(track.data, "Track", "/track"),
      ];

      setCategories(data);

      // ================= OVERALL SUMMARY =================
      const totalTasks = data.reduce((sum, cat) => sum + cat.totalTasks, 0);
      const completed = data.reduce((sum, cat) => sum + cat.completed, 0);
      const ongoing = data.reduce((sum, cat) => sum + cat.ongoing, 0);
      const avgStreak =
        data.length > 0
          ? Math.round(
              data.reduce((sum, cat) => sum + cat.avgStreak, 0) / data.length
            )
          : 0;

      setOverallSummary({
        totalTasks,
        completed,
        ongoing,
        avgStreak,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-10 pt-2">
      <Nav />
      {overallSummary && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-5 grid grid-cols-1 md:grid-cols-4 text-center mt-5">
          <div>
            <h3 className="font-semibold text-gray-600">Total Tasks</h3>
            <p className="text-xl font-bold">{overallSummary.totalTasks}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Completed</h3>
            <p className="text-xl font-bold">{overallSummary.completed}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Ongoing</h3>
            <p className="text-xl font-bold">{overallSummary.ongoing}</p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-600">Avg Streak</h3>
            <p className="text-xl font-bold">{overallSummary.avgStreak}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {categories.map((cat) => (
          <Link to={cat.route} key={cat.name}>
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 cursor-pointer">
              <h2 className="text-xl font-bold text-pink-600 mb-4">{cat.name}</h2>
              <div className="space-y-2 text-gray-700">
                <p>Total Tasks: {cat.totalTasks}</p>
                <p>Completed: {cat.completed}</p>
                <p>Ongoing: {cat.ongoing}</p>
                <p>Avg Streak: {cat.avgStreak}</p>
                <p className="font-semibold">Performance Score: {cat.performance}</p>
              </div>
              <button className="mt-4 w-full bg-pink-500 text-white py-2 rounded-lg hover:bg-pink-600">
                View {cat.name}
              </button>
            </div>
          </Link>
        ))}
      </div>
      <div className="bg-white p-8 rounded-xl shadow-md mb-12 text-center">
        <h2 className="text-2xl font-bold mb-4 text-pink-600">Try a Personalized Diet Plan</h2>
        <div className="flex justify-around">
          <p className="mb-6 text-gray-700 px-10 pt-2">
          Want a diet plan tailored to your goals, lifestyle, and preferences? Click below to get started!
        </p>
        <Link to="/Consult">
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition px-10">
            Generate My Diet Plan
          </button>
        </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;