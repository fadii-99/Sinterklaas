import HeroSection from "../components/HeroSection";
import React from "react";

function About() {
  return (
    <div className="flex flex-col items-center gap-20 overflow-hidden">
      <HeroSection
        heading="Over ons"
        height="60vh"
        videoWidth
      />

      <div className="w-full md:w-[60%] flex flex-col items-center gap-20 mx-auto pb-24 px-10">
        <h2 className="md:text-5xl text-4xl font-christmas font-bold text-red-950 text-center">
          Elfi Team
        </h2>

        <div className="flex flex-col items-start gap-2">
          <label className="text-red-950 font-bold font-christmas sm:text-xl text-md">
            Het begin
          </label>
          <p className="text-gray-600 sm:text-sm text-xs">
            We houden allemaal van de kerstman. Als kinderen zaten we allemaal met een stukje papier en schreven minstens één keer onze
            wensen voor Kerstmis op. Wie zou die heel speciale brief niet willen ontvangen? Maar Lapland is zo ver weg – zal de kerstman
            mijn brief kunnen begrijpen en de tijd vinden om te antwoorden?
          </p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <label className="text-red-950 font-bold font-christmas sm:text-xl text-md">
            Eén droom
          </label>
          <p className="text-gray-600 sm:text-sm text-xs">
            Vroeger kon je niet eens dromen van het vinden van de kerstman op het internet, maar we droomden er allemaal van dat de 
            kerstman op een dag terug zou schrijven.
            <br /><br />
            In plaats van alleen te dromen, besloten we de kerstman te helpen met zijn drukke schema door een officiële tak van zijn 
            kantoor te creëren om ieders geloof in de kerstmagie te herstellen. Dus pakken we zorgvuldig elke individuele brief in, 
            stempelen en controleren hem. We hebben de kerstman ook overgehaald om een nieuwe technologie te omarmen – video – en 
            rechtstreeks vanuit Lapland te streamen. Ons elfenteam heeft de kerstman een goede training gegeven, zodat je vandaag, 
            waar je ook bent, dat aller speciaalste kerstmoment niet zult missen.
          </p>
        </div>

      </div>
    </div>
  );
}

export default About;
