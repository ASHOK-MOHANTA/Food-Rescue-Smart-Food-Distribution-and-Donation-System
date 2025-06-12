import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User, LogOut, Home, BarChart3, Gift, MapPin } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/home', icon: Home, label: 'Home' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
    { path: '/donations', icon: Gift, label: 'Donations' },
    { path: '/map', icon: MapPin, label: 'Map' }
  ];

  if (!user) return null;

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <Gift className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold text-gray-900">FoodRescue</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {user.displayName}
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full capitalize">
              {user.role}
            </span>
            <Link
              to="/profile"
              className="flex items-center space-x-1 text-gray-600 hover:text-green-600"
            >
              <User className="h-5 w-5" />
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;