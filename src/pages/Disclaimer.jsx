import React from "react";



function Disclaimer() {
    return (
        <div className="flex flex-col items-center gap-12 p-12 mt-24">
            <h1 className="md:text-5xl sm:text-4xl text-3xl text-red-950 font-black text-start uppercase">
                Disclaimer
            </h1>
            <div className="flex flex-col items-start gap-12">
                
                {/* Introduction */}
                <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                    *Inleiding*
                </h1>
                <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                    Deze disclaimer ("Disclaimer") beschrijft de voorwaarden die van toepassing zijn op het gebruik van ons platform en de bijbehorende diensten ("Platform"). Door toegang te krijgen tot of gebruik te maken van het Platform, ga je akkoord met de voorwaarden van deze Disclaimer. Als je niet akkoord gaat met deze voorwaarden, verzoeken wij je het Platform niet te gebruiken.
                </p>

                {/* Limitations of Liability */}
                <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase pt-16">
                    1. Beperkingen van Aansprakelijkheid
                </h1>
                <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                    We zijn niet verantwoordelijk voor enige directe, indirecte, incidentele, speciale of gevolgschade die voortvloeit uit het gebruik van of het onvermogen om het Platform te gebruiken. Alle informatie en diensten die via het Platform worden aangeboden, worden geleverd "zoals ze zijn", zonder enige garantie, expliciet of impliciet.
                </p>

                {/* No Professional Advice */}
                <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase pt-16">
                    2. Geen Professioneel Advies
                </h1>
                <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                    De inhoud op het Platform is uitsluitend bedoeld voor algemene informatieve doeleinden en vormt geen professioneel advies. Raadpleeg een gekwalificeerde professional voor specifiek advies dat is afgestemd op jouw situatie.
                </p>

                {/* Third-Party Links */}
                <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase pt-16">
                    3. Links naar Derden
                </h1>
                <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                    Ons Platform kan links bevatten naar websites van derden. Wij hebben geen controle over en zijn niet verantwoordelijk voor de inhoud, privacybeleid of praktijken van deze externe sites. Het opnemen van een link impliceert geen goedkeuring door ons.
                </p>

                {/* Changes to Disclaimer */}
                <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase pt-16">
                    4. Wijzigingen in deze Disclaimer
                </h1>
                <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                    We behouden ons het recht voor om deze Disclaimer op elk moment bij te werken. Alle wijzigingen worden op deze pagina geplaatst, en de datum "Laatst Bijgewerkt" zal worden bijgewerkt. Het verdere gebruik van het Platform na wijzigingen betekent dat je akkoord gaat met de herziene Disclaimer.
                </p>

                {/* Contact Us */}
                <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase pt-16">
                    5. Neem Contact met Ons Op
                </h1>
                <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                    Als je vragen of opmerkingen hebt over deze disclaimer, neem dan contact met ons op:
                    <br /><br />
                    Sinterklaas
                    <br /><br /> Contact@sinterklaas.com
                    <br /><br /><span className="font-bold">Ingangsdatum:</span> 1/9/2024
                    <br /><br /><span className="font-bold">Laatst Bijgewerkt:</span> 1/9/2024
                </p>
            </div>
        </div>
    );
}

export default Disclaimer;
