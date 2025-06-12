import React from 'react';
import { useDonations } from '../hooks/useDonations';
import DonationTable from '../components/Dashboard/DonationTable';

const DonationsPage = () => {
  const { donations, loading } = useDonations();

  const handleLocationClick = (donation) => {
    // In a real app, this would open a map modal or navigate to map page
    alert(`Location: ${donation.location_address}\nLat: ${donation.location_lat}, Lng: ${donation.location_lng}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Donations Page</h1>
          <p className="text-gray-600 mt-1">Make a difference by donating today!</p>
        </div>

        <DonationTable
          donations={donations}
          onLocationClick={handleLocationClick}
        />
      </div>
    </div>
  );
};

export default DonationsPage;