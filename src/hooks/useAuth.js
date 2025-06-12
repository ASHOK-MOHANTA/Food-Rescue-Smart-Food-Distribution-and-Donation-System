import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await fetchUserProfile(session.user);
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          await fetchUserProfile(session.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist, create profile with flexible data
        const newUser = {
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || 
                    authUser.email?.split('@')[0] || 
                    'User',
          role: authUser.user_metadata?.role || 'recipient',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (!createError && createdUser) {
          setUser({
            ...createdUser,
            displayName: createdUser.full_name,
            uid: createdUser.id
          });
        } else {
          console.error('Profile creation error:', createError);
          // Even if profile creation fails, set basic user info
          setUser({
            id: authUser.id,
            email: authUser.email,
            full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            role: authUser.user_metadata?.role || 'recipient',
            displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
            uid: authUser.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
      } else if (!error && data) {
        setUser({
          ...data,
          displayName: data.full_name,
          uid: data.id
        });
      } else if (error) {
        console.error('Error fetching user profile:', error);
        // Fallback to basic user info from auth
        setUser({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          role: authUser.user_metadata?.role || 'recipient',
          displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
          uid: authUser.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      // Fallback to basic user info
      setUser({
        id: authUser.id,
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        role: authUser.user_metadata?.role || 'recipient',
        displayName: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
        uid: authUser.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateProfile = async (updates) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (!error && data) {
        setUser({
          ...data,
          displayName: data.full_name,
          uid: data.id
        });
      } else if (error) {
        console.error('Error updating profile:', error);
        // Don't throw error, just log it
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Don't throw error, just log it
    }
  };

  return { user, loading, signOut, updateProfile };
};