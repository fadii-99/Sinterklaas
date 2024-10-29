import React, { useState , useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faFileImage, faSpinner, faPhone , faPlay} from '@fortawesome/free-solid-svg-icons'; // Added faPhone icon
import { BasicContext } from '../context/BasicContext';



function PersonalizationForm({ onClose, onNext , onBack }) {
  const {  videoFormData , setPersonalizationFormData } = useContext(BasicContext);
  // const [email, setEmail] = useState('');

  // const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]); // Initialize with today's date
  // const [time, setTime] = useState('12:00'); // Default time
  // const [dateTime, setDateTime] = useState(''); // Combined date and time string

  // const [images, setImages] = useState([]); // Array to store selected image files
  const [loading, setLoading] = useState(false); // Loading state to control the loader
  const [validationError, setValidationError] = useState(false);
  const [purchaseLoader, setPurchaseLoader] = useState(false); // State to control purchase button loader
// const [childName, setChildName] = useState('');
// const [childAge, setChildAge] = useState('');
// const [childHobby, setChildHobby] = useState('');
// const [schoolName, setSchoolName] = useState('');
// const [teacherName, setTeacherName] = useState('');
// const [subjectActivity, setSubjectActivity] = useState('');
// const [friendNames,setFriendNames] = useState('');
// const [familyNames,setFamilyNames] = useState('');

const [formState, setFormState] = useState({
  email: '',
  childName: '',
  childAge: '',
  childHobby: '',
  schoolName: '',
  teacherName: '',
  subjectActivity: '',
  familyNames: '',
  friendNames: '',
  date: new Date().toISOString().split('T')[0],
  time: '12:00',
  dateTime: '', // This will be automatically updated when date or time changes
  images: []
});


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


const handleChange = (event) => {
  const { name, value, type, files } = event.target;

  switch (type) {
    case 'file':
      const selectedFiles = Array.from(files);
      if (formState.images.length + selectedFiles.length > 1) return; // Limit to 3 images
      setFormState(prevState => ({ ...prevState, images: [...prevState.images, ...selectedFiles] }));
      break;
    case 'date':
    case 'time':
      const newDate = name === 'date' ? value : formState.date;
      const newTime = name === 'time' ? value : formState.time;
      setFormState(prevState => ({
        ...prevState,
        [name]: value,
        dateTime: `${newDate}T${newTime}`
      }));
      break;
    default:
      setFormState(prevState => ({ ...prevState, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: !value.trim() })); // Optional: Validate fields on the fly
  }
};



const validateForm = () => {
  const newErrors = {
    email: !formState.email.trim(),
    childName: !formState.childName.trim(),
    childAge: !formState.childAge.trim(),
    childHobby: !formState.childHobby.trim(),
    images: formState.images.length === 0,
    dateTime: !formState.dateTime,
    schoolName: !formState.schoolName.trim(),
    teacherName: !formState.teacherName.trim(),
    subjectActivity: !formState.subjectActivity.trim(),
    familyNames: !formState.familyNames.trim(),
    friendNames: !formState.friendNames.trim(),
  };

  setErrors(newErrors);
  // Check if any errors exist
  return !Object.values(newErrors).includes(true);
};



const handleNextClick = () => {
  if (validateForm()) {
    const formData = {
      email: formState.email,
      dateTime: formState.dateTime,
      images: formState.images,
      childName: formState.childName,
      childAge: formState.childAge,
      childHobby: formState.childHobby,
      schoolName: formState.schoolName,
      teacherName: formState.teacherName,
      subjectActivity: formState.subjectActivity,
      familyNames: formState.familyNames,
      friendNames: formState.friendNames,
    };
    setPersonalizationFormData(formData);
    console.log("Form Data:", formData);
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
                    <h1 className="sm:text-2xl text-xl font-light font-christmas bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Informatie over het Kind</h1>
                    <div className='flex md:flex-row flex-col gap-6  w-full'>
                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Voer kindernaam in</label>
                          <input
                              type="text"
                              name='childName'
                              placeholder="Kindernaam"
                              value={formState.childName}
                              maxLength={20}
                              onChange={handleChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.childName ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                        </div>

                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Voer leeftijd van het kind in</label>
                          <input
                            name='childAge'
                              type="number"
                              min="0"
                              placeholder="Leeftijd van het kind"
                              value={formState.childAge}
                              onChange={handleChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.childAge ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />

                        </div>

                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Voer hobby van het kind in</label>
                          <input
                            name='childHobby'
                              type="text"
                              placeholder="Hobby van het kind"
                              value={formState.childHobby}
                              maxLength={30}
                              onChange={handleChange}
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
                      Namen van Vrienden/Familie
                    </h1>
                    <div className='flex md:flex-row flex-col gap-6  w-full'>
                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Voer naam van vrienden in</label>
                          <input
                              type="text"
                                name='friendNames'
                              placeholder="Namen van vrienden"
                              value={formState.friendNames}
                              maxLength={40}
                              onChange={handleChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.friendNames ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />
                        </div>

                        <div className='flex flex-col items-start gap-2 w-full'>
                          <label className="text-gray-700 font-semibold  text-xs">Voer familienamen in</label>
                          <input
                              type="text"
                                name='familyNames'
                              maxLength="40"
                              placeholder="Familienamen"
                              value={formState.familyNames}
                              onChange={handleChange}
                              className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                                errors.familyNames ? 'border-red-500' : 'border-gray-300'
                              }`}
                            />

                        </div>
                      </div>
                </div>





                {/* ........... */}
                <div className='flex flex-col gap-6 md:py-10 pb-6 md:border-t'>
                      <h1 className="sm:text-2xl text-xl font-light font-christmas bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Schoolinformatie</h1>
                      <div className='flex flex-col items-start gap-6 '>
                          <div className='flex md:flex-row flex-col items-center gap-6 w-full '>
                          <div className='flex flex-col items-start gap-2 w-full'>
                              <label className="text-gray-700 font-semibold  text-xs">Voer schoolnaam in</label>
                              <input
                                type="text"
                                name='schoolName'
                                placeholder="Schoolnaam"
                                value={formState.schoolName}
                                maxLength={30}
                                onChange={handleChange}
                                className={`p-3 border rounded-md w-full focus:outline-none text-xs ${
                                  errors.schoolName ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                          </div>
                          <div className="flex md:flex-row flex-col gap-6 md:py-0 md:pb-0 pb-6 w-full">
                            <div className="flex flex-col items-start gap-2 w-full">
                              <label className="text-gray-700 font-semibold  text-xs">Voer naam van de leraar in</label>
                              <input
                                type="text"
                                name='teacherName'
                                placeholder="Naam van de leraar"
                                value={formState.teacherName}
                                maxLength={30}
                                onChange={handleChange}
                                className={`p-3 border rounded-md w-full focus:outline-none text-xs ${
                                  errors.teacherName ? 'border-red-500' : 'border-gray-300'
                                }`}
                              />
                            </div>
                          </div>
                      </div>
                      <div className='flex flex-col items-start gap-2 w-full'>
                              <label className="text-gray-700 font-semibold  text-xs">Voer het favoriete onderwerp/activiteit van het kind in</label>
                              <input
                                  type="text"
                                  name='subjectActivity'
                                  placeholder="Onderwerp of activiteit"
                                  value={formState.subjectActivity}
                                  maxLength={30}
                                  onChange={handleChange}
                                  className={`p-3 border rounded-md w-full focus:outline-none text-xs ${
                                    errors.subjectActivity ? 'border-red-500' : 'border-gray-300'
                                  }`}
                                />
                          </div>
                      </div>
                </div>
                
                
             

              <div className='flex flex-col items-start gap-6 w-full md:border-t md:py-10 pb-6'>
                <h1 className="sm:text-2xl text-xl font-light font-christmas bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Persoonlijke Informatie</h1>
                <div className='flex flex-col items-start gap-6 w-full'>
                 
              {/* Email and date */}
                 <div className='flex flex-col items-start gap-2 w-full'>
                    <label className="text-gray-700 font-semibold  text-xs">Voer uw e-mailadres in</label>
                    <input
                        type="email"
                        name='email'
                        placeholder="Uw e-mailadres"
                        value={formState.email}
                        onChange={handleChange}
                        className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                 </div>
                 <div className="flex md:flex-row flex-col gap-6 md:py-0 md:pb-0 pb-6 w-full">
                  {/* Date Input */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="text-gray-700 font-semibold  text-xs">Voer datum in</label>
                    <input
                        type="date"
                        name='date'
                        value={formState.date}
                        onChange={handleChange}
                        className={`p-3 border rounded-md w-full focus:outline-none  text-xs ${
                          errors.dateTime ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                  </div>

                  {/* Time Slot Dropdown */}
                  <div className="flex flex-col items-start gap-2 w-full">
                    <label className="text-gray-700 font-semibold  text-xs">Selecteer tijd</label>
                    <select
                        value={formState.time}
                        name='time'
                        onChange={handleChange}
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
              <label className="text-gray-700 font-semibold  text-xs">Upload afbeelding</label>
              <div className="flex items-center gap-2">
                <input
                    type="file"
                    name='images'
                    accept="image/*"
                    onChange={handleChange}
                    className={`hidden ${formState.images.length >= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    id="image-upload"
                  />
                                </div>
                                <div className='flex flex-col gap-6 items-start w-full'>
                                <label
                  htmlFor="image-upload"
                    className={`px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md
                      text-red-950 font-black  text-xs cursor-pointer border-2 ${
                        errors.images ? 'border-red-500' : 'border-yellow-400'
                      } ${formState.images.length >= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <FontAwesomeIcon icon={faFileImage} className="mr-2" /> Afbeelding kiezen
                  </label>

                {/* Display selected files */}
                <div className="flex flex-row gap-2 flex-wrap">
                  {formState.images.map((file, index) => (
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




            

            {validationError && (
                <p className="text-red-500  text-xs text-center mb-2">Vul alle velden in voordat u verder gaat</p>
              )}


           <div className='w-full flex flex-row items-center justify-between gap-4'>
                <button
                onClick={onBack}
                className="w-full h-[2.8rem] bg-gray-50 flex items-center justify-center rounded-md
                      text-red-950 font-bold text-xs transform transition-transform duration-300 hover:scale-[103%]"
              >
                Terug
              </button>
              <button 
                  onClick={handleNextClick}
                  disabled={purchaseLoader} // Disable button while loading
                  className={`w-full h-[2.8rem] bg-gradient-to-r from-gray-900 to-black flex items-center justify-center rounded-md
                    text-white font-bold  text-xs transform transition-transform duration-300 hover:scale-[103%]`} // Style when loading
                >
                   Volgende
                </button>
           </div>
       
          </div>
        </div>
      </div>
  );
}

export default PersonalizationForm;
