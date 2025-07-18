import React, { useEffect, useState } from 'react';
import './CSS/EditProfile.css';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaChevronDown, FaCamera, FaEdit } from 'react-icons/fa';
import { getAccessToken } from '../utils/token';
import pp from '../Components/Assets/pp.jpg';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [currentGender, setCurrentGender] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showVerifyInput, setShowVerifyInput] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [bankEdit, setBankEdit] = useState(false);
  const [bankInput, setBankInput] = useState('');
  const [modeLoading, setModeLoading] = useState(false);

  const navigate = useNavigate();

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
          setFormData({
            first_name: updatedUser.first_name || '',
            last_name: updatedUser.last_name || '',
            email: updatedUser.email || '',
            phone: updatedUser.phone || '',
            gender: updatedUser.gender || '',
            username: updatedUser.username || '',
            image: updatedUser.image || '',
            bank_details: updatedUser.bank_details?.[0] || '',
          });
          setBankInput(updatedUser.bank_details?.[0] || '');

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

  const handleBankEditSubmit = () => {
    setFormData(prev => ({ ...prev, bank_details: bankInput }));
    setBankEdit(false);
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
  void imageFile;

  return (
    <div className="cart-container5">
      <div className="header2">
        <Link to="/account_settings">
          <FaArrowLeft className="back-icon2" />
        </Link>
        <h2 className="header-title3">Edit Profile</h2>
      </div>

      <div className="chat-ap">
        <div className="pc">
          <div className="profile-pic-container">
            <img
              src={previewImage || pp}
              alt="profile"
              className="profile-pic"
            />
            <label className="camera-icon">
              <FaCamera style={{ color: '#fff', fontSize: '25px' }} />
              <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
            </label>
          </div>
          <h2 className="header-title3">
            {user.full_name || `${user.first_name} ${user.last_name}`}
          </h2>
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
            <input type="text" id="gender" value={currentGender} readOnly />
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
            <p><strong>Email Verification:</strong> {user.email_verify === 1 ? 'Verified ✅' : 'Not Verified ❌'}</p>
            {user.email_verify !== 1 && <>
              <button type="button" className="editprof-verify-btn-inline" onClick={handleResendVerification}>
                Verify Email
              </button>
              {showVerifyInput && (
                <div style={{ marginTop:'10px' }}>
                  <input type="text" placeholder="Enter code" className="editprof-input-code-box"
                    value={verificationCode} onChange={e => setVerificationCode(e.target.value)} />
                  <button type="button" className="editprof-submit-verify-btn" onClick={handleVerifyCode}>
                    Submit Code
                  </button>
                </div>
              )}
            </>}
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
            ['KYC Status', user.kyc_status === 1 ? 'Verified' : 'Not Verified'],
            ['Balance', `₦${user.balance || '0.00'}`],
            ['Created At', new Date(user.created_at).toLocaleString()]
          ].map(([label, val]) => (
            <div className="editprof-info-card" key={label}><p><strong>{label}:</strong> {val}</p></div>
          ))}

          <div className="editprof-info-card">
            <div style={{ flex: 1 }}>
              <p style={{ marginBottom:'5px' }}>
                <strong>Bank Details:</strong> {formData.bank_details || 'Not Provided'}
              </p>
              {bankEdit && (
                <div className="bank-edit-container">
                  <input type="text" value={bankInput} onChange={e => setBankInput(e.target.value)}
                    className="editprof-input-code-box" />
                  <button type="button" onClick={handleBankEditSubmit} className="editprof-submit-verify-btn">
                    Save
                  </button>
                </div>
              )}
            </div>
            <FaEdit style={{ cursor:'pointer' }} onClick={() => setBankEdit(prev => !prev)} />
          </div>

          <button type="submit" className="make-payment-button">Save</button>
        </form>
      </div>
    </div>
  );
}
