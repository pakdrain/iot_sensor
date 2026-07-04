// src/modules/auditors/page/Auditors.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../dashboard/layout/DashboardLayout"; 
import Header from "../../dashboard/components/Header";
import AuditorsSubModuleCard from "../components/AuditorsSubModuleCard";
import backIcon from "../../../assets/icons/btn_back.png";
import generalLedgerIcon from "../../../assets/icons/maintenance_icons/general_ledger.png";

const subModules = [
  {
    title: "General Ledger",
    icon: generalLedgerIcon,
  },
];

const Auditors = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/");
  };

  const handleSubModuleClick = (subModuleTitle) => {
    console.log(`Clicked on: ${subModuleTitle}`);
  };

  return (
    <DashboardLayout>
      <Header />

      <div className="px-2 sm:px-2 md:px-4 lg:px-6 mt-4">
        {/* Back Button and Title Section */}
        <div className="flex items-center gap-2 mb-4 animate-slide-in-slow">
          <button
            onClick={handleBackClick}
            className="hover:opacity-80 transition-opacity duration-200 group"
          >
            <img 
              src={backIcon} 
              alt="Back" 
              className="w-7 h-7 object-contain group-hover:-translate-x-1 transition-transform duration-200"
            />
          </button>
          
          <h2 
            onClick={handleBackClick}
            className="text-lg font-[600] font-poppins text-redColor cursor-pointer hover:opacity-80 transition-opacity duration-200"
          >
            Auditors
          </h2>
        </div>

        {/* Sub Modules Grid */}
        <div className="animate-fade-in-up-slow">
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
            {subModules.map((mod, index) => (
              <div key={index} onClick={() => handleSubModuleClick(mod.title)}>
                <AuditorsSubModuleCard {...mod} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Auditors;