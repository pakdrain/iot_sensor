// src/modules/transport/components/TransportSubModuleCard.jsx
import { useState } from "react";

const TransportSubModuleCard = ({ title, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="bg-primary rounded-xl border-2 border-gray-200 py-6 px-2 flex flex-col items-center justify-center text-center hover:shadow-lg transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Icon with circular background */}
      <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-gray-100">
        <img 
          src={icon} 
          alt={title} 
          className="w-12 h-12 object-contain"
        />
      </div>

      {/* Title */}
      <h3 className="font-[600] font-sans text-secondary text-sm mb-1">
        {title}
      </h3>
    </div>
  );
};

export default TransportSubModuleCard;