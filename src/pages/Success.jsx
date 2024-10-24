import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React Router for navigation
import { FaMoneyBill } from 'react-icons/fa';

function Success() {
  const navigate = useNavigate(); // React Router's navigation hook


  
  // Redirect after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/'); // Redirect to home page
    }, 2000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, [navigate]);



  return (
    <div className="flex flex-col items-center justify-center min-h-screen relative sm:pb-12">
      <div className="flex flex-col items-center gap-6">
        <FaMoneyBill size={80} className="text-red-950" />
        <h1 className="text-red-950 w-full text-center font-christmas md:text-[4rem] sm:text-4xl text-3xl">
          Payment Successfully ...
        </h1>
      </div>
    </div>
  );
}

export default Success;
