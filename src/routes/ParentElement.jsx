import { Outlet, useLocation } from "react-router-dom";
import Navbar from './../components/Navbar';
import React, { useContext, useEffect } from "react";
import { BasicContext } from '../context/BasicContext';
import FormModel from "../components/FormModel";
import Footer from "../components/Footer";

function ParentElement() {
  const options = useContext(BasicContext);
  const location = useLocation();

  // Scroll to top with smooth behavior whenever the URL changes
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
      {options.showFormModel && <FormModel data={options.purchaseData} onClose={() => options.setShowFormModel(false)} />}
    </>
  );
}

export default ParentElement;
