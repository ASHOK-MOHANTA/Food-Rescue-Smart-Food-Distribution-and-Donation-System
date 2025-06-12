import React, { useState } from 'react';
import { User, Mail, MapPin, Calendar, Edit2, Save, X, Phone } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useUserStats } from '../hooks/useUserStats';
import AnalyticsCharts from '../components/Profile/AnalyticsCharts';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const { stats, analytics, loading } = useUserStats(user?.id, user?.role);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    role: user?.role || 'recipient',
    phone_number: user?.phone_number || '',
    address: user?.address || ''
  });

  const handleSave = async () => {
    if (!user) return;

    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: user?.full_name || '',
      role: user?.role || 'recipient',
      phone_number: user?.phone_number || '',
      address: user?.address || ''
    });
    setIsEditing(false);
  };

  const getImpactStats = () => {
    if (!user) return {};

    switch (user.role) {
      case 'donor':
        return {
          primary: { label: 'Food Donated Weight', value: `${stats.totalDonatedWeight} kg` },
          secondary: { label: 'Food Donated Items', value: `${stats.totalDonatedItems}+` }
        };
      case 'volunteer':
        return {
          primary: { label: 'Deliveries Made', value: `${stats.totalDeliveries}+` },
          secondary: { label: 'Food Weight Delivered', value: `${stats.totalDonatedWeight} kg` }
        };
      case 'recipient':
        return {
          primary: { label: 'Available Food Items', value: `${stats.totalReceivedItems}+` },
          secondary: { label: 'Community Impact', value: 'Active Member' }
        };
      default:
        return {};
    }
  };

  const impactStats = getImpactStats();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Personal Information Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - User Details */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <User className="h-8 w-8 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={formData.full_name}
                              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                              className="border border-gray-300 rounded-md px-3 py-1 text-lg font-semibold"
                            />
                          ) : (
                            `Full Name: ${user.full_name}`
                          )}
                        </h3>
                        <p className="text-gray-600 capitalize">
                          Account Type: {isEditing ? (
                            <select
                              value={formData.role}
                              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                              className="border border-gray-300 rounded-md px-2 py-1 ml-1"
                            >
                              <option value="donor">Donor</option>
                              <option value="volunteer">Volunteer</option>
                              <option value="recipient">Recipient</option>
                            </select>
                          ) : (
                            user.role
                          )}
                        </p>
                      </div>
                    </div>
                    
                    {!isEditing ? (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    ) : (
                      <div className="space-x-2">
                        <button
                          onClick={handleSave}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <Save className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancel}
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Phone Number:
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone_number}
                          onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Enter phone number"
                        />
                      ) : (
                        <p className="text-gray-900">{user.phone_number || 'Not provided'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        <MapPin className="h-4 w-4 inline mr-2" />
                        Address:
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-3 py-2"
                          placeholder="Enter address"
                        />
                      ) : (
                        <p className="text-gray-900">{user.address || 'Not provided'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Role-specific Impact Stats */}
              <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Your Impact</h3>
                <div className="space-y-4">
                  {impactStats.primary && (
                    <div>
                      <p className="text-cyan-100 text-sm">{impactStats.primary.label}:</p>
                      <p className="text-2xl font-bold">{impactStats.primary.value}</p>
                    </div>
                  )}
                  {impactStats.secondary && (
                    <div>
                      <p className="text-cyan-100 text-sm">{impactStats.secondary.label}:</p>
                      <p className="text-2xl font-bold">{impactStats.secondary.value}</p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-cyan-300">
                    <p className="text-cyan-100 text-xs">
                      {user.role === 'donor' && 'Thank you for reducing food waste!'}
                      {user.role === 'volunteer' && 'Thank you for connecting communities!'}
                      {user.role === 'recipient' && 'Welcome to our community!'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Educational Content</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-green-500 text-white p-6 rounded-lg">
              <p className="text-sm leading-relaxed">
                Food waste has significant economic and social costs, including lost income 
                for farmers, increased food prices, and food insecurity for vulnerable populations.
              </p>
            </div>
            <div className="bg-red-500 text-white p-6 rounded-lg">
              <p className="text-sm leading-relaxed">
                Redirecting surplus food to those in need reduces food waste and its 
                associated environmental consequences, contributing to a more sustainable food system.
              </p>
            </div>
            <div className="bg-yellow-500 text-white p-6 rounded-lg">
              <p className="text-sm leading-relaxed">
                Consider growing your own fruits, vegetables, and herbs to reduce 
                reliance on long-distance food transportation and support sustainable food production.
              </p>
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            {user.full_name}'s Analytics
          </h2>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <AnalyticsCharts analytics={analytics} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;