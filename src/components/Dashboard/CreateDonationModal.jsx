import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import { useDonations } from '../../hooks/useDonations';
import { useAuth } from '../../hooks/useAuth';

const CreateDonationModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { createDonation } = useDonations();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    food_type: 'Fresh Produce',
    food_quantity: 1,
    food_weight: '',
    expiration_date: '',
    pickup_date_time: '',
    location_address: ''
  });

  const foodTypes = ['Fresh Produce', 'Fruits', 'Vegetables', 'Beverages', 'Dairy', 'Meat', 'Baked Goods', 'Canned Goods', 'Other'];

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    const validQuantity = isNaN(value) || value < 1 ? 1 : value;
    setFormData({ ...formData, food_quantity: validQuantity });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const donation = {
        title: formData.title,
        description: formData.description,
        food_type: formData.food_type,
        food_quantity: formData.food_quantity,
        food_weight: formData.food_weight,
        expiration_date: formData.expiration_date,
        pickup_date_time: formData.pickup_date_time,
        donor_id: user.id,
        donor_name: user.full_name,
        status: 'pending',
        location_lat: 24.8607, // Default to Karachi coordinates
        location_lng: 67.0011,
        location_address: formData.location_address
      };

      await createDonation(donation);
      onClose();
      setFormData({
        title: '',
        description: '',
        food_type: 'Fresh Produce',
        food_quantity: 1,
        food_weight: '',
        expiration_date: '',
        pickup_date_time: '',
        location_address: ''
      });
    } catch (error) {
      console.error('Error creating donation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Create Donation Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Type
              </label>
              <select
                value={formData.food_type}
                onChange={(e) => setFormData({ ...formData, food_type: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {foodTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={formData.food_quantity}
                onChange={handleQuantityChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight
              </label>
              <input
                type="text"
                value={formData.food_weight}
                onChange={(e) => setFormData({ ...formData, food_weight: e.target.value })}
                placeholder="e.g., 5kg, 2lbs"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiration Date
              </label>
              <input
                type="date"
                value={formData.expiration_date}
                onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Date & Time
              </label>
              <input
                type="datetime-local"
                value={formData.pickup_date_time}
                onChange={(e) => setFormData({ ...formData, pickup_date_time: e.target.value })}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={formData.location_address}
                onChange={(e) => setFormData({ ...formData, location_address: e.target.value })}
                placeholder="Enter pickup address"
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateDonationModal;