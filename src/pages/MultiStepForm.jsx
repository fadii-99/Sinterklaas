import React, { useState } from 'react';
import ProductChoice from '../components/ProductChoice';
import PersonalizationForm from '../components/PersonalizationForm';
import ExtraGift from '../components/ExtraGift';
import Overview from '../components/Overview';


const steps = [
  'Stap 1: Video van Sinterklaas',
  'Stap 2: Gegevens Verzamelen',
  'Stap 3: Contactgegevens',
  'Stap 4: Overzicht',
];


const MultiStepForm = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep((prev) => prev + 1); // Move to next step
  const handleBack = () => setActiveStep((prev) => prev - 1); // Go back a step
  const handleReset = () => {
    setActiveStep(0);
    onClose(); // Close the modal when the form is reset
  };

  


  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <ProductChoice
            onNext={handleNext}
            onClose={onClose}
          />
        );
      case 1:
        return (
          <PersonalizationForm 
            onClose={onClose} 
            onNext={handleNext}
          />
        );
        case 2:
          return (
            <ExtraGift
              onClose={onClose} 
              onNext={handleNext}
            />
          );
          case 3:
            return (
              <Overview
                onClose={onClose} 
                onNext={handleNext}
              />
            );
      default:
        return (
          <div className="flex flex-col items-center">
            <h2 className="text-xl">{steps[step]}</h2>
            <div className="flex gap-4 mt-4">
              {activeStep > 0 && (
                <button 
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={handleBack}
                >
                  Back
                </button>
              )}
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 px-4 sm:px-8">
      <div className="bg-white rounded-lg shadow-lg py-3 w-full max-w-3xl min-h-[95vh] max-h-[95vh] overflow-y-auto
      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500 flex flex-col gap-8">

        {/* Close Icon Positioned Above Stepper */}
        <div className="flex items-center justify-between px-4">
          <h1 className="font-christmas text-3xl text-red-950">
            Personalized Setup
          </h1>
          <button
            className="text-red-950 hover:text-gray-700 text-3xl font-bold"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center justify-between md:px-4 px-2 border-b pb-4">
          {steps.map((step, index) => (
            <div className="flex items-center" key={index}>
              <div className={`text-center font-semibold text-sm ${index <= activeStep ? 'text-red-700' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 mx-auto mb-2 rounded-full border-2 flex items-center justify-center ${index <= activeStep ? 'border-red-700' : 'border-gray-300'}`}>
                  {index <= activeStep ? (
                    <span className="text-white bg-red-700 w-6 h-6 rounded-full flex items-center justify-center">
                      ✓
                    </span>
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="md:text-xs text-[8px]">{step}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 ${index < activeStep ? 'bg-red-700' : 'bg-gray-300'}`}></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="pt-4">{renderStepContent(activeStep)}</div>
      </div>
    </div>
  );
};

export default MultiStepForm;
