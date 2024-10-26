import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faPhone, faUser , faPlay } from '@fortawesome/free-solid-svg-icons';
import ReactPlayer from 'react-player';
import introductionThumbnail from './../assets/introductionThumbnail.png';


function VideoCard({ title , videoUrl , onClick }) {
  return (
    <div className="relative h-full transform transition-transform duration-500 hover:scale-[103%] 
    shadow rounded-lg md:w-[70%] w-full mx-auto group"
     onClick={onClick} >
       {/* <ReactPlayer
        url={videoUrl}
        width="100%"
        height="340px"
        light={true}
        playIcon={<div />}
        controls={false} 
        className='rounded-lg'
      /> */}

      <img
          src={introductionThumbnail} // Replace with your dummy image URL
          alt="Video Thumbnail"
          className="w-full h-full object-cover rounded-lg"
        />

           <div className="absolute inset-0 pointer-events-none vignette-gradient"></div>
           
           <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/50 via-transparent"></div>
      
           <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 
                transition-opacity duration-300"
            >
                   <div
                      style={{ textShadow: '2px 4px 3px rgba(0, 0, 0, 1)' }}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 sm:w-[3rem]
                      w-[2rem] sm:h-[3rem] h-[2rem] bg-white 
                      flex items-center justify-center rounded-full transition-transform duration-500 
                      hover:scale-[103%] cursor-pointer z-50"
                    >
                      <FontAwesomeIcon icon={faPlay} className="text-red-950 sm:text-xl text-sm ml-[1px]" />
                    </div>

            </div>


      <div className="absolute inset-0 flex items-end w-full sm:p-6 p-3">
        <div className='flex flex-row items-center justify-between w-full'>
          <div className='flex flex-col items-start sm:gap-4 gap-2 w-full'>
            <h1 style={{textShadow: '2px 4px 3px rgba(0, 0, 0, 1)'}}
            className="text-white md:text-5xl sm:text-4xl text-3xl font-light font-christmas upper">{title}</h1>
            <div className='flex flex-row items-start  w-full'>
                <div className='flex flex-row items-center sm:gap-3 gap-2'>
                  <FontAwesomeIcon 
                  icon={faUser} className='text-white sm:text-md text-xs shadow-md' />
                  <label style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 0.7)' }}
                  className="text-white sm:text-xs text-[10px] font-semibold upper">20 Personalisatiemogelijkheid</label>
                </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoCard;
