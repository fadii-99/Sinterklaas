import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import ParentElement from './ParentElement.jsx';


// Lazy loading pages
const MainPage = lazy(() => import('../pages/MainPage.jsx'));
const ComingSoon = lazy(() => import('../pages/ComingSoon.jsx'));
const Success=lazy(() => import('../pages/Success.jsx'));
const PrivacyPolicy=lazy(() => import('../pages/PrivacyPolicy.jsx'));
const TermsOfService=lazy(() => import('../pages/TermOfService.jsx'));
const Pricing=lazy(() => import('../pages/Pricing.jsx'));
const Video=lazy(() => import('../pages/Video.jsx'));
const Login=lazy(() => import('../pages/Login.jsx'));
const Admin=lazy(() => import('../pages/Admin.jsx'));



const router = createBrowserRouter([
  {
    path: '/', 
    element: (
        <Suspense fallback={''}>
          <ParentElement />
        </Suspense>
    ),
    children: 
    [
      {
        index: true, element: ( <Suspense fallback={''}> <MainPage /> </Suspense>),
      }
      ,
      {
        path: '/Login', element: ( <Suspense fallback={''}> <Login /> </Suspense>),
      }
      ,
      {
        path: '/Pricing', element: ( <Suspense fallback={''}> <Pricing /> </Suspense>),
      }
      ,
      {
        path: '/Videos', element: ( <Suspense fallback={''}> <Video /> </Suspense>),
      }
      ,
      {
        path: '/TermOfServices', element: ( <Suspense fallback={''}> <TermsOfService /> </Suspense>),
      }
      ,
      {
        path: '/PrivacyPolicy', element: ( <Suspense fallback={''}> <PrivacyPolicy /> </Suspense>),
      }
      ,
  {
    path: '/payment-success', element: ( <Suspense fallback={''}> <Success /> </Suspense>),
  }
    ],
  },
  {
    path: '/ComingSoon', element: ( <Suspense fallback={''}> <ComingSoon /> </Suspense>),
  }
  ,
  
      {
        path: '/Admin', element: ( <Suspense fallback={''}> <Admin/> </Suspense>),
      }
]);

export default router;