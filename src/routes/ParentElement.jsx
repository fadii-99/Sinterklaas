import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import React, { useContext, useEffect, useState } from "react";
import { BasicContext } from "../context/BasicContext";
import FormModel from "../components/FormModel";
import Footer from "../components/Footer";
import ComingSoonModel from "../components/ComingSoonModel";
import { FaTimes } from "react-icons/fa";

function ParentElement() {
  const options = useContext(BasicContext);
  const location = useLocation();
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location]);

  // Toon de nieuwsbrief modal bij het laden van het component
  useEffect(() => {
    if (!newsletterSubmitted) {
      setShowNewsletter(true);

      // Stel interval in om elke 5 minuten opnieuw te tonen als niet ingediend
      const intervalId = setInterval(() => {
        if (!newsletterSubmitted) {
          setShowNewsletter(true);
        }
      }, 300000); // 300000 ms = 5 minuten

      return () => clearInterval(intervalId); // Ruim interval op bij het ontmantelen van het component
    }
  }, [newsletterSubmitted]);

  const handleNewsletterSubmit = async () => {
    // Valideer het e-mailveld
    if (!email.trim()) {
      setError("E-mail is verplicht.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append('email', email);

      const response = await fetch("http://134.122.63.191:9000/admin/add-email/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Reactie:", data);

      if (!response.ok) {
        throw new Error(data.error || "Inschrijven mislukt");
      }

      // Inzending gelukt
      setNewsletterSubmitted(true); // Voorkomt dat de modal opnieuw getoond wordt
      setShowNewsletter(false); // Sluit de modal
      setEmail("");
    } catch (error) {
      setError(error.message); // Stel API-foutmelding in
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div>
        <Outlet />
      </div>
      <Footer />

      {/* Voorwaardelijk renderen van FormModel */}
      {options.showFormModel && (
        <FormModel data={options.purchaseData} onClose={() => options.setShowFormModel(false)} />
      )}

      {/* ComingSoonModel Component */}
      <ComingSoonModel isOpen={options.comingSoonModel} onClose={() => options.setComingSoonModel(false)} />

      {/* Nieuwsbrief Modal */}
      {showNewsletter && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button onClick={() => setShowNewsletter(false)} className="absolute top-2 right-2 text-gray-600">
              <FaTimes />
            </button>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Nieuwsbrief</h2>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Voer uw e-mailadres in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`p-3 border rounded-md w-full focus:outline-none md:text-xs text-[9px] ${
                  error ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {error && (
              <p className="text-red-600 text-xs medium mb-4">{error}</p>
            )}
            <button
              onClick={handleNewsletterSubmit}
              className="w-full py-2 px-4 bg-red-950 text-white font-semibold rounded"
              disabled={loading}
            >
              {loading ? "Aan het verzenden..." : "Verzend"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}



export default ParentElement;
