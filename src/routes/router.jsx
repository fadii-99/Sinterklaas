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
        path: '/Pricing', element: ( <Suspense fallback={''}> <Pricing /> </Suspense>),
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
]);

export default router;