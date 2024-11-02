import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import logo from './../assets/sinterklaasLogo.png';




function Login() {
  const navigate = useNavigate(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    email: false,
    password: false,
  });
  const [errorMessage, setErrorMessage] = useState('');

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    setFormErrors({ ...formErrors, [name]: false });
  };


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // navigate('/Admin');

    // Validate input fields
    const errors = {
      email: !email,
      password: !password,
    };
    setFormErrors(errors);

    const hasErrors = Object.values(errors).some((error) => error);
    if (!hasErrors) {
      const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

      try {
        const response = await fetch(`http://134.122.63.191:9000/admin/login/`, {
          method: 'POST',
          body: formData,
        });


        if (response.ok) {
          const data = await response.json();
          console.log('Login successful:', data.access_token);
          localStorage.setItem('token', data.access_token); 
          navigate('/Admin'); 
        } else {
          console.error('Login failed:');
          setErrorMessage('Inloggen mislukt. Probeer het opnieuw.');
        }
      } catch (error) {
        console.error('An error occurred:', error);
        setErrorMessage('Er is een fout opgetreden. Probeer het later opnieuw.');
      }
    } else {
      setErrorMessage('Vul beide velden in.');
    }
  };

 


  return (
    <div className="flex flex-col items-center justify-center gap-8 w-full py-24">
      <div className="w-full max-w-sm p-8 bg-white rounded shadow-lg flex flex-col items-center gap-8 mt-12">
        {errorMessage && <p className="text-red-500 text-sm mt-4 bg-red-50 w-full rounded py-3 text-center">{errorMessage}</p>}
        <img src={logo} alt="Factual Inquirer Logo" className="w-[8rem] h-full" />
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">
          <input
            type="text"
            name="email"
            placeholder="Gebruikersnaam"
            value={email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded text-sm outline-none ${
              formErrors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            required
          />
          <div className="relative w-full">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Wachtwoord"
              value={password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded text-sm outline-none ${
                formErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-2"
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
          <button
            className="py-3 w-full bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md
              text-red-950 font-black sm:text-md text-sm transform transition-transform duration-300 hover:scale-[103%]"
          >
           INLOGGEN
          </button>
          {/* <Link to="/ForgetPassword" className="underline underline-offset-4 text-xs text-gray-700 font-medium">
            Forget Password
          </Link> */}
        </form>
      </div>
     
    </div>
  );
}

export default Login;
