import React from 'react';
import { FaGooglePlay, FaApple } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="mt-40 text-gray-300 px-6 md:px-16 lg:px-24 xl:px-32 py-12">
      <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-700 pb-14">
        
        {/* Left Section */}
        <div className="max-w-sm">
          <h2 className="text-2xl font-bold text-white mb-4">
            <span className="text-pink-600">Show</span>Mate
          </h2>
          <p className="text-sm mb-6">
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
          </p>

        </div>

        {/* Company Links */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About us</a></li>
            <li><a href="#" className="hover:underline">Contact us</a></li>
            <li><a href="#" className="hover:underline">Privacy policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-4">Get in touch</h3>
          <p className="text-sm mb-2">+1-212-456-7890</p>
          <p className="text-sm">contact@example.com</p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="text-center text-sm text-gray-500 pt-6">
        Copyright {new Date().getFullYear()} © ShowMate. All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;
