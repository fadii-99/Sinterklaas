import React, { useState, useEffect, useRef } from 'react';
import VideoCarousel from "../components/VideoCarousel";
import { FaGift, FaChild,FaCalendarAlt , FaPlayCircle} from 'react-icons/fa';
import ReviewCarousel from '../components/ReviewCarousel';
import heroImage from './../assets/sinterklaas.png';
import HeroSection from '../components/HeroSection';
import HeroSlider from '../components/HeroSlider';
import useScrollAnimation from '../components/useScrollAnimation';
import letter from './../assets/letter.png';



function MainPage() {
  const videoSectionRef = useRef(null);
  const stats = [
    { icon: FaPlayCircle, value: "1500+", label: "VIDEO'S" },
    { icon: FaChild, value: "2000+", label: "BLUE KINDEREN" },
    { icon: FaCalendarAlt, value: "174", label: "JAAR TRADITIE" },
    { icon: FaGift, value: "1", label: "PAKJESAVOND PER JAAR" }
  ];



  const [activeIndex, setActiveIndex] = useState(0);



  useScrollAnimation('.fade-in-left', 'animate');
  useScrollAnimation('.fade-in-right', 'animate');


  

  // Automatically change the hovered card
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % stats.length);
    }, 1000); // Changes every 2 seconds

    return () => clearInterval(interval);
  }, [stats.length]);



  const handleScrollToVideos = () => {
    videoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  

  return (
    <div className="flex flex-col">
      <HeroSection 
        subHeading={` ___Gepersonaliseerde Video's voor Familie en Vrienden!`}
        heading={`Ontdek de Magie van Sinterklaas!`}
        paragraph={` Creéer echte SintMagie met gepersonaliseerde video's van Sinterklaas. Laat
                de Goedheiligman jouw gezin persoonlijk toespreken en geef jouw kind een
                onvergetelijke ervaring!`}
        showButton
        avatar
        height = "100vh"
        onClick={handleScrollToVideos}
      />
      <HeroSlider />
      {/* About Section */}
      <div className='w-full bg-gray-50 py-24'>
        <div className="w-[80%] mx-auto ">
          <div className="flex flex-col items-center gap-8 pb-20 ">
            <h1 className="text-red-700 w-full text-center font-christmas md:text-7xl sm:text-5xl text-4xl">
               Wat We Doen
            </h1>
            <p className="sm:text-sm text-xs font-medium text-gray-600 text-center sm:leading-6 leading-5">
            Welkom bij onze unieke videoservice, waar we gepersonaliseerde video’s creëren en direct bij u bezorgen! Onze service 
            combineert technologie en creativiteit om speciale berichten te maken voor families, scholen en bijzondere gelegenheden. 
            Kies uit video's met de iconische personages Sinterklaas en Zwarte Piet en voeg persoonlijke details toe, zoals een naam, 
            feedback over gedrag, of foto’s. <br /> <br /> Met onze gebruiksvriendelijke tool kunt u video’s downloaden of verzendingen inplannen 
            door simpelweg uw ordernummer en verificatiecode in te voeren. Na een veilige betaling via Mollie, inclusief ondersteuning 
            voor iDeal, ontvangt u een bevestiging per e-mail met een unieke verificatiecode. Verificaties en video’s worden eenvoudig 
            en snel via WhatsApp bezorgd, zodat SMS-verificatie niet nodig is. <br /><br />U kunt de levering van uw video’s automatisch inplannen 
            en ontvangt herinneringen per e-mail en WhatsApp. Daarnaast kunt u zich aanmelden voor onze nieuwsbrief om op de hoogte te 
            blijven van nieuwe functies en aanbiedingen. Uw feedback is belangrijk voor ons – zo kunnen wij onze service continu 
            verbeteren en uw ervaring nog beter maken!
            </p>
          </div>
        </div>
      </div>
      

      {/* Video Carousel */}
      <div ref={videoSectionRef}
      className="w-[80%] mx-auto py-24">
        <div className="flex flex-col items-center gap-8 sm:pb-20 pb-14 ">
          <h1 className="text-red-700 w-full text-center font-christmas md:text-7xl sm:text-5xl text-4xl">
            Video Van Sinterklaas
          </h1>
          <p className="sm:text-sm text-xs font-medium text-gray-600 text-center sm:leading-6 leading-5">
          Verras uw kind, familie, of klas met een persoonlijke videoboodschap van Sinterklaas en Zwarte Piet! In de video wordt 
          ingegaan op namen, interesses, en gedrag, met optionele foto’s voor een extra persoonlijke touch. De video’s (2-3 minuten) 
          worden realistisch gegenereerd met geavanceerde Text-to-Speech-technologie in vloeiend Nederlands. Na aankoop ontvangt u de 
          video direct via WhatsApp of kunt u deze downloaden en inplannen voor de gewenste datum. Breng de magie van Sinterklaas tot 
          leven met een unieke boodschap die herinneringen creëert voor jong en oud!
          </p>
        </div>
        <VideoCarousel />
      </div>

       {/* Letter section */}
       <div className='w-full bg-[#F5F5DC]'>
          <div
          className="w-[80%] mx-auto py-24">
            <div className="flex flex-col items-center gap-8 sm:pb-20 pb-14 ">
              <h1 className="text-red-700 w-full text-center font-christmas md:text-7xl sm:text-5xl text-4xl">
                Brief Van Sinterklaas
              </h1>
              <p className="sm:text-sm text-xs font-medium text-gray-600 text-center sm:leading-6 leading-5">
              Verras uw kind, familie of klas met een persoonlijke brief van Sinterklaas! Elke brief wordt op maat gemaakt, inclusief 
              de naam van de ontvanger, persoonlijke details en een speciale boodschap afgestemd op hun gedrag of prestaties. U kunt 
              zelfs foto’s toevoegen voor een extra persoonlijke touch. Deze prachtig vormgegeven brieven brengen de feestelijke sfeer 
              tot leven en laten elk kind zich gezien en gewaardeerd voelen. Creëer magische momenten met een unieke herinnering die 
              jarenlang gekoesterd zal worden!
              </p>
            </div>
            <div className='max-w-xl mx-auto'>
              <img src={letter} alt="Sinterklaas-letter" className='w-full h-full rounded-xl shadow-2xl shadow-red-950' />
            </div>
          </div>
      </div>

      {/* Statistics with auto-hover effect */}
      <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 sm:gap-8 gap-4 w-[80%] mx-auto md:py-24 sm:py-16 py-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`flex flex-col items-center gap-4 p-12 transition-transform duration-500 ${
              index === activeIndex ? ' shadow-lg hover:shadow-lg transform scale-105' : ''
            } `}
          >
            <stat.icon size={40} className="text-amber-400" />
            <h1 className="text-gray-950 font-bold md:text-5xl text-3xl font-christmas">{stat.value}</h1>
            <label className="font-regular text-gray-500 md:text-md text-sm">{stat.label}</label>
          </div>
        ))}
      </div>
      {/* Reviews */}
      <div style={{ backgroundColor: '#fffafa' }} className='py-16'>
          <div className='w-[80%] mx-auto flex flex-col gap-8'>
              <h1 className="text-red-700 w-full text-center font-christmas md:text-7xl text-4xl">
              Beoordelingen
              </h1>
              <p className="sm:text-sm text-xs font-medium text-gray-600 text-center leading-6">
              Lees de ervaringen van tevreden klanten die al hebben genoten van onze gepersonaliseerde video's en brieven van 
              Sinterklaas en Zwarte Piet! Hun verhalen benadrukken de magie en vreugde die onze diensten brengen tijdens het feest. 
              Of het nu gaat om blije gezichten van kinderen, dankbare ouders, of enthousiaste reacties van scholen – onze 
              beoordelingen laten zien hoe bijzonder deze persoonlijke boodschappen zijn. Laat u inspireren door hun ervaringen en 
              voeg een beetje extra magie toe aan uw eigen Sinterklaasviering!
              </p>
              <ReviewCarousel />
          </div>
      </div>
    
    </div>
  );
}

export default MainPage;
