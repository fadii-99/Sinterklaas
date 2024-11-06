import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage, faSpinner } from '@fortawesome/free-solid-svg-icons';

function EditForm({ data, onClose }) {
  const [purchaseLoader, setPurchaseLoader] = useState(false);

  const initialDate = data?.send_date ? data.send_date.split("T")[0] : new Date().toISOString().split("T")[0];
  const initialTime = data?.send_date ? data.send_date.split("T")[1].slice(0, 5) : "12:00";

  const initialEmails = Array.isArray(data?.receiver_email) ? data.receiver_email : JSON.parse(data?.receiver_email || '[]');
  const initialPhoneNumbers = Array.isArray(data?.receiver_phone) ? data.receiver_phone : JSON.parse(data?.receiver_phone || '[]');

  const [formState, setFormState] = useState({
    email: data?.user_email || '',
    emails: initialEmails,
    phoneNumbers: initialPhoneNumbers,
    childName: data?.name || '',
    childAge: data?.age || '',
    childHobby: data?.hobby || '',
    schoolName: data?.school_name || '',
    teacherName: data?.teacher_name || '',
    subjectActivity: data?.favorite_subject || '',
    familyNames: data?.family_names || '',
    friendNames: data?.friends_names || '',
    date: initialDate,
    time: initialTime,
    dateTime: data?.send_date,
    images: [],
    imageName: data.file_paths && data.file_paths[0] ? data.file_paths[0] : '',
    id: data?.id
  });




  const handleChange = (event, index, field) => {
    const { name, value, type, files } = event.target;

    if (field === 'emails' || field === 'phoneNumbers') {
      const updatedField = [...formState[field]];
      updatedField[index] = value;
      setFormState((prevState) => ({ ...prevState, [field]: updatedField }));
    } else if (type === 'file') {
      const selectedFiles = Array.from(files);
      setFormState((prevState) => ({
        ...prevState,
        images: selectedFiles,  // Store as an array
        imageName: selectedFiles.map(file => file.name).join(", ")
      }));
    } else if (name === 'date' || name === 'time') {
      const newDate = name === 'date' ? value : formState.date;
      const newTime = name === 'time' ? value : formState.time;
      setFormState((prevState) => ({
        ...prevState,
        [name]: value,
        dateTime: `${newDate}T${newTime}`
      }));
    } else {
      setFormState((prevState) => ({ ...prevState, [name]: value }));
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

  const EditNow = async () => {
    setPurchaseLoader(true);
    const formData = new FormData();

    formData.append('user_email', formState.email);
    formData.append('send_date', formState.dateTime);
    formData.append('name', formState.childName);
    formData.append('age', formState.childAge);
    formData.append('hobby', formState.childHobby);
    formData.append('school_name', formState.schoolName);
    formData.append('teacher_name', formState.teacherName);
    formData.append('favourite_subject', formState.subjectActivity);
    formData.append('friends_names', formState.familyNames);
    formData.append('family_names', formState.friendNames);
    formData.append('id', formState.id);

    if (formState.images && formState.images.length > 0) {
      formState.images.forEach((image) => formData.append('files', image));
    } 


    // Conditionally add emails and phone numbers or set them to null if empty
    formData.append('receiver_email', formState?.emails?.length > 0 ? JSON.stringify(formState.emails) : null);
    formData.append('receiver_phone', formState?.phoneNumbers?.length > 0 ? JSON.stringify(formState.phoneNumbers) : null);

    try {
      const response = await fetch('http://134.122.63.191:9000/admin/video-purchase/update/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Purchase Response:', data);
    } catch (error) {
      console.error('Error during purchase:', error);
    } finally {
      setPurchaseLoader(false);
      onClose();
      window.location.reload()
    }
  };




  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
      {purchaseLoader && (
          <div className="absolute inset-0 bg-gray-900 bg-opacity-20 flex items-center justify-center z-50">
            <FontAwesomeIcon icon={faSpinner} spin className="text-white text-4xl" />
          </div>
        )}
      <div className="relative w-full p-6 flex flex-col items-end gap-6 bg-white max-w-3xl min-h-[95vh] max-h-[95vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
         
        

        <div className='w-full flex flex-col gap-8'>
          <div className='flex flex-row items-center justify-between w-full gap-3'>
            <h1 className="sm:text-5xl text-4xl font-light font-christmas bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Bewerk Informatie
            </h1>
            <button onClick={onClose} className="text-red-950 hover:text-gray-700 text-3xl font-bold">&times;</button>
          </div>

          {/* Child Name, Age, and Hobby */}
          <div className='flex flex-col gap-6 '>
            <div className='flex md:flex-row flex-col gap-6 w-full'>
              <div className='flex flex-col items-start gap-2 w-full'>
                <label className="text-gray-700 font-semibold text-xs">Naam Kind</label>
                <input
                  type="text"
                  name="childName"
                  placeholder="Naam van het Kind"
                  value={formState.childName}
                  maxLength={20}
                  onChange={handleChange}
                  className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
                />
              </div>
              <div className='flex flex-col items-start gap-2 w-full'>
                <label className="text-gray-700 font-semibold text-xs">Leeftijd Kind</label>
                <input
                  type="number"
                  name="childAge"
                  placeholder="Leeftijd van het Kind"
                  value={formState.childAge}
                  onChange={handleChange}
                  className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
                />
              </div>
              <div className='flex flex-col items-start gap-2 w-full'>
                <label className="text-gray-700 font-semibold text-xs">Hobby Kind</label>
                <input
                  type="text"
                  name="childHobby"
                  placeholder="Hobby van het Kind"
                  value={formState.childHobby}
                  maxLength={30}
                  onChange={handleChange}
                  className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
                />
              </div>
            </div>
          </div>

          {/* School Name, Teacher Name, Subject Activity */}
          <div className='flex flex-col gap-6'>
            <div className='flex md:flex-row flex-col gap-6 w-full'>
              <div className='flex flex-col items-start gap-2 w-full'>
                <label className="text-gray-700 font-semibold text-xs">Schoolnaam</label>
                <input
                  type="text"
                  name="schoolName"
                  placeholder="Naam van de School"
                  value={formState.schoolName}
                  maxLength={30}
                  onChange={handleChange}
                  className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
                />
              </div>
              <div className='flex flex-col items-start gap-2 w-full'>
                <label className="text-gray-700 font-semibold text-xs">Naam Leraar</label>
                <input
                  type="text"
                  name="teacherName"
                  placeholder="Naam van de Leraar"
                  value={formState.teacherName}
                  maxLength={30}
                  onChange={handleChange}
                  className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
                />
              </div>
            </div>
            <div className='flex flex-col items-start gap-2 w-full'>
              <label className="text-gray-700 font-semibold text-xs">Favoriete Vak/Activiteit</label>
              <input
                type="text"
                name="subjectActivity"
                placeholder="Favoriete Vak of Activiteit"
                value={formState.subjectActivity}
                maxLength={30}
                onChange={handleChange}
                className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
              />
            </div>
          </div>

          {/* Date and Time */}
          <div className='flex flex-col gap-2 w-full'>
            <div className="flex md:flex-row flex-col gap-6 w-full">
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="text-gray-700 font-semibold text-xs">Datum</label>
                <input
                  type="date"
                  name="date"
                  value={formState.date}
                  onChange={handleChange}
                  className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
                />
              </div>
              <div className="flex flex-col items-start gap-2 w-full">
                <label className="text-gray-700 font-semibold text-xs">Tijd</label>
                <select
                  name="time"
                  value={formState.time}
                  onChange={handleChange}
                  className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
                >
                  {generateTimeSlots().map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="flex flex-col items-start md:gap-2 gap-1">
            <label className="text-gray-700 font-semibold text-xs">Afbeelding Uploaden</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="px-4 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center 
              rounded-md text-red-950 font-black text-xs cursor-pointer border-2 border-yellow-400"
            >
              <FontAwesomeIcon icon={faFileImage} className="mr-2" /> Kies Afbeelding
            </label>

            {/* Display current or selected image */}
            <div className="flex flex-row gap-2 flex-wrap mt-2">
              {formState.imageName ? (
                <div className="flex flex-col items-center gap-2 bg-gray-100 rounded-md p-2">
                  <FontAwesomeIcon icon={faFileImage} className="text-gray-600" />
                  <span className="text-gray-700 text-xs">{formState.imageName}</span>
                </div>
              ) : (
                <span className="text-gray-500 text-sm">Geen afbeelding geselecteerd</span>
              )}
            </div>
          </div>

          {/* Emails */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-gray-700 font-semibold text-xs">Primaire E-mail</label>
            <input
              type="email"
              name="email"
              placeholder="Voer primaire e-mail in"
              value={formState.email}
              onChange={handleChange}
              className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label className="text-gray-700 font-semibold text-xs">Aanvullende E-mails</label>
            {formState?.emails?.map((email, index) => (
              <input
                key={index}
                type="email"
                placeholder="Voer aanvullende e-mail in"
                value={email}
                onChange={(e) => handleChange(e, index, 'emails')}
                className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300 mb-2"
              />
            ))}
          </div>

          {/* Phone Numbers */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-gray-700 font-semibold text-xs">Telefoonnummers</label>
            {formState?.phoneNumbers?.map((phone, index) => (
              <input
                key={index}
                type="text"
                placeholder="Voer telefoonnummer in"
                value={phone}
                onChange={(e) => handleChange(e, index, 'phoneNumbers')}
                className="p-3 border rounded-md w-full focus:outline-none text-xs border-gray-300 mb-2"
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className='w-full flex flex-row items-center justify-between gap-4'>
            <button 
              onClick={EditNow}
              disabled={purchaseLoader}
              className="w-full h-[2.8rem] bg-gradient-to-r from-gray-900 to-black flex items-center justify-center rounded-md text-white font-bold text-xs transform transition-transform duration-300 hover:scale-[103%]"
            >
              {purchaseLoader ? 'Bezig...' : 'Nu Bewerken'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditForm;
