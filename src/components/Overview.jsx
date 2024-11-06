import React, { useContext, useEffect, useState } from "react";
import { BasicContext } from "../context/BasicContext";

function Overview({ onBack }) {
  const { selectedVideo, videoFormData, personalizationFormData, giftFormData } = useContext(BasicContext);
  const [purchaseLoader, setPurchaseLoader] = useState(false);
  const [otp, setOtp] = useState();
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false); 
  const [isOtpVisible, setIsOtpVisible] = useState(false); 
  const [payNowDisabled, setPayNowDisabled] = useState(true); 

  useEffect(() => {
    console.log("Selected Video:", selectedVideo);
    console.log("Video Form Data:", videoFormData);
    console.log("Personalization Form Data:", personalizationFormData);
    console.log("Gift Form Data:", giftFormData);
  }, [selectedVideo, videoFormData, personalizationFormData, giftFormData]);

  const renderListItem = (label, value) => (
    <div className="flex justify-between items-center w-full">
      <span className="font-medium text-xs text-gray-500">{label}:</span>
      <span className="text-xs text-red-700 font-semibold">{value}</span>
    </div>
  );

  const renderArrayItems = (label, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="flex flex-col gap-2">
        <h2 className="font-medium text-xs text-gray-500">{label}:</h2>
        {items.map((item, index) => (
          <span key={index} className="ml-4 text-xs text-red-700 font-semibold">
            - {item}
          </span>
        ))}
      </div>
    );
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const confirmOrder = async () => {
    setPurchaseLoader(true);
    const formData = new FormData();
    formData.append('user_email', personalizationFormData.email);

    try {
      const response = await fetch('http://134.122.63.191:9000/send-otp', {
        method: 'POST',
        body: formData, // Send as FormData
      });
      const data = await response.json();
      console.log('Order Confirmation Response:', data);
      if (response.ok) {
        setIsOrderConfirmed(true);
        setIsOtpVisible(true);
      }
    } catch (error) {
      console.error('Error confirming order:', error);
    } finally {
      setPurchaseLoader(false);
    }
  };


  const purchaseNow = async () => {
    setPurchaseLoader(true);
    const formData = new FormData();
    formData.append('user_email', personalizationFormData.email);
    formData.append('otp', otp); // Send OTP along with other data
    formData.append('send_date', personalizationFormData.dateTime);
    formData.append('amount', videoFormData.product.value);
    formData.append('video_name', selectedVideo.title);
    formData.append('name', personalizationFormData.childName);
    formData.append('age', personalizationFormData.childAge);
    formData.append('hobby', personalizationFormData.childHobby);
    formData.append('school_name', personalizationFormData.schoolName);
    formData.append('teacher_name', personalizationFormData.teacherName);
    formData.append('favourite_subject', personalizationFormData.subjectActivity);
    formData.append('friends_names', personalizationFormData.familyNames);
    formData.append('family_names', personalizationFormData.friendNames);
    personalizationFormData.images.forEach((image) => formData.append('files', image));
    formData.append('receiver_phone', JSON.stringify(giftFormData.phoneNumbers));
    formData.append('receiver_email', JSON.stringify(giftFormData.emails));

    try {
      const response = await fetch('http://134.122.63.191:9000/purchase-video', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Purchase Response:', data);
      if (response.ok) {
        window.location.href = data.checkout_url;
      }
    } catch (error) {
      console.error('Error during purchase:', error);
    } finally {
      setPurchaseLoader(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 px-6 pb-6 ">
      <h1 className="sm:text-5xl text-4xl text-center font-light font-christmas text-red-950">
        Overzicht
      </h1>
      <div className="flex flex-col gap-4 bg-gray-50 rounded-md p-6">
        {renderListItem("Videotitel", videoFormData?.videoTitle)}
        {renderListItem("Productsoort", videoFormData?.product?.kind)}
        {renderListItem("Productwaarde", `€${videoFormData?.product?.value}`)}
        {renderListItem("Kortingscode", videoFormData?.voucherCode || "Geen")}
        {renderListItem("Email", personalizationFormData?.email)}
        {renderListItem("Datum & Tijd", personalizationFormData?.dateTime)}
        {renderListItem("Naam Kind", personalizationFormData?.childName)}
        {renderListItem("Leeftijd Kind", personalizationFormData?.childAge)}
        {renderListItem("Hobby Kind", personalizationFormData?.childHobby)}
        {renderListItem("Schoolnaam", personalizationFormData?.schoolName)}
        {renderListItem("Leraarnaam", personalizationFormData?.teacherName)}
        {renderListItem("Vak/Activiteit", personalizationFormData?.subjectActivity)}
        {renderListItem("Familienamen", personalizationFormData?.familyNames)}
        {renderListItem("Vriendennamen", personalizationFormData?.friendNames)}
        {renderArrayItems("Afbeeldingen", personalizationFormData?.images.map((file) => file.name))}
        {renderArrayItems("Telefoonnummers", giftFormData?.phoneNumbers)}
        {renderArrayItems("Emails", giftFormData?.emails)}
      </div>

      {isOtpVisible && (
        <div className="flex flex-col gap-4 bg-gray-50 rounded-md p-6 w-full mt-6">
          <h2 className="font-medium text-lg text-gray-700 mb-2">Bevestig met OTP</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              purchaseNow();
            }}
            className="flex flex-col gap-3"
          >
            <label className="text-gray-700 font-semibold text-xs">Voer OTP in</label>
            <input
              type="number"
              value={otp}
              onChange={handleOtpChange}
              placeholder="OTP"
              className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
            />
          </form>
        </div>
      )}

      <div className="w-full flex flex-row items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="w-full h-[2.8rem] bg-gray-50 flex items-center justify-center rounded-md text-red-950 font-bold text-xs transform transition-transform duration-300 hover:scale-[103%]"
        >
          Terug
        </button>
        <button
          onClick={isOrderConfirmed ? purchaseNow : confirmOrder}
          className={`w-full h-[2.8rem] ${
            isOrderConfirmed ? "bg-gradient-to-r from-yellow-400 to-amber-500" : "bg-gradient-to-r from-yellow-400 to-amber-500"
          } flex items-center justify-center rounded-md text-red-950 font-black text-xs transform transition-transform duration-300 hover:scale-[103%] ${
            purchaseLoader ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={purchaseLoader || (isOrderConfirmed && !otp)}
        >
          {purchaseLoader ? (
            <span className="flex items-center gap-2">
              <span className="loader animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-950"></span>
              Verwerken...
            </span>
          ) : isOrderConfirmed ? (
            "Betalen"
          ) : (
            "Bevestig Bestelling"
          )}
        </button>
      </div>
    </div>
  );
}

export default Overview;
