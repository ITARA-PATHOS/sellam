import React from "react";
import "./CSS/Splash.css";
import { Link } from 'react-router-dom';
//import ResponsiveMasonry from "react-responsive-masonry";
import product_6 from "../Components/Assets/product_6.png";
import product_7 from "../Components/Assets/product_7.png";
import product_8 from "../Components/Assets/product_8.png";
import product_9 from "../Components/Assets/product_9.png";
import product_10 from "../Components/Assets/product_10.png";
import product_11 from "../Components/Assets/product_11.png";
import product_12 from "../Components/Assets/product_12.png";
import product_13 from "../Components/Assets/product_13.png";
import product_14 from "../Components/Assets/product_14.png";
import product_15 from "../Components/Assets/product_15.png";


const Splash = () => {
  const images = [
    product_6,
    product_7,
    product_8,
    product_9,
    product_10,
    product_11,
    product_12,
    product_13,
    product_14,
    product_15
  ];

  return (
    <div className="container">
      <div className="masonry-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`masonry-item item${index + 1}`}
            style={{ backgroundImage: `url(${image})` }}
          />
        ))}
      </div>
      <div className="text-container">
       <div className="text">
        <p>Shop securely. Sell effortlessly.</p>
        <h2>Discover Amazing Deals On Pre-Loved Treasures</h2></div>
        <Link style={{ width:'100%' }} to='/login'><button className="get-started-btn">Get Started</button></Link>
        
      </div>
    </div>
  );
};

export default Splash;
