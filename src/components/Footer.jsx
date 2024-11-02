import React, { useState, useContext } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import whiteLogo from './../assets/sinterklaasWhiteLogo.png';
import applePay from './../assets/applePay.png';
import banContact from './../assets/banContact.png';
import masterCard from './../assets/masterCard.png';
import ideal from './../assets/ideal.png';
import paypal from './../assets/paypal.png';
import { BasicContext } from '../context/BasicContext';



function Footer() {
  const navigate=useNavigate();
  const { setComingSoonModel } = useContext(BasicContext); // Use context to trigger modal
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleComingSoon = () => setComingSoonModel(true); // Modal trigger function

  return (
    <footer className="bg-red-950">
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10 md:p-12 p-6">
        {/* Logo and Description */}
        <div className="flex flex-col items-start justify-start gap-4 pr-6">
          <img src={whiteLogo} alt="Sinterklaas-logo" className="w-[6rem] h-auto" />
          <p className="text-xs text-white font-light leading-6">
            <span className="font-bold">SintMagie</span> creëert gepersonaliseerde video's van Sinterklaas. Laat de
            Goedheiligman jouw gezin persoonlijk toespreken en geef jouw kind een onvergetelijke ervaring!
          </p>
        </div>

        {/* Products Section */}
        <div className="flex flex-col items-start gap-6 pt-6">
          <h3 className="text-lg text-white font-black">Producten</h3>
          <div className="flex flex-col items-start gap-2">
            <button onClick={() => navigate('/Videos')}
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Video van Sinterklaas
            </button>
            <button onClick={handleComingSoon} 
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Brief van Sinterklaas
            </button>
            <button onClick={handleComingSoon} 
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Gratis downloaden
            </button>
            <Link to="/Pricing" className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Prijzen
            </Link>
            <button onClick={handleComingSoon} 
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Kortingscodes en vouchers
            </button>
          </div>
        </div>

        {/* Company Info Section */}
        <div className="flex flex-col items-start gap-6 pt-6">
          <h3 className="text-lg text-white font-black">Bedrijfsgegevens</h3>
          <div className="flex flex-col items-start gap-2">
            <button onClick={handleComingSoon} 
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Over ons
            </button>
            <button onClick={handleComingSoon} 
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Affiliate programma
            </button>
            <button onClick={handleComingSoon} 
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Word ambassadeur van SintMagie
            </button>
            <Link to="/TermOfServices" className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Algemene voorwaarden
            </Link>
            <Link to="/PrivacyPolicy" 
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Privacy- en cookieverklaring
            </Link>
            <button onClick={handleComingSoon} 
            className="hover:text-gray-200 text-xs text-white font-light transition-transform duration-300 hover:scale-[102%]">
              Disclaimer
            </button>
          </div>
        </div>

        {/* Newsletter Signup and Payment Methods */}
        <div className="flex flex-col items-start gap-6 pt-6">
          <h3 className="text-lg text-white font-bold">Aanmelden voor Pietenkorting</h3>
          <form className="flex flex-row items-center w-full">
            <input
              className="shadow-md border-2 px-2 py-3 w-full text-xs focus:outline-none placeholder:text-gray-600"
              type="email"
              placeholder="Vul je e-mailadres in"
            />
            <button
              className={`py-3 border-2 border-red-700 text-xs font-medium w-[10rem] flex items-center justify-center text-nowrap px-1 ${
                isLoading ? 'bg-red-700 text-white' : isSuccess ? 'bg-green-600 text-white' : 'bg-red-700 text-white'
              } ${isLoading ? 'cursor-not-allowed' : ''} transition-colors hover:bg-red-800`}
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Even geduld aub...' : isSuccess ? 'Verzonden' : 'Ontvang je korting!'}
            </button>
          </form>
          <div className="flex flex-col text-start gap-4 w-full">
            <h3 className="text-lg text-white font-bold">Betaalwijzen</h3>
            <div className="flex flex-row items-center justify-between w-full">
              <img src={ideal} alt="iDeal" className="h-[2.4rem] w-auto" />
              <img src={banContact} alt="Bancontact" className="h-[2rem] w-auto" />
              <img src={masterCard} alt="MasterCard" className="h-[2.5rem] w-auto" />
              <img src={applePay} alt="Apple Pay" className="h-[2rem] w-auto" />
              <img src={paypal} alt="PayPal" className="h-[2rem] w-auto" />
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-white font-light text-center py-10 md:px-0 px-2 leading-7">
        This work is governed by the licensing and distribution agreement with Lancewood Holding B.V. <br />
        SintMagie™ is a trademark for which a formal registration application has been filed. <br />
        © 2024 SintMagie - All rights reserved. Unauthorized distribution, duplication, or reproduction of this material is strictly prohibited.
      </p>
    </footer>
  );
}



export default Footer;
