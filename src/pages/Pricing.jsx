import HeroSection from "../components/HeroSection";
import React, { useContext, useState } from "react";
import { BasicContext } from "../context/BasicContext";
import VideoModel from './../components/VideoModal';
import introductionVideo from './../assets/introductionVideo.mp4';


const videoPrices = [
  { label: "Video voor 1 kind", price: "€ 12.95" },
  { label: "Video voor Gezinnen", price: "€ 16.95" },
  { label: "+ extra persoon (v.a. 3 personen)", price: "€ 3.95" },
  { label: "Video voor Volwassenen", price: "€ 14.95" },
  { label: "Download video", price: "Gratis" },
  { label: "Ontvang video via WhatsApp", price: "€ 3.95" },
];


const letterPrices = [
  { label: "1 - 5 brieven", price: "€ 6.95/st." },
  { label: "6 - 10 brieven", price: "€ 5.95/st." },
  { label: "10+ brieven", price: "€ 4.95/st." },
  { label: "Download brief", price: "Gratis" },
  { label: "Ontvang brief via WhatsApp", price: "€ 3.95" },
];




function Pricing() {
  const { setComingSoonModel } = useContext(BasicContext);
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [video, setVideo]=useState( { title: 'Greet Video', videoUrl: introductionVideo })

  const closeModal = () => {
    setModalOpen(false);
  };


  const handleCardClick = () => {
    setCurrentVideo(video); 
    setModalOpen(true);
  };


  const renderPrices = (prices) =>
    prices.map(({ label, price }, index) => (
      <div key={index} className="flex items-center justify-between w-full sm:gap-10 gap-4">
        <span className="sm:text-sm text-xs font-medium text-gray-700">{label}:</span>
        <span className="font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent sm:text-xl text-md">
          {price}
        </span>
      </div>
    ));

  return (
    <div className="flex flex-col items-center gap-20">
      <HeroSection
        heading="Prijzen"
        paragraph="Kies het perfecte plan om unieke, gepersonaliseerde video's voor je dierbaren te maken. 
                    Geniet van veel waarde met flexibele opties voor elke gelegenheid!"
        height = '60vh'
      />

      <div className="w-[80%] mx-auto grid md:grid-cols-2 grid-cols-1 gap-6 rounded-md">
        <div className="flex flex-col items-center bg-gray-50 md:py-20 py-10 px-4 gap-12">
          <h2 className="sm:text-4xl text-3xl font-bold font-christmas text-red-950">Video van Sinterklaas</h2>
          <div className="flex flex-col items-start gap-6">{renderPrices(videoPrices)}</div>
        </div>

        <div className="flex flex-col items-center bg-gray-50 md:py-20 py-10 px-4 gap-12">
          <h2 className="sm:text-4xl text-3xl font-bold font-christmas text-red-950">Brief van Sinterklaas</h2>
          <div className="flex flex-col items-start gap-6">{renderPrices(letterPrices)}</div>
        </div>
      </div>

      <div className="mb-24">
        <button
         onClick={handleCardClick}
          className="py-4 px-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md text-red-950 font-black sm:text-sm text-xs 
                     transform transition-transform duration-300 hover:scale-[103%]"
        >
          BESTELLEN
        </button>
      </div>
      {isModalOpen && currentVideo && (
        <VideoModel video={currentVideo} onClose={closeModal} />
      )}
    </div>
  );
}

export default Pricing;
