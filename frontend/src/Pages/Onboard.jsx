import React, { useState } from "react";
import './CSS/Onboard.css';
import product_7 from "../Components/Assets/product_7.png";
import product_11 from "../Components/Assets/product_11.png";
import product_13 from "../Components/Assets/product_13.png";
import { FiArrowRight } from 'react-icons/fi'; // Import the arrow icon


const onboardingData = [
  {
    title: "Welcome To Sellam.Online!",
    description:
      "Your trusted marketplace for second-hand treasures and local artisan crafts.",
    image: product_7, // Replace with actual image paths
  },
  {
    title: "Explore And Connect",
    description: "Find what you need, right where you are.",
    image: product_13, // Replace with actual image paths
  },
  {
    title: "Easy Listing Process",
    description: "Turn your items into cash in a few simple steps.",
    image: product_11, // Replace with actual image paths
  },
];

function Onboard() {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const handleNext = () => {
        if (currentIndex < onboardingData.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          // Redirect to the page when on the last slide
          window.location.href = "/modeselect"; // Replace with your desired page route
        }
      };
    
      
    
      // Helper function to calculate circular indices
      const getLeftIndex = (index) => {
        return index === 0 ? onboardingData.length - 1 : index - 1;
      };
    
      const getRightIndex = (index) => {
        return index === onboardingData.length - 1 ? 0 : index + 1;
      };
    
      return (
        <div className="onboarding-container">
          <div className="slider1">
            <div className="slide1">
            <div className="text-content">
                <h1>{onboardingData[currentIndex].title}</h1>
                <p>{onboardingData[currentIndex].description}</p>
              </div>
              <div className="image-group1">
                {/* Left Smaller Image */}
                <img
                  src={onboardingData[getLeftIndex(currentIndex)].image}
                  alt="left side"
                  className="side-image"
                />
                {/* Main Image */}
                <img
                  src={onboardingData[currentIndex].image}
                  alt={`slide-${currentIndex}`}
                  className="main-image"
                />
                {/* Right Smaller Image */}
                <img
                  src={onboardingData[getRightIndex(currentIndex)].image}
                  alt="right side"
                  className="side-image"
                />
              </div>
              
            </div>
          </div>
    
          {/* Pagination Bar */}
          <div className="pagination">
            {onboardingData.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
              ></span>
            ))}
          </div>
    
          {/* Next Button */}
          <button className="next-button" onClick={handleNext}>
        <FiArrowRight className="arrow-icon" />
        </button>
        </div>
      );
  }
  

export default Onboard;
