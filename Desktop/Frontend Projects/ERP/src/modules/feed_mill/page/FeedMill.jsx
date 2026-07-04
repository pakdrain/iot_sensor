import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../dashboard/layout/DashboardLayout"; 
import Header from "../../dashboard/components/Header";
import FeedMillSubModuleCard from "../components/FeedMillSubModuleCard";
import backIcon from "../../../assets/icons/btn_back.png";
import generalLedgerIcon from "../../../assets/icons/maintenance_icons/general_ledger.png";
import cashManagementIcon from "../../../assets/icons/transaction_icons/cash_management.png";
import accountsReceiveableIcon from "../../../assets/icons/transaction_icons/accounts_receiveable.png";
import accountPayableIcon from "../../../assets/icons/maintenance_icons/account_payable.png";
import purchaseIcon from "../../../assets/icons/maintenance_icons/purchase.png";
import feedDeliverIcon from "../../../assets/icons/feed_mill/feed_deliver.png";
import inventoryIcon from "../../../assets/icons/maintenance_icons/inventory.png";
import salesIcon from "../../../assets/icons/maintenance_icons/sales.png";
import gateOfficeIcon from "../../../assets/icons/transaction_icons/gate_office.png";
import costingIcon from "../../../assets/icons/feed_mill/costing.png";
import productionIcon from "../../../assets/icons/transaction_icons/production.png";
import projectManagementIcon from "../../../assets/icons/transaction_icons/project-management.png";

const subModules = [
  {
    title: "General Ledger",
    icon: generalLedgerIcon,
  },
  {
    title: "Cash Management",
    icon: cashManagementIcon, 
  },
  {
    title: "Accounts Receiveable",
    icon: accountsReceiveableIcon,
  },
  {
    title: "Account Payable",
    icon: accountPayableIcon,
  },
  {
    title: "Purchase",
    icon: purchaseIcon,
  },
  {
    title: "Feed Deliver",
    icon: feedDeliverIcon, 
  },
  {
    title: "Inventory",
    icon: inventoryIcon,
  },
  {
    title: "Sales",
    icon: salesIcon,
  },
  {
    title: "Gate Office",
    icon: gateOfficeIcon, 
  },
  {
    title: "Costing",
    icon: costingIcon, 
  },
  {
    title: "Production",
    icon: productionIcon, 
  },
  {
    title: "Project Management",
    icon: projectManagementIcon, 
  },
];

const FeedMill = () => {
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
            Feed Mill
          </h2>
        </div>

        {/* Sub Modules Grid */}
        <div className="animate-fade-in-up-slow">
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3">
            {subModules.map((mod, index) => (
              <div key={index} onClick={() => handleSubModuleClick(mod.title)}>
                <FeedMillSubModuleCard {...mod} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default FeedMill;