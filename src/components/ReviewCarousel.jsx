import { useState } from 'react';
import { Navigation, Pagination, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function ReviewCarousel() {
  const reviews = [
    {
      text: "De gepersonaliseerde Sinterklaasvideo was magisch! Mijn zoon kon niet geloven dat Sinterklaas zijn naam noemde en de dingen die hij had gevraagd. Het maakte zijn dag echt bijzonder!",
      name: "Sarah Verhoeven",
      location: "Rotterdam",
    },
    {
      text: "Onze kinderen waren verbaasd over de Sinterklaasvideo! Het was zo'n speciale toevoeging aan onze feestviering. Ze praten nog steeds over hoe Sinterklaas zoveel over hen wist!",
      name: "Mark de Vries",
      location: "Amsterdam",
    },
    {
      text: "De Sinterklaasvideo was prachtig gemaakt! Mijn dochter glimlachte de hele video door. Bedankt dat jullie dit feestseizoen extra speciaal hebben gemaakt!",
      name: "Lotte Jansen",
      location: "Utrecht",
    }
  ];

  
  return (
    <div className="relative w-full my-16">
      <Swiper
        modules={[Navigation, Pagination, A11y, Autoplay]}
        loop={true}
        spaceBetween={50}
        slidesPerView={1}
        navigation={{
          prevEl: '.custom-swiper-button-prev',
          nextEl: '.custom-swiper-button-next',
        }}
        speed={700}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
      >
        {reviews.map((review, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <div className="sm:w-[80%] mx-auto bg-white md:p-12 sm:p-8 p-6 rounded-xl border">
              <div className="flex justify-center mb-6">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zM8 9a1 1 0 011-1h2a1 1 0 110 2H9v1h2a1 1 0 110 2H9a1 1 0 110-2h1v-1H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <p className="text-center italic md:text-lg sm:text-md text-sm text-red-950 mb-12">{`"${review.text}"`}</p>
              <p className="text-center font-medium md:text-3xl sm:text-2xl text-xl font-christmas mb-2 text-red-950">{review.name}</p>
              <p className="text-center text-gray-600 sm:text-sm text-xs">{review.location}</p>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Buttons, visible only on medium screens and up */}
        <div className="custom-swiper-button-prev absolute left-0 transform -translate-y-1/2 top-1/2 z-10 p-3 bg-red-950 shadow-md rounded-full hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 44" className="h-5 w-5" fill="white" stroke="white" strokeWidth="2">
            <path d="M0,22L22,0l2.1,2.1L4.2,22l19.9,19.9L22,44L0,22L0,22L0,22z"/>
          </svg>
        </div>
        <div className="custom-swiper-button-next absolute right-0 transform -translate-y-1/2 top-1/2 z-10 p-3 bg-red-950 shadow-md rounded-full hidden md:block">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 44" className="h-5 w-5" fill="white" stroke="white" strokeWidth="2">
            <path d="M27,22L27,22L5,44l-2.1-2.1L22.8,22L2.9,2.1L5,0L27,22L27,22z"/>
          </svg>
        </div>
      </Swiper>

      {/* Pagination Dots */}
      <div className="swiper-pagination flex justify-center mt-4"></div>
    </div>
  );
}

export default ReviewCarousel;
