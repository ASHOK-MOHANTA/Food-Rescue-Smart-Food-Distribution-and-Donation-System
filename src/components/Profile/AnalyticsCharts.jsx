import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../hooks/useAuth';

const AnalyticsCharts = ({ analytics }) => {
  const { user } = useAuth();

  const getChartTitle = () => {
    switch (user?.role) {
      case 'donor':
        return 'My Donated Food Types';
      case 'volunteer':
        return 'Food Types I\'ve Handled';
      case 'recipient':
        return 'Available Food Types';
      default:
        return 'Food Type Distribution';
    }
  };

  const getChartDescription = () => {
    switch (user?.role) {
      case 'donor':
        return 'Distribution of food types you have donated';
      case 'volunteer':
        return 'Distribution of food types from donations you\'ve accepted';
      case 'recipient':
        return 'Distribution of available food types you can receive';
      default:
        return 'Food type distribution';
    }
  };

  return (
    <div className="space-y-8">
      {/* Bar Chart - Food Type Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{getChartTitle()}</h3>
        <p className="text-sm text-gray-600 mb-4">{getChartDescription()}</p>
        
        {analytics.foodTypeDistribution.length > 0 ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.foodTypeDistribution} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45}
                  textAnchor="end"
                  height={100}
                  fontSize={12}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-80 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">No data available</p>
              <p className="text-sm">
                {user?.role === 'donor' && 'Create your first donation to see analytics'}
                {user?.role === 'volunteer' && 'Accept donations to see analytics'}
                {user?.role === 'recipient' && 'No food donations are currently available'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Pie Chart - User Distribution (Only for Volunteers) */}
      {user?.role === 'volunteer' && (
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Community User Distribution</h3>
              <p className="text-sm text-gray-600">Overview of all users in the FoodRescue community</p>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Donors</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                <span>Volunteers</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                <span>Recipients</span>
              </div>
            </div>
          </div>
          
          {analytics.userRoleDistribution.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.userRoleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                  >
                    {analytics.userRoleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-500">
              <p>Loading community data...</p>
            </div>
          )}
        </div>
      )}

      {/* Role-specific insights */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">
          {user?.role === 'donor' && 'Donor Insights'}
          {user?.role === 'volunteer' && 'Volunteer Insights'}
          {user?.role === 'recipient' && 'Recipient Insights'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {user?.role === 'donor' && (
            <>
              <div>
                <p className="font-medium">Impact:</p>
                <p>Your donations help reduce food waste and feed those in need in your community.</p>
              </div>
              <div>
                <p className="font-medium">Tip:</p>
                <p>Consider donating regularly to maximize your positive impact on the environment and community.</p>
              </div>
            </>
          )}
          {user?.role === 'volunteer' && (
            <>
              <div>
                <p className="font-medium">Community Role:</p>
                <p>You're the vital link connecting food donors with recipients, making food rescue possible.</p>
              </div>
              <div>
                <p className="font-medium">Impact:</p>
                <p>Every delivery you make helps reduce food waste and ensures fresh food reaches those who need it.</p>
              </div>
            </>
          )}
          {user?.role === 'recipient' && (
            <>
              <div>
                <p className="font-medium">Available Resources:</p>
                <p>Check regularly for new food donations that become available in your area.</p>
              </div>
              <div>
                <p className="font-medium">Community:</p>
                <p>You're part of a network that helps reduce food waste while addressing food insecurity.</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;