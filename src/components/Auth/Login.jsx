import React, { useState } from 'react';
import { supabase } from '../../config/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Gift, User, AlertCircle, CheckCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('recipient');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Simple validation - just check if fields are not empty
    if (!email || !password) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (isSignUp && !fullName) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        // Sign up with minimal validation
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: undefined, // Disable email confirmation
            data: {
              full_name: fullName,
              role: role
            }
          }
        });
        
        if (error) {
          console.error('Signup error:', error);
          // Handle common signup errors gracefully
          if (error.message.includes('User already registered')) {
            setError('This email is already registered. Please try signing in instead.');
            // Auto-switch to sign in mode
            setTimeout(() => {
              setIsSignUp(false);
              setError('');
            }, 3000);
          } else if (error.message.includes('email_address_invalid') || error.message.includes('Email address') && error.message.includes('invalid')) {
            setError('Please enter a valid email address.');
          } else if (error.message.includes('Password should be at least')) {
            setError('Password must be at least 6 characters long.');
          } else {
            setError(`Signup failed: ${error.message}`);
          }
          setLoading(false);
          return;
        }
        
        // Check if user was created successfully
        if (data.user) {
          // If user is created but not confirmed, show appropriate message
          if (!data.session) {
            setSuccess('Account created successfully! Please check your email for a confirmation link if email confirmation is enabled.');
          } else {
            setSuccess('Account created successfully! Redirecting to dashboard...');
            setTimeout(() => {
              navigate('/dashboard');
            }, 1500);
          }
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (error) {
          console.error('Signin error:', error);
          // Handle common signin errors gracefully
          if (error.message.includes('Invalid login credentials')) {
            // Check if this might be a new user who needs to sign up
            setError(
              <div>
                <p className="font-medium">Invalid email or password.</p>
                <p className="mt-1 text-sm">
                  If you don't have an account yet, please{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsSignUp(true);
                      setError('');
                    }}
                    className="text-green-600 hover:text-green-500 underline font-medium"
                  >
                    create one here
                  </button>
                  .
                </p>
                <p className="mt-1 text-sm">
                  If you have an account, please double-check your email and password.
                </p>
              </div>
            );
          } else if (error.message.includes('Email not confirmed')) {
            setError('Please confirm your email address before signing in. Check your inbox for a confirmation email.');
          } else if (error.message.includes('Too many requests')) {
            setError('Too many login attempts. Please wait a few minutes before trying again.');
          } else {
            setError(`Sign in failed: ${error.message}`);
          }
          setLoading(false);
          return;
        }
        
        if (data.session) {
          setSuccess('Sign in successful! Redirecting to dashboard...');
          setTimeout(() => {
            navigate('/dashboard');
          }, 1500);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center">
            <div className="flex justify-center">
              <Gift className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
              {isSignUp ? 'Join FoodRescue' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isSignUp ? 'Create your account to start helping' : 'Sign in to your account'}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm flex items-start space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm flex items-start space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>{success}</div>
              </div>
            )}

            <div className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label htmlFor="fullName" className="sr-only">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-10 block w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Full Name"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      I want to join as:
                    </label>
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="block w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="recipient">Recipient</option>
                      <option value="donor">Donor</option>
                      <option value="volunteer">Volunteer</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Email address"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 block w-full border border-gray-300 rounded-md py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Password (minimum 6 characters)"
                    minLength={6}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setSuccess('');
                }}
                className="text-sm text-green-600 hover:text-green-500"
              >
                {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;