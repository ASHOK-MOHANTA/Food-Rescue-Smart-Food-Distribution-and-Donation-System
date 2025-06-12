import React from 'react';
import { Gift } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-green-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About Us</h3>
            <p className="text-gray-600 mb-4">
              Food Rescue is dedicated to eliminating hunger and food waste. Our mission is to keep food out of landfills
              and reduce greenhouse gases. We engage volunteers and food donors through our proprietary web-based
              platform to redistribute surplus food to those in need.
            </p>
            <div className="flex items-center space-x-2">
              <Gift className="h-5 w-5 text-green-600" />
              <span className="text-lg font-bold text-gray-900">FoodRescue</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-green-600">Home</a></li>
              <li><a href="/about" className="text-gray-600 hover:text-green-600">What We Do</a></li>
              <li><a href="/partners" className="text-gray-600 hover:text-green-600">Our Partners</a></li>
              <li><a href="/contact" className="text-gray-600 hover:text-green-600">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;