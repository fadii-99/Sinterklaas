import React , { useState } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter} from '@fortawesome/free-brands-svg-icons';
import whiteLogo from './../assets/sinterklaasWhiteLogo.png';
import applePay from './../assets/applePay.png';
import banContact from './../assets/banContact.png';
import masterCard from './../assets/masterCard.png';
import ideal from './../assets/ideal.png';
import paypal from './../assets/payPal.png';



function Footer() {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);


  return (
    <footer className="bg-red-950">
         <div className='grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10 md:p-12 p-6'>
            <div className='flex flex-col items-start justify-start gap-4 pr-6'>
               {/* image */}
               <div>
                <img src={whiteLogo} alt="Sinterklaas-logo" className='w-[6rem] h-auto' />
               </div>
               <p className='text-xs text-white font-light leading-6'> <span className='font-bold'>SintMagie</span>  creëert gepersonaliseerde video's van 
                Sinterklaas.Laat de Goedheiligman jouw gezin persoonlijk toespreken en geef jouw kind een onvergetelijke ervaring!</p>
            </div>
            <div className='flex flex-col items-start gap-6 pt-6'>
              <h3 className='text-lg text-white font-black'>Producten</h3>
                 <div className='flex flex-col text-start gap-2'>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Video van Sinterklaas</Link>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Brief van Sinterklaas</Link>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Gratis downloaden</Link>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Prijzen</Link>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Kortingscodes en vouchers</Link>

                 </div>
            </div>
            <div className='flex flex-col items-start gap-6 pt-6'>
              <h3 className='text-lg text-white  font-black'>Bedrijfsgegevens</h3>
                 <div className='flex flex-col text-start gap-2'>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Over ons</Link>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Affiliate program</Link>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Word ambassadeur van SintMagie</Link>
                 <Link to='/TermOfServices' className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Algemene voorwaarden</Link>
                 <Link to='/PrivacyPolicy' className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Privacy- en cookieverklaring</Link>
                 <Link className="hover:text-gray-200  text-xs text-white font-light transform transition-transform duration-300 hover:scale-[102%]">Disclaimer</Link>
                 </div>
            </div>
            <div className='flex flex-col items-start gap-6 pt-6'>
                 <h3 className='text-lg text-white  font-bold'>Aanmelden voor Pietenkorting</h3>
                 <form className="flex flex-row items-center w-full">
                        <input
                            className={`shadow-md border-2 px-2 py-3 w-full text-xs focus:outline-none placeholder:text-gray-600 
                          `}
                            type="email"
                            placeholder="Vul je e-mailadres in"
                            value=''
                            // onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className={`py-3 border-2 border-red-700 text-xs font-medium focus:outline-none w-[10rem] flex items-center justify-center
                                ${isLoading ? 'bg-red-700 text-white' : isSuccess ? 'bg-green-600 text-white' : 'bg-red-700 text-white'}
                                ${isLoading ? 'cursor-not-allowed' : ''} text-nowrap px-2 hover:bg-red-800`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Even geduld aub...' : isSuccess ? 'Verzonden' : 'Ontvang je korting!'}
                        </button>
                    </form>
                      <div className='flex flex-col text-start gap-4 w-full'>
                        <h3 className='text-lg text-white  font-bold'>Betaalwijzen</h3>
                        <div className='flex flex-row items-center justify-between w-full'>
                             <div className=''> <img src={ideal} alt="iDeal" className='h-[2.4rem] w-auto' /></div>
                             <div className=''> <img src={banContact} alt="Bancontact" className='h-[2rem] w-auto' /></div>
                             <div className=''> <img src={masterCard} alt="MasterCard" className='h-[2.5rem] w-auto' /></div>
                             <div className=''> <img src={applePay} alt="Apple Pay" className='h-[2rem] w-auto' /></div>
                             <div className=''> <img src={paypal} alt="PayPal" className='h-[2rem] w-auto' /></div>
 
                        </div>
                      </div>
            </div>
         </div>
         <p className='text-xs text-white font-light text-center flex justify-center items-center py-10 md:px-0 px-2 md:max-w-3xl w-full mx-auto leading-7'> 
         This work is governed by the licensing and distribution agreement with Lancewood Holding B.V. <br />
        SintMagie™ is a trademark for which a formal registration application has been filled. <br />
        © 2024 SintMagie - All rights reserved. Unauthorized distribution, duplication, or reproduction of this material is strictly prohibited.
         </p>
      {/* <div className="px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex justify-center gap-6">
          <Link to='/TermOfServices' className="hover:text-gray-200  sm:text-sm text-xs text-white
          transform transition-transform duration-300 hover:scale-[102%]">
             Terms of Service
          </Link>
          <Link to='/PrivacyPolicy' className="hover:text-gray-200  sm:text-sm text-xs text-white
          transform transition-transform duration-300 hover:scale-[102%]">
             Privacy Policy
          </Link>
        </div>
          <p className="text-center md:text-left sm:text-sm text-xs text-white">
          © 2024 Sinterklaas. All rights reserved.
        </p>
        <div className="flex flex-row items-center gap-6">
            <a href="" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebookF} className="h-5 w-auto transform transition-transform duration-300 hover:scale-[108%]
               text-white" />
            </a>
            <a href="" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faXTwitter} className="h-5 w-auto transform transition-transform duration-300 hover:scale-[108%]
             text-white"  />
            </a>
            <a href="" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="h-6 w-auto transform transition-transform duration-300 hover:scale-[108%]
               text-white" />
            </a>
          </div>
      </div> */}
    </footer>
  );
}

export default Footer;
