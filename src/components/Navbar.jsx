import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './../assets/sinterklaasLogo.png';
import { FaShoppingCart } from 'react-icons/fa';


function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  // Function to detect scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-10 flex justify-between items-center py-4 md:px-20 px-8 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-lg ' : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <div className='flex flex-row items-center gap-12'>
        <Link to='/'>
          <img src={logo} alt="Sinterklaas-Logo" className="sm:h-12 h-8 w-auto" />
        </Link>
        <Link to="" className={`${isScrolled ? 'text-red-700' : 'text-white' }  sm:text-sm text-xs font-bold hover:scale-105 transform transition-transform duration-300`}>
          Video van Sinterklaas
        </Link>
        <Link to="" className={`${isScrolled ? 'text-red-700' : 'text-white' }  sm:text-sm text-xs font-bold hover:scale-105 transform transition-transform duration-300`}>
          Brief van Sinterklaas
        </Link>

      </div>
   

      {/* Right-side Links */}
      <div className="flex gap-12 items-center">
        <Link to="/" className={`${isScrolled ? 'text-red-700' : 'text-white' }  sm:text-sm text-xs font-bold hover:scale-105 transform transition-transform duration-300`}>
          Prijzen
        </Link>
        <Link>
                <button
                className="py-2 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center space-x-2 rounded-md
                    text-red-950 font-black text-sm transform transition-transform duration-300 hover:scale-[103%] w-full"
                >
                JOUW VIDEO
                </button>
        </Link>
        <Link to="" >
               <FaShoppingCart className={`${isScrolled ? 'text-red-700' : 'text-white' }  
               text-xl hover:scale-105 transform transition-transform duration-300`} />
        </Link>
       
      </div>
    </div>
  );
}

export default Navbar;
