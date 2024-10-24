function TermOfService() {
        return (
            <div className="flex flex-col items-center gap-12 p-12 mt-24">
                <h1 className="md:text-5xl sm:text-4xl text-3xl text-red-950 font-black text-start uppercase">
                    Algemene Voorwaarden
                </h1>
                <div className="flex flex-col items-start gap-12">
                    {/* Wat Wordt Gedekt in Deze Voorwaarden */}
                    <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                        Wat Wordt Gedekt in Deze Voorwaarden
                    </h1>
                    <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                        Deze Algemene Voorwaarden beschrijven wat je van ons kunt verwachten wanneer je ons platform gebruikt om gepersonaliseerde video's aan te schaffen en gerelateerde diensten te gebruiken, en wat wij van jou als gebruiker verwachten. Ze beschrijven ook de rechten en plichten van beide partijen.
                    </p>
    
                    {/* Beschrijving van de Dienst */}
                    <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                        Beschrijving van de Dienst
                    </h1>
                    <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                        Ons platform stelt je in staat om gepersonaliseerde vooraf opgenomen video's aan te schaffen, die op specifieke data kunnen worden gepland voor levering. Video's kunnen worden gedownload via onze Video Downloader-tool of rechtstreeks via WhatsApp worden geleverd.
                    </p>
    
                    <ul className="flex flex-col items-start gap-2">
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Video Planning*:</span> Je kunt gepersonaliseerde video's plannen voor toekomstige levering via WhatsApp of ze op je gemak downloaden.
                        </li>
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Verificatiecodes*:</span> Na aankoop ontvang je verificatiecodes om veilig toegang te krijgen tot je video-downloads.
                        </li>
                    </ul>
    
                    {/* Betalings- en Restitutiebeleid */}
                    <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                        Betalings- en Restitutiebeleid
                    </h1>
                    <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                        Wij gebruiken de Mollie Payment API om betalingen veilig te verwerken, inclusief populaire betaalmethoden zoals iDeal.
                    </p>
    
                    <ul className="flex flex-col items-start gap-2">
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Betalingsbevestiging*:</span> Na het voltooien van een betaling ontvang je een bevestigingsmail met het ordernummer en de verificatiecode voor toegang tot de video.
                        </li>
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Geen Teruggaven voor Geleverde Video's*:</span> Zodra een gepersonaliseerde video is geleverd, kan deze niet worden geretourneerd. Zorg ervoor dat alle gegevens correct zijn voordat je de bestelling bevestigt.
                        </li>
                    </ul>
    
                    {/* WhatsApp-integratie */}
                    <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                        WhatsApp-integratie
                    </h1>
                    <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                        Onze diensten maken gebruik van de WhatsApp Business API voor veilige communicatie en videolevering.
                    </p>
    
                    <ul className="flex flex-col items-start gap-2">
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Verificatie via WhatsApp*:</span> Bij het afrekenen ontvang je een verificatiecode om je identiteit te bevestigen. Deze code is vereist om toegang te krijgen tot video's.
                        </li>
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Videolevering via WhatsApp*:</span> Alle gekochte video's worden verzonden naar het WhatsApp-nummer dat je tijdens het afrekenen hebt opgegeven. Zorg ervoor dat het nummer correct is.
                        </li>
                    </ul>
    
                    {/* Videolevering en Planning */}
                    <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                        Videolevering en Planning
                    </h1>
                    <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                        Gebruikers kunnen de levering van gepersonaliseerde video's plannen op specifieke data.
                    </p>
    
                    <ul className="flex flex-col items-start gap-2">
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Geplande Levering*:</span> Video's worden automatisch naar je WhatsApp verzonden op de geplande datum. In geval van mislukte levering kun je de video ophalen via de Video Downloader-tool.
                        </li>
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Herinneringsmeldingen*:</span> Je ontvangt herinneringen via e-mail en WhatsApp om je te informeren over aankomende geplande videoleveringen.
                        </li>
                    </ul>
    
                    {/* Verantwoordelijkheden van de Gebruiker */}
                    <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                        Verantwoordelijkheden van de Gebruiker
                    </h1>
                    <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                        Als gebruiker ben je verantwoordelijk voor de nauwkeurigheid van de informatie die je verstrekt en voor de beveiliging van je verificatiecodes.
                    </p>
    
                    <ul className="flex flex-col items-start gap-2">
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Nauwkeurigheid van Informatie*:</span> Zorg ervoor dat alle gegevens die je tijdens het afrekenen verstrekt, inclusief je WhatsApp-nummer, correct zijn. Onjuiste gegevens kunnen leiden tot mislukte levering.
                        </li>
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Beveiliging van Verificatiecodes*:</span> Houd je verificatiecodes veilig. Als je vermoedt dat iemand ongeautoriseerde toegang tot je codes heeft, neem dan onmiddellijk contact op met de klantenservice.
                        </li>
                    </ul>
    
                    {/* Privacy en Gegevensbescherming */}
                    <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                        Privacy en Gegevensbescherming
                    </h1>
                    <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                        Wij zetten ons in voor het beschermen van je privacy. Lees ons Privacybeleid om te begrijpen hoe we je persoonlijke informatie verzamelen, gebruiken en beschermen.
                    </p>
    
                    {/* Wijzigingen in de Voorwaarden */}
                    <h1 className="md:text-2xl sm:text-xl text-xl text-red-950 font-black text-start uppercase">
                        Wijzigingen in Deze Voorwaarden
                    </h1>
                    <p className="md:text-md text-sm font-medium text-gray-600 text-start">
                        Wij behouden ons het recht voor om deze voorwaarden van tijd tot tijd bij te werken. Eventuele belangrijke wijzigingen worden gecommuniceerd via e-mail of via een melding op ons platform. Door onze diensten te blijven gebruiken, ga je akkoord met de bijgewerkte voorwaarden.
                    </p>
    
                    <ul className="flex flex-col items-start gap-2">
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Ingangsdatum*:</span> [1/9/2024]
                        </li>
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Laatst Bijgewerkt*:</span> [1/9/2024]
                        </li>
                        <li className="md:text-md text-sm font-medium text-red-950">
                            <span className="font-bold">*Contactinformatie*:</span> Voor vragen over deze Algemene Voorwaarden kun je contact met ons opnemen via [support@example.com].
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
    
    export default TermOfService;
    