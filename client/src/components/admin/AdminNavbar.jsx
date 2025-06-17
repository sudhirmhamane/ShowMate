import React from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  return (
    <div className="flex items-center justify-between px-6 h-16 md:px-10 border-b border-gray-300/30">
      <Link to="/">
        <h2 className="text-2xl font-bold text-white mb-4">
          <span className="text-pink-600">Show</span>Mate
        </h2>
      </Link>
    </div>
  );
};

export default AdminNavbar;
