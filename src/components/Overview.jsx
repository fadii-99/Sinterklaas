import React, { useContext, useEffect , useState } from "react";
import { BasicContext } from "../context/BasicContext";

function Overview({ onNext }) {
  const { selectedVideo, videoFormData, personalizationFormData, giftFormData } = useContext(BasicContext);
  const [purchaseLoader, setPurchaseLoader] = useState(false); // Loader state


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
    if (!items || items.length === 0) return null; // Return nothing if items are empty
  
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
  


 

        const purchaseNow = async () => {
        setPurchaseLoader(true); 
        const formData = new FormData();
        formData.append('user_email', personalizationFormData.email);
        formData.append('send_date', personalizationFormData.dateTime);
        formData.append('amount', videoFormData.product.value);
        formData.append('video_name',  selectedVideo.title);
        formData.append('name', personalizationFormData.childName);
        formData.append('age', personalizationFormData.childAge);
        formData.append('hobby', personalizationFormData.childHobby);
        formData.append('school_name', personalizationFormData.schoolName);
        formData.append('teacher_name', personalizationFormData.teacherName);
        formData.append('favourite_subject', personalizationFormData.subjectActivity);
        formData.append('friends_names', personalizationFormData.familyNames);
        formData.append('family_names', personalizationFormData.friendNames);
        personalizationFormData.images.forEach((image) => formData.append('files', image));
        formData.append('receiver_phone', JSON.stringify(giftFormData.emails));
        formData.append('receiver_email', JSON.stringify(giftFormData.phoneNumbers));

            try {
            const response = await fetch('http://134.122.63.191:9000/purchase-video', {
                method: 'POST',
                body: formData,
            });
        
        
            const data = await response.json();
            console.log('Purchase Response:', data);
            if (response.ok)
            {
                window.location.href = data.checkout_url;
            }
            } catch (error) {
            console.error('Error during purchase:', error);
            }
            finally {
            setPurchaseLoader(false); // Stop loader
            }
        };



  return (
    <div className="w-full flex flex-col gap-4 px-6 pb-6 ">
      <h1 className="sm:text-5xl text-4xl text-center font-light font-christmas text-red-950">
        Overzicht
      </h1>
      <div className="flex flex-col gap-4 bg-gray-50 rounded-md p-6">
        {renderListItem("Video Title", videoFormData?.videoTitle)}
        {renderListItem("Product Kind", videoFormData?.product?.kind)}
        {renderListItem("Product Value", `€${videoFormData?.product?.value}`)}
        {renderListItem("Voucher Code", videoFormData?.voucherCode || "None")}
        {renderListItem("Email", personalizationFormData?.email)}
        {renderListItem("Date & Time", personalizationFormData?.dateTime)}
        {renderListItem("Child Name", personalizationFormData?.childName)}
        {renderListItem("Child Age", personalizationFormData?.childAge)}
        {renderListItem("Child Hobby", personalizationFormData?.childHobby)}
        {renderListItem("School Name", personalizationFormData?.schoolName)}
        {renderListItem("Teacher Name", personalizationFormData?.teacherName)}
        {renderListItem("Subject/Activity", personalizationFormData?.subjectActivity)}
        {renderListItem("Family Names", personalizationFormData?.familyNames)}
        {renderListItem("Friend Names", personalizationFormData?.friendNames)}
        {renderArrayItems("Images", personalizationFormData?.images.map((file) => file.name))}
        {renderArrayItems("Phone Numbers", giftFormData?.phoneNumbers)}
        {renderArrayItems("Emails", giftFormData?.emails)}
      </div>

     

       <button
        onClick={purchaseNow}
        className={`w-full h-[2.8rem] bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md
          text-red-950 font-black text-xs transform transition-transform duration-300 hover:scale-[103%] 
          ${purchaseLoader ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={purchaseLoader}
      >
        {purchaseLoader ? (
          <span className="flex items-center gap-2">
            <span className="loader animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-red-950"></span>
            Processing...
          </span>
        ) : (
          "Proceed to pay"
        )}
      </button>
    </div>
  );
}

export default Overview;
