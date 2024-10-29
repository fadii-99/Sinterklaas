import React, { createContext, useState } from 'react';

export const FormDataContext = createContext();

export const FormDataProvider = ({ children }) => {
    const [formData, setFormData] = useState({
        email: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        dateTime: '',
        images: [],
        childName: '',
        childAge: '',
        childHobby: '',
        schoolName: '',
        teacherName: '',
        subjectActivity: '',
        friendNames: '',
        familyNames: ''
    });

    const [formErrors, setFormErrors] = useState({
        email: false,
        date: false,
        time: false,
        dateTime: false,
        images: false,
        childName: false,
        childAge: false,
        childHobby: false,
        schoolName: false,
        teacherName: false,
        subjectActivity: false,
        friendNames: false,
        familyNames: false
    });

    // Updates form data state
    const updateFormData = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Validates all form fields
    const validateForm = () => {
        const newErrors = {
            email: !formData.email.trim(),
            childName: !formData.childName.trim(),
            childAge: !formData.childAge.trim(),
            childHobby: !formData.childHobby.trim(),
            images: formData.images.length === 0,
            dateTime: !formData.dateTime,
            schoolName: !formData.schoolName.trim(),
            teacherName: !formData.teacherName.trim(),
            subjectActivity: !formData.subjectActivity.trim(),
        };

        setFormErrors(newErrors);

        // Check if any errors exist
        return !Object.values(newErrors).includes(true);
    };

    return (
        <FormDataContext.Provider value={{
            formData,
            formErrors,
            updateFormData,
            validateForm
        }}>
            {children}
        </FormDataContext.Provider>
    );
};
