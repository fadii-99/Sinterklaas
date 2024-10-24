import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faInstagram, faXTwitter} from '@fortawesome/free-brands-svg-icons';


function Footer() {
  return (
    <footer className="bg-red-950 text-gray-400 md:py-8 py-4">
      <div className="px-16 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Social Links */}
        <div className="flex justify-center gap-6">
          <Link to='/TermOfServices' className="hover:text-gray-200  sm:text-sm text-xs text-white
          transform transition-transform duration-300 hover:scale-[102%]">
             Terms of Service
          </Link>
          <Link to='/PrivacyPolicy' className="hover:text-gray-200  sm:text-sm text-xs text-white
          transform transition-transform duration-300 hover:scale-[102%]">
             Privacy Policy
          </Link>
        </div>
          <p className="text-center md:text-left sm:text-sm text-xs text-white">
          © 2024 Sinterklaas. All rights reserved.
        </p>
        <div className="flex flex-row items-center gap-6">
            <a href="" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faFacebookF} className="h-5 w-auto transform transition-transform duration-300 hover:scale-[108%]
               text-white" />
            </a>
            <a href="" target="_blank" rel="noreferrer">
            <FontAwesomeIcon icon={faXTwitter} className="h-5 w-auto transform transition-transform duration-300 hover:scale-[108%]
             text-white"  />
            </a>
            <a href="" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faInstagram} className="h-6 w-auto transform transition-transform duration-300 hover:scale-[108%]
               text-white" />
            </a>
          </div>
      </div>
    </footer>
  );
}

export default Footer;
