import React, { useState , useEffect } from 'react';
import { FaTrash, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Aangekochte Video\'s');

  const [selectedPurchaseTableRow, setSelectedPurchaseTableRow] = useState(null);
  const [selectedCouponTableRow, setSelectedCouponTableRow] = useState(null);

  const [showCreateCouponModal, setShowCreateCouponModal] = useState(false); // For the create coupon modal
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);



  const [couponForm, setCouponForm] = useState({ code: '', total: '' });
  const [couponFormErrors, setCouponFormErrors] = useState({ code: false, total: false });


  const [purchaseData, setPurchaseData] = useState([]);
  const [couponData, setCouponData] = useState([]);
  const [generatedVideos, setGeneratedVideos] = useState([]);


  const [refreshData, setRefreshData] = useState(false); // State to trigger re-fetch


// ..............................................................................................................................
// ................................................................................................................................



useEffect(() => {
  // Check if token exists in localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login'); // Redirect to login if no token
  }
}, [navigate]);





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://134.122.63.191:9000/admin/getdata');
        const data = await response.json();
        setPurchaseData(data.purchases);
        setCouponData(data.coupons);
        setGeneratedVideos(data.finalVideos);
        console.log('API Response:', data.coupon); // Log response to console
        console.log('API Response:', data); // Log response to console
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [refreshData]); 



  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/'); // Redirect to home page
  };



// ...............................................................................................................................
// ...............................................................................................................................



  // Purchase table delete handler
//   const handlePurchaseDeleteClick = (id) => {
//     setSelectedPurchaseTableRow(id);
//     setSelectedCouponTableRow(null); // Ensure only one table is active for deletion
//     setShowModal(true);
//   };

  // Coupon table delete handler
  const handleCouponDeleteClick = (id) => {
    setSelectedCouponTableRow(id);
    setSelectedPurchaseTableRow(null); // Ensure only one table is active for deletion
    setShowModal(true);
  };


// ..................................................................................................................................


const confirmDelete = async () => {
    setLoading(true);
    try {
      let response;
      const formData = new FormData();

      if (selectedPurchaseTableRow) {
        // Add data to FormData for purchase deletion
        // formData.append('id', selectedPurchaseTableRow);
        response = await fetch(``, {
          method: 'POST',
          body: formData,
        });
      } else if (selectedCouponTableRow) {
        // Add data to FormData for coupon deletion
        formData.append('id', selectedCouponTableRow);
        response = await fetch('http://134.122.63.191:9000/admin/del-coupon/', {
          method: 'POST',
          body: formData,
        });
        const data=response.json();
        setCouponData((prevCouponData) =>
          prevCouponData.filter((coupon) => coupon.id !== selectedCouponTableRow)
        );
        console.log(`Delete Response: ${data}`);
      }

     

  
      if (!response.ok) {
        throw new Error('Failed to send data');
      }
  
      // Optionally, handle the response if needed (e.g., update state)
    } catch (error) {
      console.error('Error sending data:', error);
    }
    setLoading(false);
    setShowModal(false);
    setSelectedPurchaseTableRow(null);
    setSelectedCouponTableRow(null);
  };

  



// ..........................................................................................................................
// ............................................................................................................................



const handleCouponFormChange = (e) => {
    const { name, value } = e.target;
    setCouponForm((prev) => ({ ...prev, [name]: value }));
    setCouponFormErrors((prev) => ({ ...prev, [name]: false })); // Reset error on change
  };

  const handleCouponSubmit = async () => {
    const errors = {
      code: couponForm.code === '',
      total: couponForm.total === '',
    };
    setCouponFormErrors(errors);

    if (!errors.code && !errors.total) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append('code', couponForm.code);
        formData.append('total_number', couponForm.total);

        const response = await fetch(`http://134.122.63.191:9000/admin/add-email/`, {
          method: 'POST',
          body: formData,
        });

        setRefreshData((prev) => !prev);

        console.log(response);

        if (!response.ok) {
          throw new Error('Failed to create coupon');
        }
      } catch (error) {
        console.error('Error creating coupon:', error);
      }
      setLoading(false);
      setShowCreateCouponModal(false);
      setCouponForm({ code: '', total: '' });
    }
  };




  return (
    <div className="flex flex-col md:flex-row h-screen  md:p-8 p-4 bg-gray-100">
        <div className="md:w-1/5 w-full bg-red-950 shadow-lg shadow-red-950 md:rounded-3xl rounded-xl text-white flex 
        flex-col justify-between md:mb-0 mb-8 p-4">
             <div className='flex flex-col gap-4'>
                <h2 className="text-3xl font-bold mb-6 md:mb-8 font-christmas">Beheerpaneel</h2>
                <nav className="flex md:flex-col md:items-start items-center flex-row md:gap-4 gap-0 overflow-auto md:overflow-visible">
                {['Aangekochte Video\'s', 'Maak Coupon', 'Gegenereerde Video\'s'].map((tab) => (
                    <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 md:px-4 px-2 font-semibold md:text-sm text-xs text-nowrap rounded w-full text-start ${
                        activeTab === tab ? 'bg-white text-red-950' : 'hover:bg-red-900 hover:bg-opacity-50'
                    }`}
                    >
                    {tab}
                    </button>
                ))}
                </nav>
             </div>
           
            <button  onClick={handleLogout}
            className={`py-3 md:px-4 px-2 font-semibold rounded w-full text-start md:text-sm text-xs hover:bg-red-900 hover:bg-opacity-50`}
                >
                Uitloggen
            </button>
        </div>

        <div className="md:w-4/5 w-full p-4 md:p-8 flex flex-col gap-8">
            <div className='flex flex-row items-center justify-between'>
            <h1 className="text-3xl md:text-5xl font-semibold font-christmas text-red-950">{activeTab}</h1>
            {activeTab === 'Maak Coupon' && (
                <button
                onClick={() => setShowCreateCouponModal(true)}
                className="py-2 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 flex items-center justify-center rounded-md
                    text-red-950 font-black sm:text-md text-xs transform transition-transform duration-300 hover:scale-[103%]"
                >
                 NU AANMAKEN
                </button>
            )}
            </div>



{/* ............................................................................................................................ */}
{/* ............................................................................................................................ */}



        {activeTab === 'Aangekochte Video\'s' && (
          <div className="overflow-auto 
      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 shadow-xl">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Serienummer
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Gebruikers_Email
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Verzend_Datum
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Bestel_Datum
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Verstuurd_Naar
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Videostatus
                  </th>
                </tr>
              </thead>
              <tbody>
                {purchaseData?.map((item, index) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{index+1}</td>
                    <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{item.user_email}</td>
                    <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">
                            {new Date(item.send_date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}{' '}
                            {new Date(item.send_date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}
                            </td>

                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">
                                {new Date(item.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}{' '}
                                {new Date(item.created_at).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                })}
                                </td>

                                <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">
                                    {item.receiver_email && JSON.parse(item.receiver_email).length > 0
                                      ? JSON.parse(item.receiver_email).map((email, index) => (
                                          <div key={index}>{email}</div>
                                        ))
                                      : item.receiver_phone && JSON.parse(item.receiver_phone).length > 0
                                      ? JSON.parse(item.receiver_phone).map((phone, index) => (
                                          <div key={index}>{phone}</div>
                                        ))
                                      : "No data"}
                                  </td>
                    <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{item.video_status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

{/* .......................................................................................................................... */}
{/* ...........................................................................................................................*/}


        {activeTab === 'Maak Coupon' && (
          <div className="overflow-auto 
      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 shadow-xl">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Serienummer
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Coupon
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Totaal_Aantal
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Datum
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Actie
                  </th>
                </tr>
              </thead>
              <tbody>
                    {couponData && couponData.length > 0 ? (
                        couponData.map((item, index) => (
                        <tr key={item.id} className="border-b">
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{index + 1}</td>
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{item.coupon}</td>
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{item.total_number == null ? '0' : item.total_number}</td>
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">
                            {new Date(item.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                            })}{' '}
                            {new Date(item.date).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                            })}
                            </td>
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">
                            <button onClick={() => handleCouponDeleteClick(item.id)} className="text-red-950 hover:text-red-700">
                                <FaTrash />
                            </button>
                            </td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="5" className="py-3 px-6 md:text-xs text-[9px] text-gray-800 text-center">
                        Geen gegevens beschikbaar
                        </td>
                        </tr>
                    )}
                    </tbody>
            </table>
          </div>
        )}


{activeTab === 'Gegenereerde Video\'s' && (
          <div className="overflow-auto 
      scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 shadow-xl">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Serienummer
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Video Pad
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Aankoop-ID
                  </th>
                  <th className="py-3 px-6 bg-gray-200 text-left md:text-xs text-[9px] font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                  </th>
                 
                </tr>
              </thead>
              <tbody>
                    {generatedVideos && generatedVideos.length > 0 ? (
                        generatedVideos.map((item, index) => (
                        <tr key={item.id} className="border-b">
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{index + 1}</td>
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{item.final_video_path}</td>
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{item.purchase_id}</td>
                            <td className="py-3 px-6 md:text-xs text-[9px] text-gray-800">{item.send_status}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                        <td colSpan="5" className="py-3 px-6 md:text-xs text-[9px] text-gray-800 text-center">
                        Geen gegevens beschikbaar
                        </td>
                        </tr>
                    )}
                    </tbody>
            </table>
          </div>
        )}

{/* ................................................................................................................... */}
{/* ................................................................................................................... */}



        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button onClick={() => setShowModal(false)} className="absolute top-2 right-2 text-gray-600">
                <FaTimes />
              </button>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-christmas">Bevestig Verwijderen</h2>
              <p className="text-gray-600 mb-6">Weet je zeker dat je dit item wilt verwijderen?</p>
              <button
                onClick={confirmDelete}
                className="w-full py-2 px-4 bg-red-950 text-white font-semibold rounded"
                disabled={loading}
              >
                {loading ? 'Verwijderen...' : 'Bevestigen'}
              </button>
            </div>
          </div>
        )}


{/* .................................................................................................................. */}


{showCreateCouponModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
              <button onClick={() => setShowCreateCouponModal(false)} className="absolute top-2 right-2 text-gray-600">
                <FaTimes />
              </button>
              <h2 className="text-3xl font-semibold text-gray-800 mb-4 font-christmas">Maak Coupon</h2>
              <div className="mb-4">
                <input
                  type="text"
                  name="code"
                  placeholder="Voer Couponcode in"
                  value={couponForm.code}
                  onChange={handleCouponFormChange}
                  className={`p-3 border rounded-md w-full focus:outline-none md:text-xs text-[9px] ${
                    couponFormErrors.code ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  name="total"
                  placeholder="Totaal Aantal"
                  value={couponForm.total}
                  onChange={handleCouponFormChange}
                  className={`p-3 border rounded-md w-full focus:outline-none md:text-xs text-[9px] ${
                    couponFormErrors.total ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              <button
                onClick={handleCouponSubmit}
                className="w-full py-2 px-4 bg-red-950 text-white font-semibold rounded"
                disabled={loading}
              >
                {loading ? 'Versturen...' : 'Verstuur'}
              </button>
            </div>
          </div>
        )}



      </div>
    </div>
  );
}

export default Admin;
