import ComingSoon from './pages/ComingSoon';
import { RouterProvider } from 'react-router-dom'
import router from './routes/router';
import './index.css';
import BasicProvider from './context/BasicContext';

function App() {

  return (
    <>
      <BasicProvider>
        <RouterProvider router={router} /> 
      </BasicProvider>
    </>
  )
}

export default App
