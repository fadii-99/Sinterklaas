import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileImage, faSpinner, faPhone , faPlay} from '@fortawesome/free-solid-svg-icons'; // Added faPhone icon




function FormModel({ data, onClose }) {
  const [mpegFile, setMpegFile] = useState(null); // State to store the MPEG file
  const [email, setEmail] = useState('');


  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [time, setTime] = useState('12:00'); // Default time
  const [dateTime, setDateTime] = useState(''); // Combined date and time string

  const [images, setImages] = useState([]); // Array to store selected image files
  const [loading, setLoading] = useState(false); // Loading state to control the loader
  const [prompt, setPrompt] = useState(`Ho ho ho! Well, my dear friends, the time of joy and surprises is here again! I bring gifts, laughter, and a sprinkle of magic for all – young and old alike. Let us fill this season with kindness, warm hearts, and plenty of fun! Zwarte Piet and I have been busy all year, preparing sweets and presents just for you. So, be good, keep those smiles wide, and remember – the best gift is always the joy we share together. Now, let's make this holiday one to remember! Ho ho ho, happy Sinterklaas to all!`); // State for the prompt input
  const [promptError, setPromptError] = useState(false); // State for prompt error
  const [showPhoneInput, setShowPhoneInput] = useState(false); // State to control phone input visibility
  const [phoneNumber, setPhoneNumber] = useState(''); // State to store the current phone number input
  const [phoneNumbers, setPhoneNumbers] = useState([]); // State to store all added phone numbers
  const [filePath, setFilePath] = useState('static/generated_audios/b6cbfc78-90eb-4aa6-9147-fb2398723639.mp3');
  const [validationError, setValidationError] = useState(false);
  const [purchaseLoader, setPurchaseLoader] = useState(false); // State to control purchase button loader

  const [childName, setChildName] = useState('');
const [childAge, setChildAge] = useState('');
const [childHobby, setChildHobby] = useState('');


// ........
const [errors, setErrors] = useState({
  email: false,
  childName: false,
  childAge: false,
  childHobby: false,
  images: false,
  phoneNumbers: false,
  dateTime: false,
});



  // Set the phone number limit based on data.kind
  let phoneLimit = 0;
  if (data.kind === 'Voor 1 Kind' || data.kind === 'Voor volwassenen') {
    phoneLimit = 1;
  } else if (data.kind === 'Voor broers en zussen (max 4)') {
    phoneLimit = 4;
  }

  // Dummy function to simulate backend call and set example MPEG file
  const generateVoice = async () => {
    if (prompt.trim() === '') {
      setPromptError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://996a-182-183-41-236.ngrok-free.app/generate-voice/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to initiate voice generation');

      const data = await response.json();
      const taskId = data.task_id;

      const pollInterval = 4000;
      const pollTask = new Promise((resolve, reject) => {
        const interval = setInterval(async () => {
          try {
            const statusResponse = await fetch(
              'https://996a-182-183-41-236.ngrok-free.app/task-status/',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ task_id: taskId }),
              }
            );

            const statusData = await statusResponse.json();
            console.log(`Task Status: ${statusData}`);
            setFilePath(statusData.file_path)
            if (statusResponse.ok) {
              const contentType = statusResponse.headers.get('content-type');
              if (contentType && contentType.includes('audio/mpeg')) {
                const blob = await statusResponse.blob();
                const url = URL.createObjectURL(blob);
                setMpegFile(url);
                clearInterval(interval);
                resolve();
              } else {
                const statusData = await statusResponse.json();
                console.log(`Task Status: ${statusData.status}`);
              }
            }
          } catch (error) {
            console.error('Error polling task status:', error);
            clearInterval(interval);
            reject(error);
          }
        }, pollInterval);
      });

      await pollTask;
    } catch (error) {
      console.error('Error generating voice:', error);
      alert('Error generating voice. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
// ...................................................
  // Email Handler
const handleEmailChange = (e) => {
  setEmail(e.target.value);
  setErrors((prev) => ({ ...prev, email: false })); // Clear email error
};

// Child Name Handler
const handleChildNameChange = (e) => {
  setChildName(e.target.value);
  setErrors((prev) => ({ ...prev, childName: false })); // Clear child name error
};

// Child Age Handler
const handleChildAgeChange = (e) => {
  setChildAge(e.target.value);
  setErrors((prev) => ({ ...prev, childAge: false })); // Clear child age error
};

// Child Hobby Handler
const handleChildHobbyChange = (e) => {
  setChildHobby(e.target.value);
  setErrors((prev) => ({ ...prev, childHobby: false })); // Clear child hobby error
};

// Image Selection Handler
const handleImageChange = (event) => {
  const selectedFiles = Array.from(event.target.files);
  if (images.length + selectedFiles.length > 3) return;
  setImages((prevImages) => [...prevImages, ...selectedFiles]);
  setErrors((prev) => ({ ...prev, images: false })); // Clear image error
};

// Phone Number Input Change Handler
const handlePhoneNumberChange = (e) => {
  setPhoneNumber(e.target.value);
  setErrors((prev) => ({ ...prev, phoneNumbers: false })); // Clear phone number error
};

// Add Phone Number Handler
const handlePhoneNumberSubmit = () => {
  if (phoneNumber.trim() && phoneNumbers.length < phoneLimit) {
    setPhoneNumbers([...phoneNumbers, phoneNumber]); // Add the current phone number to the list
    setPhoneNumber(''); // Clear the input field
    setShowPhoneInput(false); // Hide the input field
    setErrors((prev) => ({ ...prev, phoneNumbers: false })); // Clear phone number error
  }
};

// Date Change Handler
const handleDateChange = (e) => {
  const selectedDate = e.target.value;
  setDate(selectedDate);
  setDateTime(`${selectedDate}T${time}`); // Combine date and time into one string
  setErrors((prev) => ({ ...prev, dateTime: false })); // Clear date/time error
};

// Time Change Handler
const handleTimeChange = (e) => {
  const selectedTime = e.target.value;
  setTime(selectedTime);
  setDateTime(`${date}T${selectedTime}`); // Update the dateTime state
  setErrors((prev) => ({ ...prev, dateTime: false })); // Clear date/time error
};

// Add Phone Number Button Handler
const handleAddNumberClick = () => {
  if (phoneNumbers.length < phoneLimit) {
    setShowPhoneInput(true); // Show input field if limit not reached
  }
};

// ..................................

  const validateForm = () => {
    const newErrors = {
      email: !email.trim(),
      childName: !childName.trim(),
      childAge: !childAge.trim(),
      childHobby: !childHobby.trim(),
      images: images.length === 0,
      phoneNumbers: phoneNumbers.length === 0,
      dateTime: !dateTime,
    };
  
    setErrors(newErrors);
  
    // Check if any errors exist
    return !Object.values(newErrors).includes(true);
  };
  

  

const purchaseNow = async () => {
  if (!validateForm()) return;
  setPurchaseLoader(true); 
  const formData = new FormData();
  // formData.append('voice_path', filePath);
  formData.append('user_email', email);
  formData.append('send_date', dateTime);
  formData.append('amount', data.value);
  formData.append('video_name', data.title);
  formData.append('name', childName);
  formData.append('age', childAge);
  formData.append('hobby', childHobby);



  images.forEach((image) => formData.append('files', image));
  formData.append('receiver_phone', JSON.stringify(phoneNumbers));
    try {
      const response = await fetch('http://134.122.63.191:3000/purchase-video', {
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


  const generateTimeSlots = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      times.push(`${String(hour).padStart(2, '0')}:00`);
      times.push(`${String(hour).padStart(2, '0')}:30`);
    }
    return times;
  };

  
 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 px-8">
      <div className="bg-white shadow-lg relative w-full md:max-w-2xl max-w-xl max-h-[90vh] rounded-lg p-6 flex flex-col 
      items-end gap-6 overflow-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <div className="w-[3rem] h-[3rem] bg-gray-950 bg-opacity-0 hover:bg-opacity-10 transition duration-300 ease-in-out 
          flex items-center justify-center rounded-full relative z-10">
          <FontAwesomeIcon onClick={onClose} icon={faTimes} className="text-gray-500 text-xl font-bold" />
        </div>
        
        <div className='w-full flex flex-col gap-14'>
          <div className='flex flex-row items-center justify-between w-full gap-3'>
              <h1 className="sm:text-5xl text-4xl font-light font-christmas text-red-950">{data.title}</h1>
              <p className="sm:text-3xl text-2xl font-semibold text-green-500">${data.value}</p>
          </div>

          {/* Textarea for prompt */}
          {/* <div className='flex flex-col items-start gap-2'>
            <textarea 
              rows="7" 
              placeholder='Enter prompt here....'
              value={prompt}                      // Bind the value to the state
              onChange={(e) => { 
                setPrompt(e.target.value);         // Update the prompt value
                setPromptError(false);             // Reset the error when user starts typing
              }}
              className={`p-3 border ${promptError ? 'border-red-500' : 'border-gray-300'} rounded-md w-full focus:outline-none sm:text-sm text-xs`}
            >
            </textarea>

            <div className='flex flex-row items-center gap-2 w-full'>
              <button 
                onClick={generateVoice} // Call the generateVoice function
                className='w-[8rem] h-[2.8rem] bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md
                text-red-950 font-black sm:text-sm text-xs transform transition-transform duration-300 hover:scale-[103%]'
                disabled={loading} // Disable button while loading
              >
                {loading ? (
                  <FontAwesomeIcon icon={faSpinner} spin className="text-red-950 sm:text-sm text-xs" /> // Show loader
                ) : (
                  'Generate'
                )}
              </button>
              {mpegFile && (
                <audio 
                    controls 
                    className="w-full h-[2.8rem]"
                    controlsList="nodownload"
                >
                    <source src={mpegFile} type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div> */}

          {/* Personalization options */}
          <div className='flex flex-col w-full'>
           
              {/* Child Name and Age and Hobby */}
              <div className='flex md:flex-row flex-col gap-6 md:py-10 py-6 w-full'>
                  <div className='flex flex-col items-start gap-2 w-full'>
                    <label className="text-gray-700 font-semibold sm:text-sm text-xs">Enter Child Name</label>
                    <input
                        type="text"
                        placeholder="Child Name"
                        value={childName}
                        onChange={handleChildNameChange}
                        className={`p-3 border rounded-md w-full focus:outline-none sm:text-sm text-xs ${
                          errors.childName ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                  </div>

                  <div className='flex flex-col items-start gap-2 w-full'>
                    <label className="text-gray-700 font-semibold sm:text-sm text-xs">Enter Child Age</label>
                    <input
                        type="number"
                        min="0"
                        placeholder="Child Age"
                        value={childAge}
                        onChange={handleChildAgeChange}
                        className={`p-3 border rounded-md w-full focus:outline-none sm:text-sm text-xs ${
                          errors.childAge ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />

                  </div>

                  <div className='flex flex-col items-start gap-2 w-full'>
                    <label className="text-gray-700 font-semibold sm:text-sm text-xs">Enter Child Hobby</label>
                    <input
                        type="text"
                        placeholder="Child Hobby"
                        value={childHobby}
                        onChange={handleChildHobbyChange}
                        className={`p-3 border rounded-md w-full focus:outline-none sm:text-sm text-xs ${
                          errors.childHobby ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                  </div>
                </div>




              <div className='flex md:flex-row flex-col items-center gap-6 w-full md:border-t md:py-10 pb-6'>
              {/* Email and date */}
                 <div className='flex flex-col items-start gap-2 w-full'>
                    <label className="text-gray-700 font-semibold sm:text-sm text-xs">Enter Your Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`p-3 border rounded-md w-full focus:outline-none sm:text-sm text-xs ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                 </div>
                 <div className="flex md:flex-row flex-col gap-6 md:py-0 md:pb-0 pb-6 w-full">
                  {/* Date Input */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="text-gray-700 font-semibold sm:text-sm text-xs">Enter Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        className={`p-3 border rounded-md w-full focus:outline-none sm:text-sm text-xs ${
                          errors.dateTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                  </div>

                  {/* Time Slot Dropdown */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="text-gray-700 font-semibold sm:text-sm text-xs">Select Time</label>
                    <select
                        value={time}
                        onChange={handleTimeChange}
                        className={`p-3 border rounded-md w-full focus:outline-none sm:text-sm text-xs ${
                          errors.dateTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        {generateTimeSlots().map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                  </div>
                </div>
            </div>
            
            {/* Image / Media Upload */}
            <div className="flex flex-col md:gap-2 gap-1 md:border-t md:border-b md:py-10">
              <label className="text-gray-700 font-semibold sm:text-sm text-xs">Upload Images / Media Files</label>
              <div className="flex items-center gap-2">
              <input
  type="file"
  accept="image/*,video/mp4"
  multiple
  onChange={handleImageChange}
  className={`hidden ${images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
  id="media-upload"
/>
              </div>
              <div className='flex flex-col gap-6 items-start w-full'>
              <label
  htmlFor="media-upload"
  className={`px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md
    text-red-950 font-black sm:text-sm text-xs cursor-pointer border-2 ${
      errors.images ? 'border-red-500' : 'border-yellow-400'
    } ${images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  <FontAwesomeIcon icon={faFileImage} className="mr-2" /> Choose Images / Media File
</label>

                {/* Display selected files */}
                <div className="flex flex-row gap-2 flex-wrap">
                  {images.map((file, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 bg-gray-100 rounded-md p-2">
                      {file.type.startsWith('image/') ? (
                        <FontAwesomeIcon icon={faFileImage} className="text-gray-600" />
                      ) : (
                        <FontAwesomeIcon icon={faPlay} className="text-gray-600" />
                      )}
                      <span className="text-gray-700 text-xs">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>



            {/* Add Number Button */}
            <div className="flex flex-col md:gap-4 gap-2 md:py-10 py-6">
              <label className="text-gray-700 font-semibold sm:text-sm text-xs">Add Phone Number</label>
              <div className="flex flex-col items-start gap-6 w-full">
                 <div className='flex flex-row items-center gap-2 w-full'>
                 <button
  onClick={handleAddNumberClick}
  disabled={phoneNumbers.length >= phoneLimit}
  className={`px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md text-nowrap
    text-red-950 font-black sm:text-sm text-xs cursor-pointer border-2 ${
      errors.phoneNumbers ? 'border-red-500' : 'border-yellow-400'
    } ${phoneNumbers.length >= phoneLimit ? 'opacity-50 cursor-not-allowed' : ''}`}
>
  <FontAwesomeIcon icon={faPhone} className="mr-2" /> Add Number
</button>

                      {/* Show the input field and Enter Now button when Add Number is clicked */}
                      {showPhoneInput && phoneNumbers.length < phoneLimit && (
  <div className="flex flex-row gap-2 items-center w-full">
    <input
      type="tel"
      placeholder="Enter phone number"
      value={phoneNumber}
      onChange={handlePhoneNumberChange}
      className={`p-3 border rounded-md w-full focus:outline-none sm:text-sm text-xs ${
        errors.phoneNumbers ? 'border-red-500' : 'border-gray-300'
      }`}
    />
    <button
      onClick={handlePhoneNumberSubmit}
      className="px-4 py-3 bg-gradient-to-r from-gray-900 to-black flex items-center justify-center rounded-md
      text-white font-semibold sm:text-sm text-xs cursor-pointer text-nowrap"
    >
      Enter Now
    </button>
  </div>
)}
                 </div>
                {/* Display all added phone numbers */}
                {phoneNumbers.length > 0 && (
                  <div className="flex flex-row gap-2 items-start">
                    {phoneNumbers.map((number, index) => (
                      <div key={index} className="flex flex-col gap-3 items-center bg-gray-100 rounded-md p-2">
                        <FontAwesomeIcon icon={faPhone} className="text-gray-600 sm:text-sm text-xs" />
                        <span className="text-gray-700 text-xs">{number}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {validationError && (
                <p className="text-red-500 sm:text-sm text-xs text-center mb-2">Please fill all fields before proceeding.</p>
              )}
          <button 
              onClick={purchaseNow}
              disabled={purchaseLoader} // Disable button while loading
              className={`w-full h-[2.8rem] bg-gradient-to-r from-gray-900 to-black flex items-center justify-center rounded-md
                text-white font-bold sm:text-sm text-xs transform transition-transform duration-300 hover:scale-[103%] 
                ${purchaseLoader ? 'opacity-50 cursor-not-allowed' : ''}`} // Style when loading
            >
              {purchaseLoader ? (
                <FontAwesomeIcon icon={faSpinner} spin className="text-white sm:text-sm text-xs" /> // Show loader
              ) : (
                'Purchase now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FormModel;
