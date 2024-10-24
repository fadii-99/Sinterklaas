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
    { icon:  FaPlayCircle, value: "1500+", label: "VIDEO'S" },
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

  // const handleScrollToVideos = () => {
  //   videoSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  // };
  

  return (
    <div className="flex flex-col">
      <HeroSection/>
      <HeroSlider />
      {/* About Section */}
      <div className='w-full bg-gray-50 py-24'>
        <div className="w-[80%] mx-auto ">
          <div className="flex flex-col items-center gap-8 pb-20 ">
            <h1 className="text-red-700 w-full text-center font-christmas md:text-7xl sm:text-5xl text-4xl">
              What We Do
            </h1>
            <p className="sm:text-sm text-xs font-medium text-gray-600 text-center sm:leading-6 leading-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at facilisis mauris, consectetur ultrices nisi.
              In id tristique ipsum. Cras consequat lacus id nisi condimentum, at pharetra ante semper. Nam consectetur mi non
              justo ornare mollis. Fusce orci metus, cursus at tincidunt a, rhoncus eu mauris. Maecenas vulputate nisl venenatis,
              convallis odio a, ullamcorper velit. Aenean vitae nunc quam. Proin sodales nisl sit amet est faucibus, in posuere
              lorem pharetra
              <br /><br />
              Fusce orci metus, cursus at tincidunt a, rhoncus eu mauris. Maecenas vulputate nisl venenatis,
              convallis odio a, ullamcorper velit. Aenean vitae nunc quam. Proin sodales nisl sit amet est faucibus, in posuere
              lorem pharetra
              <br /><br />
              Cras consequat lacus id nisi condimentum, at pharetra ante semper. Nam consectetur mi non
              justo ornare mollis. Fusce orci metus, cursus at tincidunt a, rhoncus eu mauris. Maecenas vulputate nisl venenatis,
              convallis odio a, ullamcorper velit. Aenean vitae nunc quam. Proin sodales nisl sit amet est faucibus, in posuere
              lorem pharetra
              <br /><br />
              Cras consequat lacus id nisi condimentum, at pharetra ante semper. Nam consectetur mi non
              justo ornare mollis. Fusce orci metus, cursus at tincidunt a, rhoncus eu mauris. Maecenas vulputate nisl venenatis,
              convallis odio a, ullamcorper velit. Aenean vitae nunc quam. Proin sodales nisl sit amet est faucibus, in posuere
              lorem pharetra
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at facilisis mauris, consectetur ultrices nisi.
            In id tristique ipsum. Cras consequat lacus id nisi condimentum, at pharetra ante semper. Nam consectetur mi non
            justo ornare mollis. Fusce orci metus, cursus at tincidunt a, rhoncus eu mauris. Maecenas vulputate nisl venenatis,
            convallis odio a, ullamcorper velit. Aenean vitae nunc quam. Proin sodales nisl sit amet est faucibus, in posuere
            lorem pharetra
          </p>
        </div>
        <VideoCarousel />
      </div>

       {/* Letter section */}
       <div className='w-full bg-[#F5F5DC]'>
          <div ref={videoSectionRef}
          className="w-[80%] mx-auto py-24">
            <div className="flex flex-col items-center gap-8 sm:pb-20 pb-14 ">
              <h1 className="text-red-700 w-full text-center font-christmas md:text-7xl sm:text-5xl text-4xl">
                Brief Van Sinterklaas
              </h1>
              <p className="sm:text-sm text-xs font-medium text-gray-600 text-center sm:leading-6 leading-5">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at facilisis mauris, consectetur ultrices nisi.
                In id tristique ipsum. Cras consequat lacus id nisi condimentum, at pharetra ante semper. Nam consectetur mi non
                justo ornare mollis. Fusce orci metus, cursus at tincidunt a, rhoncus eu mauris. Maecenas vulputate nisl venenatis,
                convallis odio a, ullamcorper velit. Aenean vitae nunc quam. Proin sodales nisl sit amet est faucibus, in posuere
                lorem pharetra
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
                Reviews
              </h1>
              <p className="sm:text-sm text-xs font-medium text-gray-600 text-center leading-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at facilisis mauris, consectetur ultrices nisi.
                In id tristique ipsum. Cras consequat lacus id nisi condimentum, at pharetra ante semper. Nam consectetur mi non
                justo ornare mollis. Fusce orci metus, cursus at tincidunt a, rhoncus eu mauris. Maecenas vulputate nisl venenatis,
                convallis odio a, ullamcorper velit. Aenean vitae nunc quam. Proin sodales nisl sit amet est faucibus, in posuere
                lorem pharetra
              </p>
              <ReviewCarousel />
          </div>
      </div>
    
    </div>
  );
}

export default MainPage;
