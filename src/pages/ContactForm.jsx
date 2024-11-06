import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import { FaTimes } from 'react-icons/fa';

function ContactForm() {
  const [contactForm, setContactForm] = useState({ name: '', feedback: '' });
  const [contactFormErrors, setContactFormErrors] = useState({ name: false, feedback: false });
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleContactFormChange = (e) => {
    const { name, value } = e.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
    setContactFormErrors((prev) => ({ ...prev, [name]: false })); // Reset error on change
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      name: contactForm.name === '',
      feedback: contactForm.feedback === '',
    };
    setContactFormErrors(errors);

    if (!errors.name && !errors.feedback) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('name', contactForm.name);
        formData.append('feedback', contactForm.feedback);

        const response = await fetch('http://134.122.63.191:9000/admin/add-feedback/', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setShowSuccessModal(true); // Show success modal
          setContactForm({ name: '', feedback: '' }); // Reset form fields
        } else {
          throw new Error('Failed to send contact form');
        }
      } catch (error) {
        console.error('Error submitting contact form:', error);
      }
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-20 overflow-hidden">
      <HeroSection heading="Feedback" height="60vh" videoWidth />

      <div className="w-full md:w-[60%] flex flex-col gap-32 mx-auto pb-24 px-10">
        <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 shadow-xl bg-white p-6 rounded-lg">
          <h3 className="text-red-950 font-bold font-christmas sm:text-4xl text-2xl pb-8">Contacteer Ons</h3>
          <form onSubmit={handleContactSubmit} className="flex flex-col gap-8">
            <div>
              <label className="block text-gray-800 font-semibold mb-1 text-sm">Naam</label>
              <input
                type="text"
                name="name"
                placeholder="Voer uw naam in"
                value={contactForm.name}
                onChange={handleContactFormChange}
                className={`p-3 border rounded-md w-full focus:outline-none text-xs text-[9px] ${
                  contactFormErrors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <div>
              <label className="block text-gray-800 font-semibold mb-1 text-sm">Feedback</label>
              <textarea
                rows="6"
                name="feedback"
                placeholder="Voer uw feedback in"
                value={contactForm.feedback}
                onChange={handleContactFormChange}
                className={`p-3 border rounded-md w-full focus:outline-none text-xs text-[9px] ${
                  contactFormErrors.feedback ? 'border-red-500' : 'border-gray-300'
                }`}
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-red-950 text-white font-semibold rounded mt-4"
              disabled={loading}
            >
              {loading ? 'Versturen...' : 'Verstuur'}
            </button>
          </form>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button onClick={() => setShowSuccessModal(false)} className="absolute top-2 right-2 text-gray-600">
              <FaTimes />
            </button>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-christmas">Succes</h2>
            <p className="text-gray-600 mb-6">Uw feedback is succesvol verzonden.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2 px-4 bg-red-950 text-white font-semibold rounded"
            >
              Sluiten
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContactForm;
