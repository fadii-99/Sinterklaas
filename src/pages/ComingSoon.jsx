import { useState, useEffect } from 'react';
import avatar from './../assets/sinterklaas.png';
import bgImage from './../assets/backgroundImage.png';
import logo from './../assets/sinterklaasLogo.png';

function ComingSoon() {
    const [timeLeft, setTimeLeft] = useState({
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
    });

    const [email, setEmail] = useState('');
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);


    
    useEffect(() => {
        const targetDate = new Date('2024-11-16T11:00:00Z').getTime();
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            const days = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
            const hours = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
            const minutes = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
            const seconds = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');

            setTimeLeft({ days, hours, minutes, seconds });

            if (difference < 0) {
                clearInterval(timer);
                setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00' });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (email.trim() === '') {
            setIsError(true);
            return;
        }

        setIsError(false);
        setIsLoading(true);

        try {
            const response = await fetch('api/earlyaccess/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            setEmail('');
            setIsSuccess(true);
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }

        setTimeout(() => {
            setIsSuccess(false);
        }, 2000);
    };


    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen relative sm:pb-12"
            style={{
                backgroundImage: `
                    linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), 
                    radial-gradient(circle, rgba(0, 0, 0, 0) 10%, rgba(0, 0, 0, 0.5) 100%), 
                    url(${bgImage})
                `,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className='absolute top-6 left-6'>
                <img src={logo} alt="sinterklaas-logo" className='md:h-20 sm:h-14 h-10 w-auto' />
            </div>
            <div className='absolute bottom-0 right-0'>
                <img src={avatar} alt="" className='2xl:w-[28rem] xl:w-[22rem] lg:w-[18rem] h-auto lg:block hidden' />
            </div>
            <div className="max-w-lg flex flex-col items-center gap-12 sm:px-0 px-8 ">
                <h1 style={{ textShadow: '2px 4px 3px rgba(0, 0, 0, 0.5)' }}
                    className="text-white w-full text-center font-christmas md:text-[4rem] text-5xl">
                    Sinterklaas is weer bijna in het land!
                </h1>
                <div className="flex items-center md:justify-between justify-center md:gap-0 sm:gap-12 gap-6 w-full">
                    {['dagen', 'uren', 'minuten', 'seconden'].map((unit, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                            <label className="text-white p-3 border-2 border-white 
                            md:w-24 sm:w-20 w-16 text-center md:text-6xl sm:text-4xl text-3xl bg-red-700 flex items-center justify-center ">
                                {timeLeft[Object.keys(timeLeft)[index]]}
                            </label>
                            <p className="text-white w-full text-center sm:text-sm text-xs font-black">
                                {unit.toUpperCase()}
                            </p>
                        </div>
                    ))}
                </div>
                <p style={{ textShadow: '2px 2px 2px rgba(0, 0, 0, 0.5)' }}
                    className="text-white w-full text-center font-medium sm:text-sm text-xs sm:leading-6 leading-5">
                    Creëer echte SintMagie met <span className='font-black'>gepersonaliseerde</span> video's van 
                    <span className='font-black'> Sinterklaas</span>. Laat de Goedheiligman jouw gezin persoonlijk toespreken en geef jouw kind een 
                    <span className='font-black'> onvergetelijke ervaring!</span> 
                </p>
                <div className='w-full flex flex-col items-center gap-6'>
                    <button
                        className='w-full py-3 md:text-lg sm:text-md text-sm font-medium focus:outline-none 
                        flex items-center justify-center bg-red-700 text-white px-2'
                    >
                        🎁 <span className='sm:mx-4 mx-2'>Early Bird: Ontvang direct 10% Pietenkorting</span> 🎁
                    </button>
                    <form className="flex flex-row items-center w-full" onSubmit={handleSubmit}>
                        <input
                            className={`shadow-md border-2 px-4 py-3 w-full sm:text-sm text-xs focus:outline-none placeholder:text-gray-600 
                            ${isError ? 'border-red-600' : ''}`}
                            type="email"
                            placeholder="Vul je e-mailadres in"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            className={`py-3 border-2 border-red-700 sm:text-sm text-xs font-medium focus:outline-none w-[10rem] flex items-center justify-center
                                ${isLoading ? 'bg-red-700 text-white' : isSuccess ? 'bg-green-600 text-white' : 'bg-red-700 text-white'}
                                ${isLoading ? 'cursor-not-allowed' : ''} text-nowrap px-2 hover:bg-red-800`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Even geduld aub...' : isSuccess ? 'Verzonden' : 'Ontvang je korting!'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ComingSoon;
