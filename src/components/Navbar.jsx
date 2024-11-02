import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation , useNavigate } from 'react-router-dom';
import logo from './../assets/sinterklaasLogo.png';
import { FaShoppingCart, FaBars } from 'react-icons/fa';
import { BasicContext } from '../context/BasicContext';


function Navbar() {
  const { setComingSoonModel } = useContext(BasicContext);
  const location = useLocation(); 
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Close menu after clicking a menu item
  const handleMenuClick = () => {
    setIsOpen(false);
  };

  // Update `isScrolled` based on route or scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100); // Trigger scroll effect after 100px
    };

    // Check if the current route requires a white background navbar
    const isWhitePage = ['/TermOfServices', '/PrivacyPolicy', '/Login', '/Admin'].includes(location.pathname);
    setIsScrolled(isWhitePage || window.scrollY > 100); // Set the initial `isScrolled` state based on route or scroll position

    if (!isWhitePage) {
      window.addEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]); // Re-run when `location` changes

  return (
    <div
      className={`fixed top-0 left-0 w-full z-10 flex justify-between items-center py-4 md:px-20 px-8 transition-colors duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link to='/' onClick={handleMenuClick}>
        <img src={logo} alt="Sinterklaas Logo" className="sm:h-12 h-8 w-auto" />
      </Link>

      {/* Hamburger Menu */}
      <button className='md:hidden' onClick={() => setIsOpen(!isOpen)}>
        <FaBars className={`${isScrolled ? 'text-gray-800' : 'text-white'} text-2xl`} />
      </button>

      {/* Mobile Menu */}
      <div
        className={`${
          isOpen ? 'flex' : 'hidden'
        } absolute top-full right-0 bg-gray-950 bg-opacity-60 shadow-md flex-col items-start gap-4 p-4 w-full md:hidden text-white`}
      >
        <Link to='/' className="text-white sm:text-sm text-xs font-bold hover:scale-105 transition-transform duration-300 my-1" onClick={handleMenuClick}>
          Startpagina
        </Link>
        <button onClick={() => navigate('/Videos')} className="text-white sm:text-sm text-xs font-bold hover:scale-105 transition-transform duration-300 my-1">
          Video van Sinterklaas
        </button>
        <button onClick={() => { setComingSoonModel(true); handleMenuClick(); }} className="text-white sm:text-sm text-xs font-bold hover:scale-105 transition-transform duration-300 my-1">
          Brief van Sinterklaas
        </button>
        <Link to='/Pricing' className="text-white sm:text-sm text-xs font-bold hover:scale-105 transition-transform duration-300 my-1" onClick={handleMenuClick}>
          Prijzen
        </Link>
        <button onClick={() => navigate('/Videos')} className="py-2 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md text-white font-black text-sm hover:scale-[103%] transition-transform my-1">
          JOUW VIDEO
        </button>
        {/* <Link to='/Login' className="text-white sm:text-sm text-xs font-bold hover:scale-105  bg-gray-50 bg-opacity-20 hover:bg-gray-50 hover:bg-opacity-35  py-2 px-6 rounded
        transition-transform duration-300 my-1" onClick={handleMenuClick}>
         Inloggen
        </Link> */}
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-12 items-center">
        <Link to='/' className={`${isScrolled ? 'text-red-700' : 'text-white'} sm:text-sm text-xs font-semibold hover:scale-105 transition-transform`} onClick={handleMenuClick}>
          Startpagina
        </Link>
        <button onClick={() => navigate('/Videos')} className={`${isScrolled ? 'text-red-700' : 'text-white'} sm:text-sm text-xs font-semibold hover:scale-105 transition-transform`}>
          Video van Sinterklaas
        </button>
        <button onClick={() => setComingSoonModel(true)} className={`${isScrolled ? 'text-red-700' : 'text-white'} sm:text-sm text-xs font-semibold hover:scale-105 transition-transform`}>
          Brief van Sinterklaas
        </button>
        <Link to='/Pricing' className={`${isScrolled ? 'text-red-700' : 'text-white'} sm:text-sm text-xs font-semibold hover:scale-105 transition-transform`} onClick={handleMenuClick}>
          Prijzen
        </Link>
        <button onClick={() => navigate('/Videos')} className="py-2 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md text-red-950 font-black text-sm hover:scale-[103%] transition-transform">
          JOUW VIDEO
        </button>
        {/* <Link to='/Login' className={`${isScrolled ? 'text-red-700' : 'text-white'} 
        sm:text-sm text-xs font-bold hover:scale-105 transition-transform bg-gray-50 bg-opacity-20 hover:bg-gray-50 hover:bg-opacity-35 py-2 px-6 rounded`} 
        onClick={handleMenuClick}>
         Inloggen
        </Link> */}
      </div>
    </div>
  );
}

export default Navbar;
