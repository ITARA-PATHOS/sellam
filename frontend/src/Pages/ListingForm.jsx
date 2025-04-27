import React from 'react';
import './CSS/ListingForm.css';
import { FaPlus, FaArrowLeft, } from "react-icons/fa";
import { Link } from 'react-router-dom';
import up from '../Components/Assets/up.PNG'




const ListingForm = () => {
  return (
    <div className="listing-form">
    {/* Header */}
    <div className="header2">
                                <Link to="/seller_dashboard">
                                      <FaArrowLeft className="back-icon2" />
                                    </Link>
                                    <h2 className="header-title3">Listing Form</h2>
                                </div>
                                <br></br>
                                <div className="chat-ap">

    <form>
      <label className='sow'>Product Title</label>
      <input type="text" placeholder="Name of product" />

      <label className='sow'>Category</label>
      <select>
        <option>Select a Category</option>
      </select>

      <label className='sow'>Description</label>
      <textarea placeholder="Details about product"></textarea>

      <label className='sow'>Price</label>
      <div className="price-input">
        <input type="text" placeholder="2,000,000" />
        <div className="currency">
        <h3 >
           ₦ 
        </h3>
        NGN
        </div>
      </div>

      <label className='sow'>Location</label>
      <div className="location-input">
        <input type="text" placeholder="Enter your Location" />
      </div>

      <label className='sow'>Images</label>
      <div className="image-upload">
                <img src={up} alt="odel" className="" />
      
        <p>Browse and choose the files you want to upload from your computer</p>
        <button type="button" className="upload-btn">
          <FaPlus />
        </button>
      </div>

      <label className="sow">Condition</label>
      
      <div className="conditions">
  <label className="checkbox-label2">
    <h4>New</h4>
    <div className="checkbox-container">
      <input type="checkbox" className="payin2" />
      <span className="custom-checkbox2"></span>
    </div>
  </label>
  <label className="checkbox-label2">
    <h4>Used</h4>
    <div className="checkbox-container">
      <input type="checkbox" className="payin2" />
      <span className="custom-checkbox2"></span>
    </div>
  </label>
  <label className="checkbox-label2">
    <h4>Fairly Used</h4>
    <div className="checkbox-container">
      <input type="checkbox" className="payin2" />
      <span className="custom-checkbox2"></span>
    </div>
  </label>
</div>


    <Link to="/items_list" style={{ textDecoration: "none" }}>
      <button type="submit" className="submit-btn3">Submit</button></Link>
    </form>
  </div>
  </div>

  )
}

export default ListingForm
