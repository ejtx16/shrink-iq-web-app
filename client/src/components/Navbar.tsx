import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Link as LinkIcon, BarChart3, LogOut, User } from "lucide-react";

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <LinkIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">ShrinkIQ</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/dashboard") ? "text-primary-600 bg-primary-50" : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </>
            ) : (
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/") ? "text-primary-600 bg-primary-50" : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                }`}
              >
                Home
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:block">{user?.email}</span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:block">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive("/login") ? "text-primary-600 bg-primary-50" : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
                  }`}
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/dashboard") ? "text-primary-600 bg-primary-50" : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                isActive("/") ? "text-primary-600 bg-primary-50" : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              Home
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
