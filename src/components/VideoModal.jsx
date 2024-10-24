import React, { useState, useContext, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faTimes, faPlay, faMicrophone, faClock, faGift } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player';
import { BasicContext } from '../context/BasicContext';
import introductionThumbnail from './../assets/introductionThumbnail.png';
import { FaCreditCard, FaPaypal, FaCcVisa, FaCcMastercard } from 'react-icons/fa';

function VideoModal({ video, onClose }) {
  const options = useContext(BasicContext);
  const purchaseOptions = [
    { kind: 'Voor 1 Kind', value: 24 },
    { kind: 'Voor broers en zussen (max 4)', value: 30 },
    { kind: 'Voor volwassenen', value: 35 },
  ];

  const [selectedOption, setSelectedOption] = useState(purchaseOptions[0]);
  const [isVoucherInputVisible, setVoucherInputVisible] = useState(false);
  const [voucherCode, setVoucherCode] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerHeight, setPlayerHeight] = useState('370px');

  const handlePurchase = () => {
    const data = {
      title: video.title,
      kind: selectedOption.kind,
      value: selectedOption.value,
      coupon: voucherCode || null,
      link: video.videoUrl,
    };
    console.log(data);
    options.setPurchaseData(data);
    options.setShowFormModel(true);
    onClose();
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const toggleVoucherInput = () => {
    setVoucherInputVisible(!isVoucherInputVisible);
  };

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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 px-8">
      <div className="bg-white shadow-lg relative w-full md:max-w-2xl max-w-xl max-h-[90vh] overflow-auto 
      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 rounded-md">

<div className="relative w-full h-full">
  {isPlaying ? (
    // Render the video player when isPlaying is true
    <video
      width="100%"
      height='100%'
      controls={true}
      className=""
    >
       <source src={video.videoUrl} type="video/mp4" />
       Your browser does not support the video tag.
    </video>
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
            New Video 2024
          </label>
          <label className="text-red-950 font-black sm:text-xs text-[9px] p-2 bg-gradient-to-r from-yellow-400 to-amber-500 uppercase shadow-md rounded-sm">
            BestSeller
          </label>
        </div>
        <div className="w-[3rem] h-[3rem] bg-white bg-opacity-0 hover:bg-opacity-10 transition duration-300 ease-in-out flex items-center justify-center rounded-full relative z-10">
          <FontAwesomeIcon onClick={onClose} icon={faTimes} className="text-white text-xl font-bold" />
        </div>
      </div>

      {/* Title */}
      <div className="absolute flex items-end justify-end w-full bottom-0 sm:p-4 p-2">
        <h1 className="text-white w-full font-christmas md:text-5xl sm:text-4xl text-3xl">
          {video.title}
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
              onClick={handlePurchase}
            >
              Purchase Now - <span className='sm:text-lg text-md ml-1'>${selectedOption.value}</span>
            </button>

            <div className='flex flex-row items-center gap-5'>
              <button
                className='text-green-500 font-medium hover:text-green-600 flex items-center gap-2 sm:text-sm text-xs text-nowrap outline-none'
                onClick={toggleVoucherInput}
              >
                <FontAwesomeIcon icon={faGift}/>
                Buy Voucher
              </button>

              {isVoucherInputVisible && (
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Enter Voucher Code"
                  className='p-2 border border-gray-300 rounded-md w-full sm:text-sm text-xs'
                />
              )}
            </div>
 {/* ....................................... */}
            <div className='flex md:flex-row flex-col items-center md:gap-0 gap-8 md:justify-between w-full md:pr-10'>
                  <div className='mt-6 flex flex-col items-start gap-4'>
                    <p className='text-green-500 font-semibold sm:text-sm text-xs'>Direct beschikbaar</p>
                    <ul className='text-gray-700 sm:text-xs text-[10px] flex flex-col items-start gap-2'>
                      <li> <span className='mr-2'>✓</span> Gepersonaliseerde video</li>
                      <li> <span className='mr-2'>✓</span> Download binnen enkele minuten na aankoop</li>
                      <li> <span className='mr-2'>✓</span> Ontvang ook via WhatsApp of kies een leverdatum</li>
                      <li> <span className='mr-2'>✓</span> Steun CliniClowns met je aankoop</li>
                      <li> <span className='mr-2'>✓</span> Veilig betalen</li>
                    </ul>
                  </div>
                  <div className="flex gap-4 items-center justify-center">
                    <FaCreditCard size={20} className="text-blue-500" />
                    <FaPaypal size={20} className="text-blue-600" />
                    <FaCcVisa size={20} className="text-blue-700" />
                    <FaCcMastercard size={20} className="text-red-600" />
                  </div>
            </div>
          
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoModal;
