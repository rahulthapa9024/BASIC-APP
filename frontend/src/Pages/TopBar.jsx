import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserImage, logoutUser } from "../../slices/userSlice";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { photoURL, imageLoading } = useSelector((state) => state.auth);
  const [initials, setInitials] = useState("?");

  useEffect(() => {
    dispatch(getUserImage());

    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        if (user.displayName) {
          const parts = user.displayName.split(" ");
          const initials = parts.map((p) => p[0]).join("").toUpperCase();
          setInitials(initials.slice(0, 2));
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(".profile-dropdown")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => setDropdownOpen((open) => !open);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/signup");
  };

  const handleNavigate = (path) => navigate(path);



  return (
    <header className="flex items-center justify-between bg-black text-white p-4 shadow-md border-b border-gray-800 relative z-30">
      {/* Logo */}
      <div
        className="text-white font-bold text-2xl cursor-pointer hover:text-red-500 transition-colors duration-300"
        onClick={() => handleNavigate("/dashboard")}
      >
       SYMBOL
      </div>

      {/* Navigation - hidden on small screens */}

      {/* Profile Dropdown */}
      <div className="relative profile-dropdown">
        <button
          onClick={toggleDropdown}
          className="focus:outline-none"
          aria-label="User menu"
          aria-expanded={dropdownOpen}
          type="button"
        >
          {imageLoading ? (
            <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
          ) : photoURL ? (
            <div className="w-10 h-10 rounded-full overflow-hidden hover:border-red-300 transition-all duration-300 cursor-pointer">
              <img
                src={photoURL}
                alt="User profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                  e.target.parentElement.className =
                    "w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-500 hover:scale-110 transform transition-all duration-300";
                  e.target.parentElement.textContent = initials;
                }}
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-red-500 hover:scale-110 transform transition-all duration-300">
              {initials}
            </div>
          )}
        </button>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-700 hover:text-white transition-colors duration-300"
              type="button"
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
