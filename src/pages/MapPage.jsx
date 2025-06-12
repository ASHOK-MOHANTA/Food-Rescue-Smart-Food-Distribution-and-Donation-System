import React, { useEffect, useRef, useState } from 'react';
import { useDonations } from '../hooks/useDonations';
import { MapPin, AlertCircle } from 'lucide-react';

const MapPage = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [mapError, setMapError] = useState('Google Maps API key not configured');
  const [isLoading, setIsLoading] = useState(false);
  const { donations, loading } = useDonations();

  // Since we don't have Google Maps API key, we'll show the fallback component
  const FallbackMap = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-6 w-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-900">Map View Unavailable</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Google Maps is not available. Here's a list of donation locations:
        </p>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {donations.map((donation, index) => (
            <div key={donation.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{donation.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{donation.description}</p>
                  <div className="mt-2 space-y-1 text-sm">
                    <p><span className="font-medium">Address:</span> {donation.location_address}</p>
                    <p><span className="font-medium">Food Type:</span> {donation.food_type}</p>
                    <p><span className="font-medium">Quantity:</span> {donation.food_quantity} ({donation.food_weight})</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                        donation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        donation.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        donation.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {donation.status}
                      </span>
                    </p>
                    <p><span className="font-medium">Coordinates:</span> {donation.location_lat}, {donation.location_lng}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {donations.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No donation locations to display</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Donation Locations</h1>
          <p className="text-gray-600 mt-1">
            View donation locations in list format
          </p>
        </div>
        
        <FallbackMap />
        
        {/* Configuration Note */}
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Google Maps Configuration</p>
              <p>
                Google Maps is currently unavailable. To enable map functionality:
                <br />
                1. Get a Google Maps API key from the Google Cloud Console
                <br />
                2. Add it to your .env file as VITE_GOOGLE_MAPS_API_KEY
                <br />
                3. Restart the development server
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;