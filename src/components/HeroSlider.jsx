// Import FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faPen, faTruck, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import { useEffect, useRef } from 'react';
import cliniClownIcon from './../assets/cliniclown.png';

// Array of card objects
const cards = [
  { icon: faGift, text: "Unieke Sinterklaas verrassing <br /> voor jouw kind" },
  { icon: faPen, text: "Eenvoudige personalisatie <br /> binnen 5 minuten" },
  { icon: faTruck, text: "Direct beschikbaar" },
  { icon: faWhatsapp, text: "Nieuw: ontvang/verstuur <br /> via WhatsApp" },
  { icon: faShieldAlt, text: "Veilig betalen" },
  { icon: cliniClownIcon, text: "Wij steunen" , isImage: true}, // Duplicate to ensure smooth loop
];

// Custom Continuous Sliding Component
function HeroSlider() {
  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    let animationFrameId;

    const scroll = () => {
      if (slider) {
        // Scroll horizontally at a constant speed
        slider.scrollLeft += 3; // Adjust this value for speed control

        // Reset scroll to the beginning to create a seamless loop
        if (slider.scrollLeft >= slider.scrollWidth / 2) {
          slider.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId); // Clean up on unmount
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      <div
        ref={sliderRef}
        className="flex overflow-hidden whitespace-nowrap"
        style={{ width: '100%' }}
      >
        {cards.concat(cards).map((card, index) => ( // Duplicating cards for seamless loop
          <div
            key={index}
            className="flex items-center justify-center gap-8 min-w-full sm:min-w-[50%] md:min-w-[33.33%]" // Responsive widths for each slide
          >
             {card.isImage ? (
              <img src={card.icon} className="h-[2rem] w-auto object-cover" alt="cliniClown-logo" />
            ) : (
              <FontAwesomeIcon icon={card.icon} className="text-3xl text-gray-600" />
            )}
            <span
              className="text-gray-600 text-sm font-semibold"
              dangerouslySetInnerHTML={{ __html: card.text }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroSlider;
