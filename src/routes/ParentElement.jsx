import { Outlet, useLocation } from "react-router-dom";
import Navbar from './../components/Navbar';
import React, { useContext, useEffect, useState } from "react";
import { BasicContext } from '../context/BasicContext';
import FormModel from "../components/FormModel";
import Footer from "../components/Footer";
import ComingSoonModel from "../components/ComingSoonModel";

function ParentElement() {
  const options = useContext(BasicContext);
  const location = useLocation();


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }, [location]);

  return (
    <>
      <Navbar />
      <div className="">
        <Outlet />
      </div>
      <Footer />
      
      {/* Conditionally render FormModel */}
      {options.showFormModel && (
        <FormModel 
          data={options.purchaseData} 
          onClose={() => options.setShowFormModel(false)} 
        />
      )}

      {/* ComingSoonModel Component */}
      <ComingSoonModel 
         isOpen={options.comingSoonModel} 
         onClose={() => options.setComingSoonModel(false)} 
      />
    </>
  );
}

export default ParentElement;
