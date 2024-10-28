import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes, faPlay, faMicrophone, faClock, faGift } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player';
import { BasicContext } from '../context/BasicContext';
import introductionThumbnail from './../assets/introductionThumbnail.png';
import { FaCreditCard, FaPaypal, FaCcVisa, FaCcMastercard } from 'react-icons/fa';
import banContact from './../assets/banContact.png';
import masterCard from './../assets/masterCard.png';
import ideal from './../assets/ideal.png';
import paypal from './../assets/payPal.png';
import applePayBlack from './../assets/applePayBlack.png';



function ProductChoice({ onNext, onClose }) {
  const { selectedVideo , setVideoFormData } = useContext(BasicContext);

  const purchaseOptions = [
    { kind: 'Voor 1 Kind', value: 12.95 },
    { kind: 'Voor Gezinnen', value: 16.95 },
    { kind: 'Voor Volwassenen', value: 14.95 },
  ];

  const [selectedOption, setSelectedOption] = useState(purchaseOptions[0]);
  const [isVoucherInputVisible, setVoucherInputVisible] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const [playerHeight, setPlayerHeight] = useState('370px');
  const [errorMessage, setErrorMessage] = useState('');


  const handlePlay = () => {
    setIsPlaying(true);
  };

  const toggleVoucherInput = () => {
    setVoucherInputVisible(!isVoucherInputVisible);
  };


  const videoFormSubmit = () => {
    setVideoFormData(
    {
      product: selectedOption,
      voucherCode: voucherCode || null,
      videoTitle:selectedVideo.title
    })
    onNext();
  }


  // Adjust player height based on screen width
  useEffect(() => {
    const updatePlayerHeight = () => {
      const width = window.innerWidth;
      if (width <= 820) {
        setPlayerHeight('200px');
      }  if (width <= 550) {
        setPlayerHeight('200px');
      } else {
        setPlayerHeight('370px');
      }
    };

    // Initial setup
    updatePlayerHeight();
    window.addEventListener('resize', updatePlayerHeight);

    // Cleanup event listener
    return () => window.removeEventListener('resize', updatePlayerHeight);
  }, []);




  const handleCouponSubmit = async () => {
    setLoading(true); // Start loading

    try {
      const formData = new FormData();
      formData.append('coupon', voucherCode);

      const response = await fetch('http://134.122.63.191:9000/redeem_coupon/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
    

      console.log(data);
      if (response.ok) {
        const value= selectedOption.value;
        const discount = (value * 0.1).toFixed(2); 
        const discountedValue = (value - discount).toFixed(2);
        console.log('Discounted value:', discountedValue);
  
        // Update the selected option with the new discounted value
        setSelectedOption((prev) => ({ ...prev, value: discountedValue }))
        setLoading(false); 

      }
      else{
        setErrorMessage('Invalid coupon code');
      }
    } catch (error) {
      console.error('Error validating voucher:', error);
    }finally {
      setVoucherInputVisible(false);
      setVoucherCode('');
      setLoading(false); // Stop loading
    }
  };




  return (
      <div className="relative w-full">

<div className="relative w-full h-full">
  {isPlaying ? (
    // Render the video player when isPlaying is true
    <div className='relative '>
        <video
          width="100%"
          height='100%'
          controls={true}
          className=""
        >
          <source src={selectedVideo.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className='absolute top-0 right-0 sm:p-4 p-2'>
            <div className="w-[3rem] h-[3rem] bg-white bg-opacity-0 hover:bg-opacity-10 transition duration-300 ease-in-out 
            flex items-center justify-center rounded-full z-50 ">
            <FontAwesomeIcon onClick={onClose} icon={faTimes} className="text-white text-xl font-bold" />
          </div>
        </div>
    </div>
  ) : (
    <>
      {/* Render the thumbnail when not playing */}
      <img
        src={introductionThumbnail}
        alt="Video Thumbnail"
        className="w-full md:h-[25rem] sm:h-[20rem] h-[15rem] object-cover rounded-lg"
      />

      {/* Vignette and gradient overlays */}
      <div className="absolute inset-0 pointer-events-none vignette-gradient"></div>
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent"></div>

      {/* Play Button */}
      <div
        onClick={handlePlay}
        style={{ textShadow: '2px 4px 3px rgba(0, 0, 0, 1)' }}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:w-[3rem]
        w-[2rem] sm:h-[3rem] h-[2rem] bg-white 
        flex items-center justify-center rounded-full transition-transform duration-500 
        hover:scale-[103%] cursor-pointer z-50"
      >
        <FontAwesomeIcon icon={faPlay} className="text-red-950 sm:text-xl text-sm ml-[1px]" />
      </div>

      {/* Top Labels */}
      <div className="absolute flex flex-row items-center justify-between w-full top-0 sm:p-4 p-2">
        <div className="flex flex-row items-center sm:gap-4 gap-2">
          <label className="text-red-950 font-black sm:text-xs text-[9px] p-2 bg-white uppercase shadow-md rounded-sm">
            Nieuwe Video 2024
          </label>
          <label className="text-red-950 font-black sm:text-xs text-[9px] p-2 bg-gradient-to-r from-yellow-400 to-amber-500 uppercase shadow-md rounded-sm">
            Populair
          </label>
        </div>
    
      </div>

      {/* Title */}
      <div className="absolute flex items-end justify-end w-full bottom-0 sm:p-4 p-2">
        <h1 className="text-white w-full font-christmas md:text-5xl sm:text-4xl text-3xl">
          {selectedVideo.title}
        </h1>
      </div>
    </>
  )}
</div>


        <div className='p-6 flex flex-col items-center gap-14'>
          <div className='w-full flex flex-col gap-4'>
            <div className='flex md:flex-row flex-col md:items-end md:justify-between gap-4 w-full'>
              {purchaseOptions.map((option) => (
                <div
                  key={option.kind}
                  onClick={() => setSelectedOption(option)}
                  className={`flex items-center justify-center border-[1.5px] border-opacity-40 hover:border-opacity-100 border-red-950 sm:py-6 py-4 w-full rounded-md cursor-pointer 
                    ${selectedOption.kind === option.kind ? 'bg-red-950 text-white' : 'bg-white text-gray-950'}`}
                >
                  <label className="font-bold text-xs">{option.kind}</label>
                </div>
              ))}
            </div>
            <button
              className='py-4 w-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md
              text-red-950 font-black sm:text-md text-sm transform transition-transform duration-300 hover:scale-[103%]'
              onClick={videoFormSubmit}
            >
              Video Personaliseren - <span className='sm:text-lg text-md ml-1'>€{selectedOption.value}</span>
            </button>

            <div className='flex sm:flex-row flex-col sm:items-center items-start gap-5'>
              <button
                className='text-green-500 font-medium hover:text-green-600 flex items-center gap-2 sm:text-sm text-xs text-nowrap outline-none'
                onClick={toggleVoucherInput}
              >
                <FontAwesomeIcon icon={faGift}/>
                Koop tegoedbon
              </button>

              {isVoucherInputVisible && (
                <div className='flex flex-row items-center gap-2 w-full'>
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Voer vouchercode in"
                      className='p-2 border border-gray-300 rounded-md w-full sm:text-sm text-xs'
                    />
                    <button
                      onClick={handleCouponSubmit}
                      disabled={loading} // Disable button while loading
                      className={`px-4 py-2 bg-gray-900 text-white text-sm rounded-md ${loading ? 'opacity-50' : ''}`}
                    >
                      {loading ? 'Processing...' : 'Enter'}
                    </button>
                </div>
              

              )}
            </div>
            <p className='text-xs font-bold text-red-500 text-start'>{errorMessage}</p>
 {/* ....................................... */}
            <div className='flex md:flex-row flex-col items-center md:gap-0 gap-8 md:justify-between w-full'>
                  <div className='mt-6 flex flex-col items-start gap-4'>
                    <p className='text-green-500 font-semibold sm:text-sm text-xs'>Direct beschikbaar</p>
                    <ul className='text-gray-700 sm:text-xs text-[10px] flex flex-col items-start gap-2'>
                      <li> <span className='mr-2 text-nowrap'>✓</span> Gepersonaliseerde video</li>
                      <li> <span className='mr-2 text-nowrap'>✓</span> Download binnen enkele minuten na aankoop</li>
                      <li> <span className='mr-2 text-nowrap'>✓</span> Ontvang nu ook via WhatsApp en kies een leverdatum</li>
                      <li> <span className='mr-2 text-nowrap'>✓</span> Steun CliniClowns met je aankoop</li>
                      <li> <span className='mr-2 text-nowrap'>✓</span> Veilig betalen</li>
                    </ul>
                  </div>
                  <div className='flex flex-row items-center justify-between gap-4'>
                             <div className=''> <img src={ideal} alt="iDeal" className='h-[2rem] w-auto' /></div>
                             <div className=''> <img src={banContact} alt="Bancontact" className='h-[1.8rem] w-auto' /></div>
                             <div className=''> <img src={masterCard} alt="MasterCard" className='h-[2.1rem] w-auto' /></div>
                             <div className=''> <img src={applePayBlack} alt="Apple Pay" className='h-[1.6rem] w-auto' /></div>
                             <div className=''> <img src={paypal} alt="PayPal" className='h-[1.6rem] w-auto' /></div>
                   </div>
            </div>
          
          </div>
        </div>
      </div>
  );
}

export default ProductChoice;
