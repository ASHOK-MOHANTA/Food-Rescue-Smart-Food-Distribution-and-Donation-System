import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export const useDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDonations();

    // Create a unique channel name to avoid conflicts
    const channelName = `donations_${Date.now()}_${Math.random()}`;
    
    // Subscribe to real-time changes
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'donations' },
        (payload) => {
          console.log('Donation change received:', payload);
          
          if (payload.eventType === 'INSERT') {
            setDonations(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setDonations(prev => 
              prev.map(donation => 
                donation.id === payload.new.id ? payload.new : donation
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setDonations(prev => 
              prev.filter(donation => donation.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup function
    return () => {
      console.log('Cleaning up donations subscription');
      supabase.removeChannel(channel);
    };
  }, []); // Empty dependency array ensures this runs only once

  const fetchDonations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching donations:', error);
        return;
      }

      if (data) {
        setDonations(data);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDonation = async (donation) => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          ...donation,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating donation:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error creating donation:', error);
      throw error;
    }
  };

  const updateDonationStatus = async (donationId, updates) => {
    try {
      console.log('Updating donation:', donationId, 'with updates:', updates);
      
      const { data, error } = await supabase
        .from('donations')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', donationId)
        .select()
        .single();

      if (error) {
        console.error('Supabase error updating donation:', error);
        throw error;
      }
      
      if (!data) {
        console.warn('No data returned from donation update');
        return null;
      }
      
      console.log('Donation updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating donation:', error);
      throw error;
    }
  };

  return {
    donations,
    loading,
    createDonation,
    updateDonationStatus,
    refetch: fetchDonations
  };
};