// const purchaseNow = async () => {
//   if (!validateForm()) return;
//   setPurchaseLoader(true); 
//   const formData = new FormData();
//   // formData.append('voice_path', filePath);
//   formData.append('user_email', email);
//   formData.append('send_date', dateTime);
//   formData.append('amount', data.product.value);
//   formData.append('video_name', data.product.title);
//   formData.append('name', childName);
//   formData.append('age', childAge);
//   formData.append('hobby', childHobby);
  // formData.append('school_name', schoolName);
  // formData.append('teacher_name', teacherName);
  // formData.append('subject_activity', subjectActivity);



  // images.forEach((image) => formData.append('files', image));
  // formData.append('receiver_phone', JSON.stringify(phoneNumbers));
  //   try {
  //     const response = await fetch('http://134.122.63.191:3000/purchase-video', {
  //       method: 'POST',
  //       body: formData,
  //     });
  
  
  //     const data = await response.json();
  //     console.log('Purchase Response:', data);
  //     if (response.ok)
  //     {
  //       window.location.href = data.checkout_url;
  //     }
  //   } catch (error) {
  //     console.error('Error during purchase:', error);
  //   }
  //   finally {
  //     setPurchaseLoader(false); // Stop loader
  //   }
  // };