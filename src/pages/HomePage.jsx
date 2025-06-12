import React from 'react';
import { Heart, Users, MapPin, Gift, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const stats = [
    { icon: Gift, label: 'Food Items Donated', value: '114+', color: 'text-green-600' },
    { icon: Heart, label: 'Meals Provided', value: '47 Kg', color: 'text-red-600' },
    { icon: Users, label: 'Volunteers', value: '6+', color: 'text-blue-600' },
    { icon: Star, label: 'Donors', value: '3+', color: 'text-yellow-600' }
  ];

  const features = [
    {
      title: 'We Rescue Food',
      description: 'Using our web-based app, we engage volunteers to transfer fresh food surpluses from local businesses to social service agencies serving the food insecure.',
      image: 'https://images.pexels.com/photos/6994826/pexels-photo-6994826.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
    },
    {
      title: 'We Create Community',
      description: 'Our model empowers communities to serve themselves with the support of our app. All participants in our work are members of the communities that we serve.',
      image: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
    },
    {
      title: 'We Bring Smiles',
      description: 'Fueling Smiles, Nourishing Souls: Our Passionate Drive to Alleviate Hunger, Embrace Unity, Compassion and Paint Brighter Tomorrows Through Food Donation.',
      image: 'https://images.pexels.com/photos/6994981/pexels-photo-6994981.jpeg?auto=compress&cs=tinysrgb&w=500&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Together We Can End Hunger
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Join our community of donors, volunteers, and recipients working together to rescue food and feed those in need.
            </p>
            <div className="space-x-4">
              <Link
                to="/dashboard"
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
              >
                Get Started
              </Link>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg text-center transform hover:scale-105 transition-transform">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* What We Do Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">WHAT WE DO?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform">
                <div className="h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple steps to make a difference</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Donate Food</h3>
              <p className="text-gray-600">Restaurants and donors post available food donations on our platform</p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Volunteers Connect</h3>
              <p className="text-gray-600">Volunteers accept delivery requests and coordinate pickup</p>
            </div>
            
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Feed Communities</h3>
              <p className="text-gray-600">Food reaches those in need through our network of partner organizations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;