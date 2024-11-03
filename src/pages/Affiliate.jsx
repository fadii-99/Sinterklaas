import HeroSection from "../components/HeroSection";
import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

function Affiliate() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-20 overflow-hidden">
      <HeroSection
        heading="Affiliate programma"
        height="60vh"
        videoWidth
      />

      <div className="w-full md:w-[60%] flex flex-col items-start gap-32 mx-auto pb-24 px-10">
        
        {/* Why is it worth working with us? */}
        <div className="flex flex-col items-start gap-8">
          <h3 className="text-red-950 font-bold font-christmas sm:text-4xl text-2xl">
            Waarom is het de moeite waard om met ons samen te werken?
          </h3>
          <p className="text-gray-600 sm:text-sm text-xs">
            🎄 Je wordt onderdeel van een van de grootste kerstman-gebaseerde operaties ter wereld<br /><br />
            🎄 We opereren op 3 continenten in 7 talen<br /><br />
            🎄 Samen met de kerstman maak je duizenden kinderen gelukkig
          </p>
        </div>

        {/* What do we expect? */}
        <div className="flex flex-col items-start gap-8">
          <h3 className="text-red-950 font-bold font-christmas sm:text-4xl text-2xl">
            Wat verwachten wij?
          </h3>
          <p className="text-gray-600 sm:text-sm text-xs">
            🎄 Je hebt minimaal 1000 volgers, abonnees, enz. in jouw gemeenschap<br /><br />
            🎄 Je creëert interessante content over Elfi en betrekt jouw publiek<br /><br />
            🎄 Je bent minimaal 21 jaar oud<br /><br />
            🎄 Je wilt het merk Elfi op een interessante en authentieke manier promoten
          </p>
        </div>

        {/* What will you get? */}
        <div className="flex flex-col items-start gap-8">
          <h3 className="text-black font-bold font-christmas sm:text-4xl text-2xl">
            Wat krijg je?
          </h3>
          <p className="text-gray-600 sm:text-sm text-xs">
            🎁 aantrekkelijke <span className="text-red-950 font-semibold">commissie tot 30%</span><br /><br />
            🎁 breed scala aan reclamematerialen<br /><br />
            🎁 professionele service van Elfi<br /><br />
            🎁 positieve associatie van jouw webpagina
          </p>
        </div>

        {/* Sound interesting? */}
        <div className="flex flex-col items-start gap-8">
          <h3 className="text-red-950 font-bold font-christmas sm:text-4xl text-2xl">
            Klinkt interessant?
          </h3>
          <p className="text-gray-600 sm:text-sm text-xs">
            Verdien aan elke transactie vanaf jouw website en word onderdeel van het Elfi-team.
          </p>
        </div>
        
        {/* Button to open modal */}
        <button
          onClick={openModal}
          className="py-4 px-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md text-red-950 font-black sm:text-sm text-xs 
                     transform transition-transform duration-300 hover:scale-[103%]"
        >
          Doe mee met het programma
        </button>

        {/* Inline Modal Content */}
        {isModalOpen && (
          <div 
            className="fixed inset-0 h-full w-full top-0 bg-black bg-opacity-60 flex items-center justify-center 
            z-[100] animate-fade-in" 
            role="dialog" 
            aria-modal="true"
          >
            <div className="w-full max-w-lg sm:p-10 p-6 bg-white rounded-lg shadow-xl relative flex flex-col items-center gap-6">
              {/* Close Icon */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 rounded"
                aria-label="Close"
              >
                <FaTimes className="text-xl" />
              </button>

              {/* Affiliate Program Coming Soon Message */}
              <h2 className="md:text-4xl sm:text-3xl text-2xl font-bold text-red-950 font-christmas pt-6">
                Affiliate Programma
              </h2>
              <p className="text-center text-gray-600 sm:text-sm text-xs">
                Het affiliate programma zal binnenkort beschikbaar zijn.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Affiliate;
