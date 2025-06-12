import React from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useDonations } from '../../hooks/useDonations';

const DonationTable = ({ donations, onLocationClick }) => {
  const { user } = useAuth();
  const { updateDonationStatus } = useDonations();

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'accepted': return 'bg-blue-500 hover:bg-blue-600';
      case 'in-progress': return 'bg-purple-500 hover:bg-purple-600';
      case 'delivered': return 'bg-green-500 hover:bg-green-600';
      case 'completed': return 'bg-gray-500 hover:bg-gray-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'accepted': return 'Accepted';
      case 'in-progress': return 'In Progress';
      case 'delivered': return 'Delivered';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const handleVolunteerAccept = async (donation) => {
    if (!user || user.role !== 'volunteer') {
      alert('Only volunteers can accept donations.');
      return;
    }

    if (donation.status !== 'pending') {
      alert('This donation is no longer available for acceptance.');
      return;
    }

    try {
      console.log('Attempting to accept donation:', donation.id);
      console.log('User ID:', user.id);
      console.log('User role:', user.role);

      const updates = {
        status: 'accepted',
        volunteer_id: user.id,
        volunteer_name: user.full_name
      };

      const result = await updateDonationStatus(donation.id, updates);
      
      if (result === null) {
        console.error('Failed to accept donation - no result returned');
        alert('Unable to accept donation. Please check your permissions and try again.');
        return;
      }

      console.log('Donation accepted successfully:', result);
      
      // Show success message
      alert(`Successfully accepted donation: ${donation.title}`);
      
    } catch (error) {
      console.error('Error accepting donation:', error);
      alert('An error occurred while accepting the donation. Please try again.');
    }
  };

  const handleMarkDelivered = async (donationId) => {
    if (!user) return;

    try {
      const updates = {
        status: 'delivered'
      };

      const result = await updateDonationStatus(donationId, updates);
      
      if (result === null) {
        alert('Unable to update donation status. You may not have permission to modify this donation.');
        return;
      }

      console.log('Donation marked as delivered');
      alert('Donation marked as delivered successfully!');
    } catch (error) {
      console.error('Error updating donation status:', error);
      alert('An error occurred while updating the donation status. Please try again.');
    }
  };

  // Filter donations based on user role
  const getFilteredDonations = () => {
    if (!user) return donations;

    switch (user.role) {
      case 'donor':
        // Donors see only their own donations
        return donations.filter(d => d.donor_id === user.id);
      case 'volunteer':
        // Volunteers see pending donations and their accepted donations
        return donations.filter(d => 
          d.status === 'pending' || d.volunteer_id === user.id
        );
      case 'recipient':
        // Recipients see only accepted/delivered donations (not pending)
        return donations.filter(d => 
          d.status === 'accepted' || d.status === 'delivered' || d.status === 'completed'
        );
      default:
        return donations;
    }
  };

  const filteredDonations = getFilteredDonations();

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {user?.role === 'donor' && 'My Donations'}
          {user?.role === 'volunteer' && 'Available & My Accepted Donations'}
          {user?.role === 'recipient' && 'Available Food Donations'}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {user?.role === 'donor' && 'Manage your food donations'}
          {user?.role === 'volunteer' && 'Accept donations and manage deliveries'}
          {user?.role === 'recipient' && 'Browse available food donations'}
        </p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Food Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pickup Date/Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              {user?.role === 'recipient' && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Volunteer</th>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDonations.map((donation, index) => (
              <tr key={donation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {donation.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                  {donation.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donation.food_type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {donation.food_quantity} ({donation.food_weight})
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{new Date(donation.pickup_date_time).toLocaleString()}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(donation.status).split(' ')[0]}`}>
                    {getStatusText(donation.status)}
                  </span>
                </td>
                {user?.role === 'recipient' && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {donation.volunteer_name || 'Unassigned'}
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-sm space-y-2">
                  <div className="flex flex-col space-y-2">
                    {/* Volunteer Accept Button - Only for volunteers on pending donations */}
                    {user?.role === 'volunteer' && donation.status === 'pending' && (
                      <button
                        onClick={() => handleVolunteerAccept(donation)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Accept Donation
                      </button>
                    )}
                    
                    {/* Mark Delivered Button - Only for assigned volunteers */}
                    {user?.role === 'volunteer' && donation.status === 'accepted' && donation.volunteer_id === user.id && (
                      <button
                        onClick={() => handleMarkDelivered(donation.id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        Mark Delivered
                      </button>
                    )}
                    
                    {/* Status indicator for recipients */}
                    {user?.role === 'recipient' && donation.status === 'accepted' && (
                      <div className="text-xs text-blue-600 font-medium">
                        Ready for pickup
                      </div>
                    )}
                    
                    {/* Location Button - Always visible */}
                    <button
                      onClick={() => onLocationClick(donation)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center space-x-1"
                    >
                      <MapPin className="h-3 w-3" />
                      <span>Location</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDonations.length === 0 && (
              <tr>
                <td colSpan={user?.role === 'recipient' ? 9 : 8} className="px-6 py-8 text-center text-gray-500">
                  {user?.role === 'donor' && 'No donations created yet. Create your first donation!'}
                  {user?.role === 'volunteer' && 'No donations available to accept or manage.'}
                  {user?.role === 'recipient' && 'No food donations are currently available.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DonationTable;