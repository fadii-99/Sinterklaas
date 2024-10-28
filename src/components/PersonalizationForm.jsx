import React, { useState , useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileImage, faSpinner, faPhone , faPlay} from '@fortawesome/free-solid-svg-icons'; // Added faPhone icon
import { BasicContext } from '../context/BasicContext';



function PersonalizationForm({ onClose, onNext }) {
  const {  videoFormData , setPersonalizationFormData } = useContext(BasicContext);
  const [email, setEmail] = useState('');

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // Initialize with today's date
  const [time, setTime] = useState('12:00'); // Default time
  const [dateTime, setDateTime] = useState(''); // Combined date and time string

  const [images, setImages] = useState([]); // Array to store selected image files
  const [loading, setLoading] = useState(false); // Loading state to control the loader
  const [validationError, setValidationError] = useState(false);
  const [purchaseLoader, setPurchaseLoader] = useState(false); // State to control purchase button loader
const [childName, setChildName] = useState('');
const [childAge, setChildAge] = useState('');
const [childHobby, setChildHobby] = useState('');
const [schoolName, setSchoolName] = useState('');
const [teacherName, setTeacherName] = useState('');
const [subjectActivity, setSubjectActivity] = useState('');
const [friendNames,setFriendNames] = useState('');
const [familyNames,setFamilyNames] = useState('');




// const [familyName, setFamilyName] = useState(''); 
// const [familyNames, setFamilyNames] = useState([]);


// const [friendName, setFriendName] = useState(''); 
// const [friendNames, setFriendNames] = useState([]); 

// const [showFamilyInput, setShowFamilyInput]= useState(false);
// const [showFriendInput, setShowFriendInput]= useState(false);

// ........
const [errors, setErrors] = useState({
  email: false,
  childName: false,
  childAge: false,
  childHobby: false,
  images: false,
  phoneNumbers: false,
  dateTime: false,
  schoolName: false,
  teacherName: false,
  subjectActivity: false,
  familyNames: false,
  friendNames: false,
});


// const handleFamilyNameChange = (e) => {
//   setFamilyName(e.target.value);
//   setErrors((prev) => ({ ...prev, familyName: false })); // Clear any error
// };

// // Add family name to the list with validation
// const handleFamilyNameSubmit = () => {
//   if (familyName.trim() && familyNames.length < phoneLimit) { // Ensure valid input and within limit
//     setFamilyNames([...familyNames, familyName]);
//     setFamilyName(''); // Clear input field
//     setShowInput(false); // Hide input field
//   } else {
//     setErrors((prev) => ({
//       ...prev,
//       familyName: 'Please enter a name',
//     }));
//   }
// };




// const handleFriendNameChange = (e) => {
//   setFriendName(e.target.value);
//   setErrors((prev) => ({ ...prev, friendName: false })); // Clear any error
// };

// // Add family name to the list with validation
// const handleFriendNameSubmit = () => {
//   if (friendName.trim() && friendNames.length < phoneLimit) { // Ensure valid input and within limit
//     setFriendNames([...friendNames, friendName]);
//     setFriendName(''); // Clear input field
//     setShowInput(false); // Hide input field
//   } else {
//     setErrors((prev) => ({
//       ...prev,
//       friendName: 'Please enter a name.',
//     }));
//   }
// };




// const handleAddFriendNameClick = () => setShowFriendInput(true);
// const handleAddFamilyNameClick = () => setShowFamilyInput(true);



  // Set the phone number limit based on data.kind
  // let phoneLimit = 0;
  // if (videoFormData?.product.kind === 'Voor 1 Kind' ||videoFormData?.product.kind === 'Voor volwassenen') {
  //   phoneLimit = 1;
  // } else if (videoFormData?.product.kind === 'Voor broers en zussen (max 4)') {
  //   phoneLimit = 4;
  // }

  
// ...................................................
const handleFamilyChange = (e) => {
  setFamilyNames(e.target.value);
  setErrors((prev) => ({ ...prev, friendNames: false })); // Clear email error
};


const handleFriendChange = (e) => {
  setFriendNames(e.target.value);
  setErrors((prev) => ({ ...prev, familyNames: false })); // Clear email error
};

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


// School Name Handler
const handleSchoolNameChange = (e) => {
  setSchoolName(e.target.value);
  setErrors((prev) => ({ ...prev, schoolName: false }));
};

// Teacher Name Handler
const handleTeacherNameChange = (e) => {
  setTeacherName(e.target.value);
  setErrors((prev) => ({ ...prev, teacherName: false }));
};

// Subject/Activity Handler
const handleSubjectActivityChange = (e) => {
  setSubjectActivity(e.target.value);
  setErrors((prev) => ({ ...prev, subjectActivity: false }));
};



// ..................................

const validateForm = () => {
  const newErrors = {
    email: !email.trim(),
    childName: !childName.trim(),
    childAge: !childAge.trim(),
    childHobby: !childHobby.trim(),
    images: images.length === 0,
    dateTime: !dateTime,
    schoolName: !schoolName.trim(),
    teacherName: !teacherName.trim(),
    subjectActivity: !subjectActivity.trim(),
  };

  setErrors(newErrors);

  // Check if any errors exist
  return !Object.values(newErrors).includes(true);
};


const handleNextClick = () => {
  if (validateForm()) {
    const formData = {
      email,
      dateTime,
      images,
      childName,
      childAge,
      childHobby,
      schoolName,
      teacherName,
      subjectActivity,
      familyNames,
      friendNames,
    };
    setPersonalizationFormData(formData);
    console.log(formData);
    onNext(); // Proceed to the next step
  } else {
    setValidationError(true); // Show error message
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
      <div className="relative w-full p-6 flex flex-col 
      items-end gap-6 ">
    
        <div className='w-full flex flex-col gap-14'>
          <div className='flex flex-row items-center justify-between w-full gap-3'>
              <h1 className="sm:text-5xl text-4xl font-light font-christmas text-red-950">{videoFormData?.videoTitle}</h1>
              <p className="sm:text-3xl text-2xl font-semibold text-green-500">€{videoFormData?.product.value}</p>
          </div>

          {/* Personalization options */}
          <div className='flex flex-col w-full'>
           
              {/* Child Name and Age and Hobby */}
              <div className='flex flex-col gap-6 md:pb-10 pb-6'>
                    <h1 className="sm:text-2xl text-xl font-light font-christmas bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Child Information</h1>
                    <div className='flex md:flex-row flex-col gap-6  w-full'>
                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Enter Child Name</label>
                          <input
                              type="text"
                              placeholder="Child Name"
                              value={childName}
                              maxLength={20}
                              onChange={handleChildNameChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.childName ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                        </div>

                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Enter Child Age</label>
                          <input
                              type="number"
                              min="0"
                              placeholder="Child Age"
                              value={childAge}
                              onChange={handleChildAgeChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.childAge ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />

                        </div>

                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Enter Child Hobby</label>
                          <input
                              type="text"
                              placeholder="Child Hobby"
                              value={childHobby}
                              maxLength={30}
                              onChange={handleChildHobbyChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.childHobby ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                        </div>
                      </div>
                </div>



                <div className='flex flex-col gap-6 md:pb-10 pb-6'>
                    <h1 className="sm:text-2xl text-xl font-light font-christmas 
                    bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                      Friends/Family Name
                    </h1>
                    <div className='flex md:flex-row flex-col gap-6  w-full'>
                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Enter Friend Name</label>
                          <input
                              type="text"
                              placeholder="Friend Names"
                              value={friendNames}
                              maxLength={40}
                              onChange={handleFriendChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.friendNames ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                        </div>

                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Enter Family Names</label>
                          <input
                              type="text"
                              maxLength="40"
                              placeholder="Family Names"
                              value={familyNames}
                              onChange={handleFamilyChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.familyNames ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />

                        </div>
                      </div>
                </div>





                {/* ........... */}
                <div className='flex flex-col gap-6 md:py-10 pb-6 md:border-t'>
                      <h1 className="sm:text-2xl text-xl font-light font-christmas bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">School Information</h1>
                      <div className='flex flex-col items-start gap-6 '>
                          <div className='flex md:flex-row flex-col items-center gap-6 w-full '>
                          <div className='flex flex-col items-start gap-2 w-full'>
                              <label className="text-gray-700 font-semibold  text-xs">Enter School Name</label>
                              <input
                                type="text"
                                placeholder="School Name"
                                value={schoolName}
                                maxLength={30}
                                onChange={handleSchoolNameChange}
                                className={`p-3 border rounded-md w-full focus:outline-none text-xs ${
                                  errors.schoolName ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                          </div>
                          <div className="flex md:flex-row flex-col gap-6 md:py-0 md:pb-0 pb-6 w-full">
                            <div className="flex flex-col items-start gap-2 w-full">
                              <label className="text-gray-700 font-semibold  text-xs">Enter Teacher Name</label>
                              <input
                                type="text"
                                placeholder="Teacher Name"
                                value={teacherName}
                                maxLength={30}
                                onChange={handleTeacherNameChange}
                                className={`p-3 border rounded-md w-full focus:outline-none text-xs ${
                                  errors.teacherName ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                            </div>
                          </div>
                      </div>
                      <div className='flex flex-col items-start gap-2 w-full'>
                              <label className="text-gray-700 font-semibold  text-xs">Enter Subject/Activity Child Enjoys</label>
                              <input
                                  type="text"
                                  placeholder="Subject or Activity"
                                  value={subjectActivity}
                                  maxLength={30}
                                  onChange={handleSubjectActivityChange}
                                  className={`p-3 border rounded-md w-full focus:outline-none text-xs ${
                                    errors.subjectActivity ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                />
                          </div>
                      </div>
                </div>
                
                
             

              <div className='flex flex-col items-start gap-6 w-full md:border-t md:py-10 pb-6'>
                <h1 className="sm:text-2xl text-xl font-light font-christmas bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Personal Information</h1>
                <div className='flex flex-col items-start gap-6 w-full'>
                 
              {/* Email and date */}
                 <div className='flex flex-col items-start gap-2 w-full'>
                    <label className="text-gray-700 font-semibold  text-xs">Enter Your Email</label>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={handleEmailChange}
                        className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                 </div>
                 <div className="flex md:flex-row flex-col gap-6 md:py-0 md:pb-0 pb-6 w-full">
                  {/* Date Input */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="text-gray-700 font-semibold  text-xs">Enter Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                          errors.dateTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                  </div>

                  {/* Time Slot Dropdown */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="text-gray-700 font-semibold  text-xs">Select Time</label>
                    <select
                        value={time}
                        onChange={handleTimeChange}
                        className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
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
            </div>
            
            {/* Image / Media Upload */}
            <div className="flex flex-col md:gap-2 gap-1 md:border-t md:py-10 pb-4">
              <label className="text-gray-700 font-semibold  text-xs">Upload Image</label>
              <div className="flex items-center gap-2">
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`hidden ${images.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    id="image-upload"
                  />
                                </div>
                                <div className='flex flex-col gap-6 items-start w-full'>
                                <label
                  htmlFor="image-upload"
                    className={`px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md
                      text-red-950 font-black  text-xs cursor-pointer border-2 ${
                        errors.images ? 'border-red-500' : 'border-yellow-400'
                      } ${images.length >= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FontAwesomeIcon icon={faFileImage} className="mr-2" /> Choose Image
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

            {/* ...................................................................................................... */}

            {/* <div className="flex flex-col gap-4 items-start md:border-t md:py-10">
              <div className="flex flex-row items-end justify-between w-full gap-4">
                <div className="flex flex-col items-start gap-4">
                  <h1 className="text-gray-700 font-semibold text-xs text-nowrap">Add Family Names</h1>
                  <button
                    onClick={handleAddFamilyNameClick} // Show input field
                    disabled={familyNames.length >= 4 } // Limit control
                    className={`px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md text-red-950 font-black 
                      text-xs text-nowrap ${familyNames.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FontAwesomeIcon icon={faPhone} className="mr-2" /> Add Family Name
                  </button>
                </div>

                {showFamilyInput && (
                  <div className="flex gap-2 items-center mt-2 w-full">
                    <input
                      type="text"
                      placeholder="Enter family name"
                      value={familyName}
                      onChange={handleFamilyNameChange} // Handle input change
                      className="p-3 border rounded-md text-xs w-full"
                    />
                    <button
                      onClick={handleFamilyNameSubmit} // Add family name to list
                      className="px-4 py-3 bg-gray-900 text-white rounded-md text-xs"
                    >
                      Enter
                    </button>
                  </div>
                )}
              </div>

              {errors.familyName && (
                <p className="text-red-500 text-xs">{errors.familyName}</p> // Display error
              )}

              {familyNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {familyNames.map((name, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded-md flex items-center gap-2">
                      <FontAwesomeIcon icon={faPhone} className="text-gray-600 text-sm" />
                      <span className="text-xs">{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>




            {/* ............................................................................................................... */}

            {/* <div className="flex flex-col gap-4 items-start md:border-t md:py-10">
              <div className="flex flex-row items-end justify-between w-full gap-4">
                <div className="flex flex-col items-start gap-4">
                  <h1 className="text-gray-700 font-semibold text-xs text-nowrap">Add Friend Names</h1>
                  <button
                    onClick={handleAddFriendNameClick} // Show input field
                    disabled={familyNames.length >= 4} // Limit control
                    className={`px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-md text-red-950 font-black 
                      text-xs text-nowrap ${familyNames.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FontAwesomeIcon icon={faPhone} className="mr-2" /> Add Friend Name
                  </button>
                </div>

                {showFriendInput && (
                  <div className="flex gap-2 items-center mt-2 w-full">
                    <input
                      type="text"
                      placeholder="Enter friend name"
                      value={friendName}
                      onChange={handleFriendNameChange} // Handle input change
                      className="p-3 border rounded-md text-xs w-full"
                    />
                    <button
                      onClick={handleFriendNameSubmit} // Add family name to list
                      className="px-4 py-3 bg-gray-900 text-white rounded-md text-xs"
                    >
                      Enter
                    </button>
                  </div>
                )}
              </div>

              {errors.friendName && (
                <p className="text-red-500 text-xs">{errors.friendName}</p> // Display error
              )}

              {friendNames.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {friendNames.map((name, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded-md flex items-center gap-2">
                      <FontAwesomeIcon icon={faPhone} className="text-gray-600 text-sm" />
                      <span className="text-xs">{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>  */}


            

            {validationError && (
                <p className="text-red-500  text-xs text-center mb-2">Please fill all fields before proceeding.</p>
              )}


          <button 
              onClick={handleNextClick}
              disabled={purchaseLoader} // Disable button while loading
              className={`w-full h-[2.8rem] bg-gradient-to-r from-gray-900 to-black flex items-center justify-center rounded-md
                text-white font-bold  text-xs transform transition-transform duration-300 hover:scale-[103%]`} // Style when loading
            >
              Next
            </button>
          </div>
        </div>
      </div>
  );
}

export default PersonalizationForm;
