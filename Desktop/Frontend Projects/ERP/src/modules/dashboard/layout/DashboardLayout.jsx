import React from "react";
import bgImage from "../../../assets/images/bg_image_one.png"; 

const DashboardLayout = ({ children }) => {
  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${bgImage})`,  
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'  
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-primary/60 z-0"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;