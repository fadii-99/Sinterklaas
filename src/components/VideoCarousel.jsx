import { useState ,  useContext } from 'react';
import { Navigation, Pagination, A11y, EffectCoverflow, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import VideoCard from './VideoCard';
import VideoModal from './VideoModal';
import introductionVideo from './../assets/introductionVideo.mp4';
import MultiStepForm from '../pages/MultiStepForm';
import { BasicContext } from '../context/BasicContext';


function VideoCarousel() {
  const { setSelectedVideo } = useContext(BasicContext);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const video = { title: 'Greet Video', videoUrl: introductionVideo };


  const openModal = () => {
      setIsModalOpen(true);
      setSelectedVideo(video);

  }

  const closeModal = () =>  {
    
    setIsModalOpen(false);

  }


  return (
    <div className="relative">
      <Swiper
        modules={[Navigation, Pagination, A11y, EffectCoverflow, Autoplay]}
        loop={true}
        spaceBetween={0}
        slidesPerView={1}
        centeredSlides={true}
        navigation={{
          prevEl: '.custom-swiper-button-prev',
          nextEl: '.custom-swiper-button-next',
        }}
        speed={700}
        effect="coverflow"
        coverflowEffect={{ rotate: 0, stretch: 70, depth: 180, modifier: 1, slideShadows: true }}
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
        breakpoints={{
          820: {
            slidesPerView: 1,
            spaceBetween: 0,
          }
        }}
      >
          <SwiperSlide  className='shadow-md rounded-lg'>
            <VideoCard 
              title={video.title} 
              videoUrl={video.videoUrl} 
              onClick={openModal}
            />
          </SwiperSlide>

        {/* Custom Navigation Buttons */}
        <div className="custom-swiper-button-prev absolute left-0 transform -translate-y-1/2 top-1/2 z-10 p-2 bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 44" className="h-6 w-6">
            <path d="M0,22L22,0l2.1,2.1L4.2,22l19.9,19.9L22,44L0,22L0,22L0,22z" fill="white" stroke="white" strokeWidth="3"/>
          </svg>
        </div>
        <div className="custom-swiper-button-next absolute right-0 transform -translate-y-1/2 top-1/2 z-10 p-2 bg-transparent">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 27 44" className="h-6 w-6">
            <path d="M27,22L27,22L5,44l-2.1-2.1L22.8,22L2.9,2.1L5,0L27,22L27,22z" fill="white" stroke="white" strokeWidth="3"/>
          </svg>
        </div>
      </Swiper>

      {/* Pagination Dots */}

      {isModalOpen && (<MultiStepForm onClose={closeModal} />)}

    </div>
  );
}

export default VideoCarousel;
