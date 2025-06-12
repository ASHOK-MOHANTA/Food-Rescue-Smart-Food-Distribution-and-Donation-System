import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export const useUserStats = (userId, userRole) => {
  const [stats, setStats] = useState({
    totalDonatedWeight: 0,
    totalDonatedItems: 0,
    totalDeliveries: 0,
    totalReceivedItems: 0
  });
  const [analytics, setAnalytics] = useState({
    foodTypeDistribution: [],
    monthlyDonations: [],
    userRoleDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId && userRole) {
      fetchUserStats();
      fetchAnalytics();
    }
  }, [userId, userRole]);

  const fetchUserStats = async () => {
    if (!userId || !userRole) return;

    try {
      let stats = {
        totalDonatedWeight: 0,
        totalDonatedItems: 0,
        totalDeliveries: 0,
        totalReceivedItems: 0
      };

      if (userRole === 'donor') {
        // Get user's donations
        const { data: donations } = await supabase
          .from('donations')
          .select('food_weight, food_quantity, status')
          .eq('donor_id', userId);

        const totalWeight = donations?.reduce((sum, d) => {
          const weight = parseFloat(d.food_weight.replace(/[^\d.]/g, '')) || 0;
          return sum + weight;
        }, 0) || 0;

        const totalItems = donations?.reduce((sum, d) => sum + d.food_quantity, 0) || 0;

        stats = {
          totalDonatedWeight: Math.round(totalWeight),
          totalDonatedItems: totalItems,
          totalDeliveries: 0,
          totalReceivedItems: 0
        };
      } else if (userRole === 'volunteer') {
        // Get user's deliveries (as volunteer)
        const { data: deliveries } = await supabase
          .from('donations')
          .select('id, food_weight, food_quantity')
          .eq('volunteer_id', userId);

        const totalDeliveries = deliveries?.length || 0;
        const totalWeight = deliveries?.reduce((sum, d) => {
          const weight = parseFloat(d.food_weight.replace(/[^\d.]/g, '')) || 0;
          return sum + weight;
        }, 0) || 0;

        stats = {
          totalDonatedWeight: Math.round(totalWeight),
          totalDonatedItems: deliveries?.reduce((sum, d) => sum + d.food_quantity, 0) || 0,
          totalDeliveries: totalDeliveries,
          totalReceivedItems: 0
        };
      } else if (userRole === 'recipient') {
        // For recipients, show available food they can receive
        const { data: availableFood } = await supabase
          .from('donations')
          .select('food_weight, food_quantity')
          .in('status', ['accepted', 'delivered']);

        const totalWeight = availableFood?.reduce((sum, d) => {
          const weight = parseFloat(d.food_weight.replace(/[^\d.]/g, '')) || 0;
          return sum + weight;
        }, 0) || 0;

        stats = {
          totalDonatedWeight: 0,
          totalDonatedItems: 0,
          totalDeliveries: 0,
          totalReceivedItems: availableFood?.reduce((sum, d) => sum + d.food_quantity, 0) || 0
        };
      }

      setStats(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const fetchAnalytics = async () => {
    if (!userId || !userRole) return;

    try {
      let foodTypeDistribution = [];
      let userRoleDistribution = [];

      // Role-specific food type distribution
      if (userRole === 'donor') {
        // Show only food types donated by this donor
        const { data: donorFoodTypes } = await supabase
          .from('donations')
          .select('food_type, food_quantity')
          .eq('donor_id', userId);

        const foodTypeMap = new Map();
        donorFoodTypes?.forEach(item => {
          const current = foodTypeMap.get(item.food_type) || 0;
          foodTypeMap.set(item.food_type, current + item.food_quantity);
        });

        foodTypeDistribution = Array.from(foodTypeMap.entries()).map(([name, value], index) => ({
          name,
          value,
          color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'][index % 7]
        }));
      } else if (userRole === 'volunteer') {
        // Show food types from donations accepted by this volunteer
        const { data: volunteerFoodTypes } = await supabase
          .from('donations')
          .select('food_type, food_quantity')
          .eq('volunteer_id', userId);

        const foodTypeMap = new Map();
        volunteerFoodTypes?.forEach(item => {
          const current = foodTypeMap.get(item.food_type) || 0;
          foodTypeMap.set(item.food_type, current + item.food_quantity);
        });

        foodTypeDistribution = Array.from(foodTypeMap.entries()).map(([name, value], index) => ({
          name,
          value,
          color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'][index % 7]
        }));

        // User role distribution - only for volunteers
        const { data: users } = await supabase
          .from('users')
          .select('role');

        const roleMap = new Map();
        users?.forEach(user => {
          const current = roleMap.get(user.role) || 0;
          roleMap.set(user.role, current + 1);
        });

        userRoleDistribution = Array.from(roleMap.entries()).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1) + 's',
          value,
          color: name === 'donor' ? '#fbbf24' : name === 'volunteer' ? '#06b6d4' : '#f87171'
        }));
      } else if (userRole === 'recipient') {
        // Show food types available to recipients
        const { data: availableFoodTypes } = await supabase
          .from('donations')
          .select('food_type, food_quantity')
          .in('status', ['accepted', 'delivered']);

        const foodTypeMap = new Map();
        availableFoodTypes?.forEach(item => {
          const current = foodTypeMap.get(item.food_type) || 0;
          foodTypeMap.set(item.food_type, current + item.food_quantity);
        });

        foodTypeDistribution = Array.from(foodTypeMap.entries()).map(([name, value], index) => ({
          name,
          value,
          color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'][index % 7]
        }));
      }

      setAnalytics({
        foodTypeDistribution,
        monthlyDonations: [], // Would need more complex query for monthly data
        userRoleDistribution
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, analytics, loading };
};