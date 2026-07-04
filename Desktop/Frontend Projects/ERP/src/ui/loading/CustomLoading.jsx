import React from "react";
import logo from "/src/assets/images/logo_sabir.png";

const CustomLoading = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 ">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-t-red-500 border-r-red-500 border-b-transparent border-l-transparent animate-spin"></div>
        <div className="absolute inset-[4px] bg-white rounded-full"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <img src={logo} alt="" className="w-14 h-14 object-contain" />
        </div>
      </div>
    </div>
  );
};

export default CustomLoading;