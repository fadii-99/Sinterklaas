// ExtraGift.js
import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { BasicContext } from '../context/BasicContext';

const ExtraGift = ({ onClose, onNext }) => {
  const { videoFormData , setGiftFormData } = useContext(BasicContext);
  const [selectedOption, setSelectedOption] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLocked, setIsLocked] = useState(false); // State to lock option after submission

  let limit = videoFormData?.product.kind === 'Voor Gezinnen' ? 4 : 1;


  // Handle radio button selection
  const handleOptionChange = (e) => {
    if (!isLocked) {
      setSelectedOption(e.target.value);
      setErrors({});
    }
  };

  // Handle phone number input change
  const handlePhoneNumberChange = (e) => setPhoneNumber(e.target.value);

  // Handle phone number submission
  const handlePhoneNumberSubmit = () => {
    if (phoneNumber.trim() && phoneNumbers.length < limit) {
      setPhoneNumbers([...phoneNumbers, phoneNumber]);
      setPhoneNumber('');
      setShowInput(false);
      setIsLocked(true); // Lock option after first submission
    } else {
      setErrors({ phoneNumber: 'Please enter a valid phone number or limit reached.' });
    }
  };

  // Handle email input change
  const handleEmailChange = (e) => setEmail(e.target.value);

  // Validate email format
  const validateEmail = () => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle email submission
  const handleEmailSubmit = () => {
    if (validateEmail() && emails.length < limit) {
      setEmails([...emails, email]);
      setEmail('');
      setShowInput(false);
      setIsLocked(true); // Lock option after first submission
    } else {
      setErrors({ email: 'Please enter a valid input' });
    }
  };

  // Show input field when button is clicked
  const handleAddClick = () => setShowInput(true);


  const validateForm = () => {
    if (selectedOption === 'phone' && phoneNumbers.length === 0) {
      setErrors({ phoneNumber: 'At least one phone number is required.' });
      return false;
    }
    if (selectedOption === 'email' && emails.length === 0) {
      setErrors({ email: 'At least one email is required.' });
      return false;
    }
    return true;
  };

  const handleNextClick = () => {
    if (validateForm()) {
        const formData = {
            option: selectedOption,
            phoneNumbers: selectedOption === 'phone' ? phoneNumbers : [],
            emails: selectedOption === 'email' ? emails : [],
          };
      
          setGiftFormData(formData); // Store form data in context
        console.log(formData);
      onNext(); // Proceed to the next step
    }
  };

  return (
    <div className="w-full flex flex-col gap-10 p-6">
      <div className="flex flex-row items-center justify-between w-full gap-3">
        <h1 className="sm:text-5xl text-4xl font-light font-christmas text-red-950">
          {videoFormData?.videoTitle}
        </h1>
        <p className="sm:text-3xl text-2xl font-semibold text-green-500">
          €{videoFormData?.product.value}
        </p>
      </div>

      {/* Radio Button Selection */}
      <div className="flex flex-col items-center">
        <h1 className="sm:text-lg text-md font-semibold bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
          Select an Option
        </h1>
        <div className="flex gap-8 mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              value="phone"
              checked={selectedOption === 'phone'}
              onChange={handleOptionChange}
              // disabled={isLocked && selectedOption !== 'phone'}
              disabled='true'
              title='Currently not available'
            />
            Phone Number
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="radio"
              value="email"
              checked={selectedOption === 'email'}
              onChange={handleOptionChange}
              disabled={isLocked && selectedOption !== 'email'}
            />
            Email
          </label>
        </div>
      </div>

      {/* Conditionally Render Inputs Based on Selection */}
      {selectedOption === 'phone' && (
        <div className="flex flex-col gap-4 items-start">
          <div className='flex sm:flex-row flex-col sm:items-end items-start sm:justify-between w-full gap-4'>
           <div className='flex flex-col items-start gap-4'>
                <h1 className="text-gray-700 font-semibold text-xs text-nowrap">Add Phone Numbers</h1>
                <button
                    onClick={handleAddClick}
                    disabled={phoneNumbers.length >= limit || isLocked}
                    className={`px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md text-red-950 font-black 
                        text-xs text-nowrap
                    ${phoneNumbers.length >= limit ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <FontAwesomeIcon icon={faPhone} className="mr-2" /> Add Phone Number
                </button>
           </div>
            {showInput && (
                <div className="flex gap-2 items-center mt-2 w-full">
                <input
                    type="tel"
                    placeholder="Enter phone number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="p-3 border rounded-md text-xs w-full"
                />
                <button
                    onClick={handlePhoneNumberSubmit}
                    className="sm:px-4 px-2 py-3 bg-gray-900 text-white rounded-md text-xs"
                >
                    Enter
                </button>
                </div>
            )}
            </div>

          {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}

          {phoneNumbers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {phoneNumbers.map((number, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-md flex items-center gap-2">
                  <FontAwesomeIcon icon={faPhone} className="text-gray-600 text-sm" />
                  <span className="text-xs">{number}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {selectedOption === 'email' && (
        <div className="flex flex-col gap-4 items-start">
          <div className='flex sm:flex-row flex-col sm:items-end items-start sm:justify-between w-full gap-4'>
            <div className='flex flex-col items-start gap-4'>
            <h1 className="text-gray-700 font-semibold text-xs text-nowrap">Add Emails</h1>
            <button
                onClick={handleAddClick}
                disabled={emails.length >= limit || isLocked}
                className={`px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md text-red-950 font-black 
                    text-xs text-nowrap
                ${emails.length >= limit ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Add Email
            </button>
            </div>

          {showInput && (
            <div className="flex gap-2 items-center mt-2 w-full">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={handleEmailChange}
                className="p-3 border rounded-md text-xs w-full"
              />
              <button
                onClick={handleEmailSubmit}
                className="sm:px-4 px-2 py-3 bg-gray-900 text-white rounded-md text-xs"
              >
                Enter
              </button>
            </div>
          )}
          </div>

          {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

          {emails.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {emails.map((email, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-md flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-gray-600 text-sm" />
                  <span className="text-xs">{email}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <button 
              onClick={handleNextClick}
              className={`w-full h-[2.8rem] bg-gradient-to-r from-gray-900 to-black flex items-center justify-center rounded-md
                text-white font-bold  text-xs transform transition-transform duration-300 hover:scale-[103%]`} // Style when loading
            >
              Next
            </button>
    </div>
  );
};

export default ExtraGift;
