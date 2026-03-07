import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-10 py-5 font-bold text-lg bg-gradient-to-r from-blue-100 to-blue-200 shadow-md">
      
      {/* Logo / Name */}
      <div className="text-blue-700 text-xl">
        Lavanya
      </div>

      {/* Navigation Links */}
      <ul className="flex items-center space-x-8">
        <Link to="/Home">
          <li className="hover:text-blue-600 cursor-pointer">Home</li>
        </Link>

        <Link to="/Health">
          <li className="hover:text-blue-600 cursor-pointer">Health</li>
        </Link>

        <Link to="/Track">
          <li className="hover:text-blue-600 cursor-pointer">Track</li>
        </Link>

        <Link to="/Self">
          <li className="hover:text-blue-600 cursor-pointer">Self</li>
        </Link>

        <Link to="/Consult">
          <li className="hover:text-blue-600 cursor-pointer">Consult</li>
        </Link>

        {/* Logout Button (Only if logged in) */}
        {token && (
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
            >
              Logout
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Nav;