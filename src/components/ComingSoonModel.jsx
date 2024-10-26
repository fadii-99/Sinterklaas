import React from 'react';
import { FaTimes } from 'react-icons/fa';

function ComingSoonModel({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 h-full w-full top-0 bg-black bg-opacity-60 flex items-center justify-center 
      z-[100] animate-fade-in" 
      role="dialog" 
      aria-modal="true"
    >
      <div className="w-full max-w-lg sm:p-10 p-6 bg-white rounded-lg shadow-xl relative flex flex-col items-center gap-6">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700  rounded"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Coming Soon Message */}
        <h2 className="md:text-4xl sm:text-3xl text-2xl font-bold text-red-950 font-christmas pt-6">Binnenkort Beschikbaar</h2>
        <p className="text-center text-gray-600 sm:text-sm text-xs">
         Er komt iets speciaals aan! We werken eraan om het binnenkort bij je te brengen.
        </p>
      </div>
    </div>
  );
}

export default ComingSoonModel;
