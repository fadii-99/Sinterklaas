import { useState, useEffect } from 'react';
import bgImage from './../assets/bgHome.webp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import useScrollAnimation from './useScrollAnimation';


function HeroSection(){
    useScrollAnimation('.fade-in-left', 'animate');
    useScrollAnimation('.fade-in-right', 'animate');


    return(
         <div
            className="flex flex-col items-center justify-center min-h-screen relative pt-32"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.65)), 
                    radial-gradient(circle, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.5) 100%), 
                    url(${bgImage})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="max-w-4xl w-full flex flex-col items-center gap-5 sm:px-4 px-8">
              <label 
              className='md:text-lg sm:text-sm text-xs font-black italic bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 
              bg-clip-text text-transparent'>
              _____Gepersonaliseerde Video's voor Familie en Vrienden!
            </label>
            <h1 style={{ textShadow: '2px 4px 3px rgba(0, 0, 0, 0.5)' }}
                    className="text-white w-full text-center font-christmas md:text-8xl text-5xl ">
                    Ontdek de Magie van Sinterklaas!
                </h1>
            <p className="sm:text-sm text-xs font-medium text-center sm:leading-6 leading-5 py-6 md:w-[60%] mx-auto text-white">
            Creéer echte SintMagie met gepersonaliseerde video's van Sinterklaas. Laat
                de Goedheiligman jouw gezin persoonlijk toespreken en geef jouw kind een
                onvergetelijke ervaring!
            </p>
            <div className='flex flex-col items-start gap-4'>
                <button
                
                className="py-4 px-10 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center space-x-2 rounded-md
                    text-red-950 font-black sm:text-sm text-xs transform transition-transform duration-300 hover:scale-[103%] 
                    w-full "
                >
                BESTELLEN
                </button>
                <div className='flex flex-row items-center gap-4  py-3 px-10 rounded-md
                 transform transition-transform duration-300 hover:scale-[103%] cursor-pointer hover:bg-gray-50 hover:bg-opacity-20'>
                    <div
                    style={{ textShadow: '2px 4px 3px rgba(0, 0, 0, 1)' }}
                    className="w-[1.7rem] h-[1.7rem] bg-white
                    flex items-center justify-center rounded-full transition-transform duration-500 
                    hover:scale-[103%] cursor-pointer z-50"
                >
                    <FontAwesomeIcon icon={faPlay} className="text-red-500 sm:text-sm ml-[1px]" />
                    </div>
                    <span className='text-white font-black sm:text-sm text-xs'>Bekijk alle video's</span>
                </div>
            </div>
            
         </div>
                
            </div>



    )}

export default HeroSection;