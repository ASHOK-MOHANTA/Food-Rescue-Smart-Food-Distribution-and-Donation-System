import React, { useState, useMemo } from 'react';
import { Apple, Utensils, Users, Star, Plus } from 'lucide-react';
import StatsCard from '../components/Dashboard/StatsCard';
import DonationTable from '../components/Dashboard/DonationTable';
import CreateDonationModal from '../components/Dashboard/CreateDonationModal';
import { useDonations } from '../hooks/useDonations';
import { useAuth } from '../hooks/useAuth';

const DashboardPage = () => {
  const { user } = useAuth();
  const { donations, loading } = useDonations();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const stats = useMemo(() => {
    const totalWeight = donations.reduce((sum, donation) => {
      const weight = parseFloat(donation.food_weight.replace(/[^\d.]/g, '')) || 0;
      return sum + weight;
    }, 0);

    const uniqueDonors = new Set(donations.map(d => d.donor_id)).size;
    const uniqueVolunteers = new Set(donations.filter(d => d.volunteer_id).map(d => d.volunteer_id)).size;
    const completedDeliveries = donations.filter(d => d.status === 'delivered' || d.status === 'completed').length;

    // Role-specific stats
    let userSpecificStats = {};
    if (user) {
      switch (user.role) {
        case 'donor':
          const myDonations = donations.filter(d => d.donor_id === user.id);
          const myTotalWeight = myDonations.reduce((sum, donation) => {
            const weight = parseFloat(donation.food_weight.replace(/[^\d.]/g, '')) || 0;
            return sum + weight;
          }, 0);
          userSpecificStats = {
            myDonations: myDonations.length,
            myTotalWeight: Math.round(myTotalWeight),
            myPendingDonations: myDonations.filter(d => d.status === 'pending').length,
            myCompletedDonations: myDonations.filter(d => d.status === 'delivered' || d.status === 'completed').length
          };
          break;
        case 'volunteer':
          const myAcceptedDonations = donations.filter(d => d.volunteer_id === user.id);
          const availableDonations = donations.filter(d => d.status === 'pending');
          userSpecificStats = {
            myAcceptedDonations: myAcceptedDonations.length,
            availableDonations: availableDonations.length,
            myDeliveries: myAcceptedDonations.filter(d => d.status === 'delivered' || d.status === 'completed').length,
            myPendingDeliveries: myAcceptedDonations.filter(d => d.status === 'accepted').length
          };
          break;
        case 'recipient':
          const availableForRecipients = donations.filter(d => d.status === 'accepted' || d.status === 'delivered');
          userSpecificStats = {
            availableFood: availableForRecipients.length,
            totalAvailableWeight: availableForRecipients.reduce((sum, donation) => {
              const weight = parseFloat(donation.food_weight.replace(/[^\d.]/g, '')) || 0;
              return sum + weight;
            }, 0)
          };
          break;
      }
    }

    return {
      totalDonations: donations.length,
      totalWeight: Math.round(totalWeight),
      totalVolunteers: uniqueVolunteers,
      totalDonors: uniqueDonors,
      pendingRequests: donations.filter(d => d.status === 'pending').length,
      completedDeliveries,
      ...userSpecificStats
    };
  }, [donations, user]);

  const handleLocationClick = (donation) => {
    setSelectedDonation(donation);
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

  const renderStatsCards = () => {
    if (!user) return null;

    switch (user.role) {
      case 'donor':
        return (
          <>
            <StatsCard
              title="MY DONATIONS"
              value={`${stats.myDonations}+`}
              icon={Apple}
              color="green"
              description="Total donations created"
            />
            <StatsCard
              title="TOTAL WEIGHT DONATED"
              value={`${stats.myTotalWeight} Kg`}
              icon={Utensils}
              color="red"
              description="Food weight contributed"
            />
            <StatsCard
              title="PENDING DONATIONS"
              value={`${stats.myPendingDonations}+`}
              icon={Users}
              color="yellow"
              description="Awaiting volunteers"
            />
            <StatsCard
              title="COMPLETED DONATIONS"
              value={`${stats.myCompletedDonations}+`}
              icon={Star}
              color="blue"
              description="Successfully delivered"
            />
          </>
        );
      case 'volunteer':
        return (
          <>
            <StatsCard
              title="AVAILABLE DONATIONS"
              value={`${stats.availableDonations}+`}
              icon={Apple}
              color="green"
              description="Ready to accept"
            />
            <StatsCard
              title="MY ACCEPTED DONATIONS"
              value={`${stats.myAcceptedDonations}+`}
              icon={Utensils}
              color="blue"
              description="Donations I'm handling"
            />
            <StatsCard
              title="PENDING DELIVERIES"
              value={`${stats.myPendingDeliveries}+`}
              icon={Users}
              color="yellow"
              description="Ready for pickup"
            />
            <StatsCard
              title="COMPLETED DELIVERIES"
              value={`${stats.myDeliveries}+`}
              icon={Star}
              color="red"
              description="Successfully delivered"
            />
          </>
        );
      case 'recipient':
        return (
          <>
            <StatsCard
              title="AVAILABLE FOOD"
              value={`${stats.availableFood}+`}
              icon={Apple}
              color="green"
              description="Donations ready for pickup"
            />
            <StatsCard
              title="TOTAL AVAILABLE WEIGHT"
              value={`${Math.round(stats.totalAvailableWeight)} Kg`}
              icon={Utensils}
              color="red"
              description="Food weight available"
            />
            <StatsCard
              title="ACTIVE VOLUNTEERS"
              value={`${stats.totalVolunteers}+`}
              icon={Users}
              color="blue"
              description="Helping with deliveries"
            />
            <StatsCard
              title="COMMUNITY DONORS"
              value={`${stats.totalDonors}+`}
              icon={Star}
              color="yellow"
              description="Contributing food"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome {user?.displayName}!
            </h1>
            <p className="text-gray-600 mt-1 capitalize">
              {user?.role} Dashboard - {user?.role === 'donor' && 'Share your surplus food'}
              {user?.role === 'volunteer' && 'Help deliver food to those in need'}
              {user?.role === 'recipient' && 'Find available food donations'}
            </p>
          </div>
          
          {user?.role === 'donor' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Create Donation</span>
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {renderStatsCards()}
        </div>

        {/* Donation Requests Table */}
        <DonationTable
          donations={donations}
          onLocationClick={handleLocationClick}
        />

        {/* Create Donation Modal */}
        <CreateDonationModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default DashboardPage;