import React, { useEffect, useState } from 'react';
import './CSS/EditProfileSeller.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaCamera, FaEdit } from 'react-icons/fa';

import { getAccessToken } from '../utils/token';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function EditProfileSeller() {
  const [user, setUser] = useState(null);
  const [currentGender, setCurrentGender] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  
  const [bankInput, setBankInput] = useState('');
  void bankInput
  const [bankSearch, setBankSearch] = useState('');
const [showBankDropdown, setShowBankDropdown] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
const [banksList, setBanksList] = useState([]);
const [selectedBank, setSelectedBank] = useState('');
const [accountNumber, setAccountNumber] = useState('');
const [accountName, setAccountName] = useState('');
const [verifying, setVerifying] = useState(false);
const [bankSubmitting, setBankSubmitting] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
const [showDetailModal, setShowDetailModal] = useState(false);


  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const [modeLoading, setModeLoading] = useState(false);

  const navigate = useNavigate();
  void imageFile;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    gender: '',
    username: '',
    image: '',
    bank_details: '',
  });

  const genders = ['male', 'female'];

const handleCardClick = async (withdrawalId) => {
  const token = await getAccessToken();

  try {
    const response = await fetch(`${BASE_URL}/v1/withdrawals/${withdrawalId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error('Failed to fetch withdrawal details');

    const result = await response.json();
    console.log("Fetched withdrawal detail:", result.data);
    setSelectedWithdrawal(result.data); // ✅ Use result.data not result
    setShowDetailModal(true);
  } catch (error) {
    console.error('Error fetching withdrawal details:', error.message);
  }
};

const handleDeleteWithdrawal = async () => {
  const token = await getAccessToken();

  if (!selectedWithdrawal?.id) {
    console.error("Withdrawal ID not found for deletion");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/v1/withdrawals/${selectedWithdrawal.id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    console.log("Delete response:", result);

    if (result.success) {
      alert("Withdrawal deleted successfully");
      setShowDetailModal(false);
      setSelectedWithdrawal(null); // Reset
    } else {
      alert("Failed to delete withdrawal");
    }
  } catch (error) {
    console.error('Error deleting withdrawal:', error.message);
  }
};


  useEffect(() => {
      const fetchProfile = async () => {
        try {
          const token = await getAccessToken();
          const res = await fetch(`${BASE_URL}/v1/auth/profile`, {
            headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
          });
  
          const data = await res.json();
          if (data.success) {
            const userData = data.data;
  
            // 🔐 Unique email_verified key
            const verifiedOverride = sessionStorage.getItem(`email_verified_${userData.username}`) === '1';
  
            const updatedUser = {
              ...userData,
              email_verify: verifiedOverride ? 1 : userData.email_verify,
            };
  
            setUser(updatedUser);
            setCurrentGender(updatedUser.gender || '');
            
        const storedBankDetails = sessionStorage.getItem(`bank_details_${userData.username}`);
        const resolvedBankDetails = updatedUser.bank_details?.[0] || storedBankDetails || '';

            setFormData({
              first_name: updatedUser.first_name || '',
              last_name: updatedUser.last_name || '',
              email: updatedUser.email || '',
              phone: updatedUser.phone || '',
              gender: updatedUser.gender || '',
              username: updatedUser.username || '',
              image: updatedUser.image || '',
              bank_details: resolvedBankDetails
            });
        setBankInput(resolvedBankDetails);
  
            // 🔐 Restore image uniquely per user
            const storedImage = sessionStorage.getItem(`profile_image_url_${userData.username}`);
            if (storedImage) {
              setPreviewImage(storedImage);
            } else if (updatedUser.image) {
              let userImage = updatedUser.image;
  
              if (!userImage.includes('/public/')) {
                userImage = userImage.replace('/upload/', '/public/upload/');
              }
  
              if (!userImage.startsWith('http')) {
                userImage = `https://demo.jadesdev.com.ng${userImage}`;
              }
  
              setPreviewImage(userImage);
            }
          }
        } catch (err) {
          console.error('Error loading profile:', err);
        }
      };
  
      fetchProfile();
    }, []);


// Fetch withdrawal history
 const fetchWithdrawals = async () => {
  try {
    const token = await getAccessToken();
    const res = await fetch(`${BASE_URL}/v1/withdrawals`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log("✅ RAW WITHDRAWALS RESPONSE:", data); // <-- 🔍 important

    // Try various common structures:
    if (Array.isArray(data)) {
      setWithdrawals(data);
    } else if (Array.isArray(data.data)) {
      setWithdrawals(data.data);
    } else if (Array.isArray(data.withdrawals)) {
      setWithdrawals(data.withdrawals);
    } else {
      console.error("❌ Failed to fetch withdrawals or data malformed");
    }
  } catch (err) {
    console.error("❌ Error fetching withdrawals:", err);
  }
};



  useEffect(() => {
  if (showHistoryModal) {
    fetchWithdrawals();
  }
}, [showHistoryModal]);

const closeModal = () => {
  setShowHistoryModal(false); // or whatever state controls the modal visibility
};


const handleWithdraw = async () => {
  if (!selectedBank?.bank_name || !selectedBank?.account_number) {
  alert("❌ Bank not selected properly.");
  return;
}


  try {
    const token = await getAccessToken();

    const res = await fetch(`${BASE_URL}/v1/withdrawals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: Number(withdrawAmount),
        note: `Withdrawal to ${selectedBank.bank_name} (${selectedBank.account_number})`
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Withdrawal request submitted!");
      setShowWithdrawModal(false);
      setSelectedBank('');
      setWithdrawAmount('');
    } else {
      alert(data.message || "❌ Withdrawal failed.");
    }
  } catch (error) {
    console.error(error);
    alert("❌ Network error while withdrawing.");
  }
};


  useEffect(() => {
  const fetchBanks = async () => {
    try {
      const token = await getAccessToken();
      const res = await fetch(`${BASE_URL}/v1/bank-accounts/banks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setBanksList(data.data || []);
    } catch (err) {
      console.error('Error fetching banks:', err);
    }
  };

  fetchBanks();
}, []);

useEffect(() => {
  const storedFormData = sessionStorage.getItem('formData');
  if (storedFormData) {
    setFormData(JSON.parse(storedFormData));
  }
}, []);


useEffect(() => {
  const selectedBankObj = banksList.find(b => b.code === selectedBank);
  if (selectedBankObj) {
    setBankSearch(selectedBankObj.name);
  }
}, [selectedBank, banksList]);


    const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file || !user?.username) return;
  
      setImageFile(file);
      const formDataToSend = new FormData();
      formDataToSend.append('image', file);
  
      try {
        const token = await getAccessToken();
        const res = await fetch(`${BASE_URL}/v1/profile-image`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        });
  
        const data = await res.json();
        if (data.success && data.data?.image) {
          let uploadedPath = data.data.image;
  
          if (!uploadedPath.includes('/public/')) {
            uploadedPath = uploadedPath.replace('/upload/', '/public/upload/');
          }
  
          if (!uploadedPath.startsWith('http')) {
            uploadedPath = `https://demo.jadesdev.com.ng${uploadedPath}`;
          }
  
          setPreviewImage(uploadedPath);
  
          // 🔐 Save per-user
          sessionStorage.setItem(`profile_image_url_${user.username}`, uploadedPath);
        } else {
          alert('Image upload failed');
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Error uploading image');
      }
    };
  
    const handleInputChange = e => {
      const { id, value } = e.target;
      setFormData(prev => ({ ...prev, [id]: value }));
    };
  
   
    const handleResendVerification = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(`${BASE_URL}/v1/auth/email/resend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          alert('Verification code sent to your email.');
          setShowVerifyInput(true);
          if (data.code) console.log('📤 Verification code sent:', data.code);
        } else {
          alert(data.message || 'Failed to send verification code.');
          console.error('❌ Resend failed:', data.message);
        }
      } catch (err) {
        console.error('Resend error:', err);
      }
    };
  
    const handleVerifyCode = async () => {
      try {
        const token = await getAccessToken();
        const res = await fetch(`${BASE_URL}/v1/auth/email/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ code: verificationCode }),
        });
        const data = await res.json();
  
        if (data.success) {
          alert('✅ Email verified successfully!');
          // 🔐 Store with username
          sessionStorage.setItem(`email_verified_${user.username}`, '1');
          setUser(prev => ({ ...prev, email_verify: 1 }));
          setShowVerifyInput(false);
          setVerificationCode('');
        } else {
          console.error("❌ Verification failed:", data.message);
          alert(data.message || 'Verification failed.');
        }
      } catch (err) {
        console.error('Verification error:', err);
        alert('Network or server error. Try again.');
      }
    };
  
    const handleChangeMode = async () => {
      try {
        setModeLoading(true);
        const token = await getAccessToken();
        const newMode = user.mode === 'buyer' ? 'seller' : 'buyer';
  
        const res = await fetch(`${BASE_URL}/v1/change-mode`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ mode: newMode }),
        });
        const data = await res.json();
        if (data.success) {
          alert(`Mode changed to ${newMode}`);
          navigate(newMode === 'seller' ? '/seller_dashboard' : '/home');
        } else {
          alert(data.message || 'Failed to change mode');
        }
      } catch (err) {
        console.error('Mode change error:', err);
        alert('Something went wrong. Try again.');
      } finally {
        setModeLoading(false);
      }
    };
  
    const handleSubmit = async e => {
      e.preventDefault();
      try {
        const token = await getAccessToken();
        const payload = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
          username: formData.username,
          gender: formData.gender,
          image: previewImage || formData.image,
          bank_details: [formData.bank_details],
        };
  
        const res = await fetch(`${BASE_URL}/v1/profile`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
  
        const data = await res.json();
        if (data.success) {
          alert('✅ Profile updated successfully.');
          setUser(prev => ({
            ...data.data,
            email_verify: prev.email_verify === 1 ? 1 : data.data.email_verify,
          }));
        } else {
          alert(data.message || 'Profile update failed.');
        }
      } catch (err) {
        console.error('Update error:', err);
      }
    };
  
    if (!user) return <div>Loading profile...</div>;

    console.log("Bank Details:", user?.bank_details);
  console.log("Is Array:", Array.isArray(user?.bank_details));
  
  return (
    <div className="cart-container5">
      <div className="header2">
        <Link to="/seller_profile_settings">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Edit Profile (Seller)</h2>
      </div>
      <div className="chat-ap">
        <div className="pc">
          <div className="profile-pic-container">
            <img
              src={previewImage || formData.image || require('../Components/Assets/pp.jpg')}
              alt="profile"
              className="profile-pic"
            />
            <label className="camera-icon">
              <FaCamera style={{ color: '#fff', fontSize: '25px' }} />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
          <h2 className="header-title3">{user.full_name}</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {['first_name','last_name','username','email','phone'].map(field => (
            <div className="input-group" key={field}>
              <label>{field.replace('_',' ').toUpperCase()}</label>
              <input type="text" id={field} value={formData[field]} onChange={handleInputChange} />
            </div>
          ))}

          <div className="input-group" onClick={() => setShowDropdown(prev => !prev)}>
            <label>Gender</label>
            <input id="gender" type="text" value={currentGender} readOnly />
            <FaChevronDown style={{ position:'absolute', right:'10px', top:'40px' }} />
          </div>
          {showDropdown && (
            <ul className="dropdown-options1">
              {genders.map(g => (
                <li key={g} className="dropdown-option1" onClick={() => {
                  setCurrentGender(g);
                  setFormData(prev => ({ ...prev, gender: g }));
                  setShowDropdown(false);
                }}>{g}</li>
              ))}
            </ul>
          )}

          <div className="editprof-info-card">
            <p><strong>Email Verification:</strong> {user.email_verify === 1 ? 'Verified' : 'Not Verified'}</p>
            {user.email_verify !== 1 && (
              <>
                <button type="button" className="editprof-verify-btn-inline" onClick={handleResendVerification}>Verify Email</button>
                {showVerifyInput && (
                  <div style={{ marginTop:'10px' }}>
                    <input type="text" className="editprof-input-code-box" placeholder="Enter code" value={verificationCode} onChange={e => setVerificationCode(e.target.value)}/>
                    <button type="button" className="editprof-submit-verify-btn" onClick={handleVerifyCode}>Submit Code</button>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="editprof-info-card">
            <p><strong>Mode:</strong> {user.mode}</p>
            <button type="button" className="editprof-verify-btn-inline" onClick={handleChangeMode} disabled={modeLoading}>
              {modeLoading ? 'Switching...' : 'Change Mode'}
            </button>
          </div>

          {[
            ['Role', user.role],
            ['Status', user.status],
            ['Avg Rating', user.avg_rating],
            ['Review Count', user.review_count],
            ['KYC Status', user.kyc_status===1?'Verified':'Not Verified'],
            ['Created At', new Date(user.created_at).toLocaleString()]
          ].map(([label, val]) => (
            <div className="editprof-info-card" key={label}>
              <p><strong>{label}:</strong> {val}</p>
            </div>
          ))}

      <div className="balance-card">
  <h2>Wallet Balance</h2>
  <p>₦{user?.balance || '0.00'}</p>

  <div className="balance-actions">
    <button onClick={() => setShowWithdrawModal(true)} className="withdraw-btn">
      Withdraw
    </button>

    <button onClick={() => setShowHistoryModal(true)} className="history-btn">
      View Withdrawal History
    </button>
  </div>
</div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Withdraw Funds</h2>

    <label>Select Bank</label>
<select
  value={selectedBank?.account_number || ""}
  onChange={(e) => {
    const selectedValue = e.target.value;
    if (selectedValue) {
      setSelectedBank(user.bank_details); // set the single bank details
    } else {
      setSelectedBank(null); // clear selection
    }
  }}
  className="bank-select"
>
  <option value="">-- Choose Bank --</option>
  <option value={user.bank_details.account_number}>
    {user.bank_details.bank_name} - {user.bank_details.account_number}
  </option>
</select>



      <label>Amount</label>
      <input
        type="number"
        placeholder="Enter amount"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
      />

      <div className="modal-actions">
        <button onClick={handleWithdraw}>Submit</button>
        <button onClick={() => setShowWithdrawModal(false)}>Cancel</button>
      </div>
    </div>
  </div>
)}


      {/* Withdrawal History Modal */}
   {showHistoryModal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Your Withdrawal History</h2>
      {withdrawals.length === 0 && <p>No withdrawals yet.</p>}
      <div className="withdrawal-list">
      {withdrawals.map((item, index) => {
  console.log('Withdrawal item:', item); // 👈 add this
  return (
    <div key={index} className="withdrawal-card" onClick={() => handleCardClick(item.id)}>
      <p><strong>Amount:</strong> ₦{item.amount}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Bank:</strong> {item.payment_details?.bank_name || "Not specified"}</p>
<p><strong>Date:</strong> {item.created_at ? new Date(item.created_at).toLocaleString() : "Not available"}</p>
    </div>
  );
})}


      </div>
      <button onClick={closeModal}>Close</button>
    </div>
  </div>
)}

{showDetailModal && selectedWithdrawal && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>Withdrawal Details</h2>
      <p><strong>Amount:</strong> ₦{selectedWithdrawal.amount || "Not available"}</p>
      <p><strong>Status:</strong> {selectedWithdrawal.status || "Not available"}</p>
      <p><strong>Bank:</strong> {selectedWithdrawal.payment_details?.bank_name || "Not specified"}</p>
      <p><strong>Account:</strong> {selectedWithdrawal.payment_details?.account_number || "Not specified"}</p>
      <p><strong>Note:</strong> {selectedWithdrawal.note || "No note provided"}</p>
      <p><strong>Date:</strong> {selectedWithdrawal.created_at ? new Date(selectedWithdrawal.created_at).toLocaleString() : "Not available"}</p>

      <div className="modal-buttons">
        <button onClick={handleDeleteWithdrawal} style={{ backgroundColor: "red", color: "#fff" }}>
          🗑️ Delete
        </button>
        <button onClick={() => {
          setShowDetailModal(false);
          setSelectedWithdrawal(null);
        }}>
          Close
        </button>
      </div>
    </div>
  </div>
)}




    

         <div className="editprof-info-card">
  <div style={{ flex: 1 }}>
    <p style={{ marginBottom: '5px' }}>
      <strong>Bank Details:</strong><br />
      {formData.bank_details || 'Not Provided'}
    </p>
  </div>

  {/* Replace old toggle edit logic with this */}
  <FaEdit
    style={{ cursor: 'pointer' }}
    onClick={() => setShowBankModal(true)}
  />
</div>

          <button type="submit" className="make-payment-button">Save</button>
{showBankModal && (
  <div className="bank-modal-overlay">
    <div className="bank-modal-content">
      <h3>Update Bank Details</h3>

     <label>Bank</label>
<div className="bank-modal-field">
  <input
    type="text"
    placeholder="Search Bank"
    className="bank-modal-input"
    value={bankSearch}
    onChange={(e) => setBankSearch(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter') {
        const match = banksList.find(b => b.name.toLowerCase().includes(bankSearch.toLowerCase()));
        if (match) {
          setSelectedBank(match.code);
          setBankSearch(match.name);
          setShowBankDropdown(false);
        }
      }
    }}
    onFocus={() => setShowBankDropdown(true)}
  />

  {showBankDropdown && bankSearch.length > 0 && (
    <ul className="bank-modal-dropdown">
      {banksList
        .filter((bank) =>
          bank.name.toLowerCase().includes(bankSearch.toLowerCase())
        )
        .map((bank) => (
          <li
            key={bank.code}
            className="bank-modal-dropdown-item"
            onClick={() => {
              setSelectedBank(bank.code);
              setBankSearch(bank.name);
              setShowBankDropdown(false);
            }}
          >
            {bank.name}
          </li>
        ))}
    </ul>
  )}
</div>

      <label>Account Number</label>
      <input
        type="text"
        value={accountNumber}
        maxLength="10"
        onChange={e => setAccountNumber(e.target.value)}
        className="bank-modal-input"
        placeholder="Enter 10-digit account number"
      />

      <button
        type="button"
        className="bank-modal-button"
        onClick={async () => {
          if (!selectedBank || accountNumber.length !== 10) {
            alert('Fill bank and valid account number');
            return;
          }

          try {
            setVerifying(true);
            const token = await getAccessToken();
            const res = await fetch(`${BASE_URL}/v1/bank-accounts/verify?account_number=${accountNumber}&bank_code=${selectedBank}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
              setAccountName(data.data.account_name);
              alert(`✅ Verified: ${data.data.account_name}`);
            } else {
              alert(data.message || 'Verification failed');
            }
          } catch (err) {
            console.error('Verification error:', err);
            alert('Server error verifying account');
          } finally {
            setVerifying(false);
          }
        }}
        disabled={verifying}
      >
        {verifying ? 'Verifying...' : 'Verify Account'}
      </button>

      {accountName && (
        <p style={{ marginTop: '10px' }}>
          <strong>Account Name:</strong> {accountName}
        </p>
      )}

      <button
        className="bank-modal-button"
        onClick={async () => {
          if (!accountName || !selectedBank || !accountNumber) {
            alert('Verify account before saving');
            return;
          }

          try {
            setBankSubmitting(true);
            const token = await getAccessToken();
            const res = await fetch(`${BASE_URL}/v1/bank-accounts`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                account_name: accountName,
                account_number: accountNumber,
                bank_code: selectedBank
              })
            });

            const data = await res.json();
        if (data.success) {
  alert('✅ Bank info updated');

  const updatedBankDetails = `${accountName} - ${accountNumber} - ${banksList.find(b => b.code === selectedBank)?.name}`;

  setFormData(prev => ({
    ...prev,
    bank_details: updatedBankDetails
  }));

  console.log("Bank Details:", user?.bank_details);


  // 🔐 Persist in sessionStorage using username
  const currentUsername = formData?.username || user?.username;
  if (currentUsername) {
    sessionStorage.setItem(`bank_details_${currentUsername}`, updatedBankDetails);
  }

  setShowBankModal(false);
}


 else {
              alert(data.message || 'Failed to update bank');
            }
          } catch (err) {
            console.error('Error saving bank:', err);
            alert('Server error saving bank');
          } finally {
            setBankSubmitting(false);
          }
        }}
        disabled={bankSubmitting}
      >
        {bankSubmitting ? 'Saving...' : 'Save Bank Info'}
      </button>

      <button
        className="bank-modal-close"
        onClick={() => setShowBankModal(false)}
      >
        Cancel
      </button>
    </div>
  </div>
)}

        </form>
      </div>
    </div>
  );
}
