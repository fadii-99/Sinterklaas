import HeroSection from "../components/HeroSection";
import React from "react";
import VideoCarousel from "../components/VideoCarousel";
import HeroSlider from "../components/HeroSlider";
import exampleImage from '../assets/exampleImage.webp'


function Video() {
  return (
    <div className="flex flex-col items-center gap-20 overflow-hidden">
      <HeroSection
        heading="Video Van Sinterklaas"
        paragraph="Kies het perfecte plan om unieke, gepersonaliseerde video's voor je dierbaren te maken. 
                    Geniet van veel waarde met flexibele opties voor elke gelegenheid!"
        height="60vh"
        videoWidth
      />

      <div className="w-[80%] mx-auto flex flex-col gap-8 pb-10">
        <h1 className="text-red-700 w-full text-center font-christmas md:text-7xl sm:text-5xl text-4xl">
           Onze Video's
        </h1>
        <VideoCarousel />
      </div>

      <HeroSlider />

      {/* Grid Section */}
      <div className="w-full md:w-[80%] flex flex-col gap-20 mx-auto pb-24 px-10">
        {/* First Row */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-16">
          <div className="md:p-6" >
            <img
                src={exampleImage}
                alt="Description of image 1"
                className="w-full h-full rounded-2xl shadow-2xl shadow-red-950"
            />
          </div> 
          <div className="flex flex-col gap-5 justify-center">
            <h2 className="md:text-5xl sm:text-4xl text-3xl font-christmas font-bold text-red-950">Samen doorgebrachte momenten</h2>
            <p className="text-gray-600 sm:text-sm text-xs">
            Welkom bij onze unieke videoservice, waar we gepersonaliseerde video’s creëren en direct bij u bezorgen! Onze service 
            combineert technologie en creativiteit om speciale berichten te maken voor families, scholen en bijzondere gelegenheden. 
            Kies uit video's met de iconische personages Sinterklaas en Zwarte Piet en voeg persoonlijke details toe, zoals een naam, 
            feedback over gedrag, of foto’s. <br /> <br /> Met onze gebruiksvriendelijke tool kunt u video’s downloaden of verzendingen inplannen 
            door simpelweg uw ordernummer en verificatiecode in te voeren. Na een veilige betaling via Mollie, inclusief ondersteuning 
            voor iDeal, ontvangt u een bevestiging per e-mail met een unieke verificatiecode. Verificaties en video’s worden eenvoudig 
            en snel via WhatsApp bezorgd, zodat SMS-verificatie niet nodig is
            </p>
          </div>
        </div>

        {/* Second Row */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-16">
                {/* Image Div */}
            <div className="md:order-2 order-1 md:p-6">
                <img
                src={exampleImage}
                alt="Description of image 1"
                className="w-full h-full rounded-2xl shadow-2xl shadow-red-950"
                />
            </div> 

            {/* Text Div */}
            <div className="md:order-1 order-2 flex flex-col gap-5 justify-center">
                <h2 className="md:text-5xl sm:text-4xl text-3xl font-christmas font-bold text-red-950">
                Samen doorgebrachte momenten
                </h2>
                <p className="text-gray-600 sm:text-sm text-xs">
                Welkom bij onze unieke videoservice, waar we gepersonaliseerde video’s creëren en direct bij u bezorgen! Onze service 
                combineert technologie en creativiteit om speciale berichten te maken voor families, scholen en bijzondere gelegenheden. 
                Kies uit video's met de iconische personages Sinterklaas en Zwarte Piet en voeg persoonlijke details toe, zoals een naam, 
                feedback over gedrag, of foto’s. <br /><br />
                Met onze gebruiksvriendelijke tool kunt u video’s downloaden of verzendingen inplannen 
                door simpelweg uw ordernummer en verificatiecode in te voeren. Na een veilige betaling via Mollie, inclusief ondersteuning 
                voor iDeal, ontvangt u een bevestiging per e-mail met een unieke verificatiecode. Verificaties en video’s worden eenvoudig 
                en snel via WhatsApp bezorgd, zodat SMS-verificatie niet nodig is.
                </p>
            </div>
            </div>


        {/* Third Row */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-16">
        <div className="md:p-6" >
            <img
                 src={exampleImage}
                alt="Description of image 1"
                className="w-full h-full rounded-2xl shadow-2xl shadow-red-950"
            />
          </div> 
          <div className="flex flex-col gap-5 justify-center">
            <h2 className="md:text-5xl sm:text-4xl text-3xl font-christmas font-bold text-red-950">Samen doorgebrachte momenten</h2>
            <p className="text-gray-600 sm:text-sm text-xs">
            Welkom bij onze unieke videoservice, waar we gepersonaliseerde video’s creëren en direct bij u bezorgen! Onze service 
            combineert technologie en creativiteit om speciale berichten te maken voor families, scholen en bijzondere gelegenheden. 
            Kies uit video's met de iconische personages Sinterklaas en Zwarte Piet en voeg persoonlijke details toe, zoals een naam, 
            feedback over gedrag, of foto’s. <br /> <br /> Met onze gebruiksvriendelijke tool kunt u video’s downloaden of verzendingen inplannen 
            door simpelweg uw ordernummer en verificatiecode in te voeren. Na een veilige betaling via Mollie, inclusief ondersteuning 
            voor iDeal, ontvangt u een bevestiging per e-mail met een unieke verificatiecode. Verificaties en video’s worden eenvoudig 
            en snel via WhatsApp bezorgd, zodat SMS-verificatie niet nodig is
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
