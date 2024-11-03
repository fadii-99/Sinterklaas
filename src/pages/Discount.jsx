import HeroSection from "../components/HeroSection";
import React from "react";
import VideoCarousel from "../components/VideoCarousel";
import HeroSlider from "../components/HeroSlider";
import exampleImage from '../assets/exampleImage.webp'


function Discount() {
  return (
    <div className="flex flex-col items-center gap-20 overflow-hidden">
      <HeroSection
        heading="Kortingscodes en vouchers"
        height="60vh"
        videoWidth
      />

      {/* Grid Section */}
      <div className="w-full md:w-[80%] flex flex-col gap-20 mx-auto pb-24 px-10">
        {/* First Row */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-16">
          <div className="flex flex-col gap-8 justify-center">
                <h2 className="md:text-4xl sm:text-3xl text-2xl font-christmas font-bold text-red-950">Hoe gebruik je de code?</h2>
                <p className="text-gray-600 sm:text-sm text-xs">
                    ✨ Voer je code in het veld hierboven in en klik op "Gebruik je code"<br /><br />
                    ✨ Personaliseer je video<br /><br />
                    ✨ Je ontvangt je videoboodschap binnen 6 uur
                </p>
          </div>
          <div className="md:p-6" >
            <img
                src={exampleImage}
                alt="Description of image 1"
                className="w-full h-full rounded-2xl shadow-2xl shadow-red-950"
            />
          </div> 
       
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
    <div className="order-2 md:order-1 md:p-6 w-full">
        <img
            src={exampleImage}
            alt="Description of image 1"
            className="w-full h-full rounded-2xl shadow-2xl shadow-red-950"
        />
    </div> 
    <div className="order-1 md:order-2 flex flex-col gap-8 justify-center w-full">
        <h2 className="lg:text-4xl md:text-3xl text-2xl font-christmas font-bold text-red-950">
            Hoe gebruik je je kortingsbon?
        </h2>
        <p className="text-gray-600 sm:text-sm text-xs">
            🎄 Voer je coupon in het veld hierboven in en klik op "Voeg een coupon toe"<br /><br />
            🎄 Personaliseer je bericht van de Kerstman<br /><br />
            🎄 Personaliseer je video (voeg een naam en enkele foto's toe)<br /><br />
            🎄 Je bericht van de Kerstman wordt naar je mailbox gestuurd via e-mail of per post.
        </p>
    </div>
</div>





        {/* Third Row */}
        <div className="grid md:grid-cols-2 grid-cols-1 gap-16">
            <div className="flex flex-col gap-8 justify-center">
                <h2 className="md:text-4xl sm:text-3xl text-2xl font-christmas font-bold text-red-950">Speciale aanbiedingen van Elfi</h2>
                <p className="text-gray-600 sm:text-sm text-xs">
                    🎁 Gratis levering van brieven voor abonnees van onze Elfi Nieuwsbrief<br /><br />
                    🎁 Eendaagse kortingen tot 35%, gepubliceerd op onze Facebook-pagina<br /><br />
                    🎁 Kortingen en gratis vouchers voor deelname aan Elfi Contests
                </p>
                </div>
          <div className="md:p-6" >
            <img
                 src={exampleImage}
                alt="Description of image 1"
                className="w-full h-full rounded-2xl shadow-2xl shadow-red-950"
            />
          </div> 
        </div>
      </div>
    </div>
  );
}


export default Discount;
