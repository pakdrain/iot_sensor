// src/modules/maintenance/submodules/general_ledger/page/GeneralLedger.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../../dashboard/layout/DashboardLayout"; 
import Header from "../../../../dashboard/components/Header";
import GeneralLedgerSubModuleCard from "../components/GeneralLedgerSubModuleCard";
import backIcon from "../../../../../assets/icons/btn_back.png";
import fiscalYearIcon from "../../../../../assets/icons/maintenance_icons/fiscal_year.png";
import glPeriodIcon from "../../../../../assets/icons/maintenance_icons/gl_period.png";
import branchIcon from "../../../../../assets/icons/maintenance_icons/branch.png";
import branchSheetIcon from "../../../../../assets/icons/maintenance_icons/branch_sheet.png";
import companyIcon from "../../../../../assets/icons/maintenance_icons/company.png";
import uploadChartOfAccountIcon from "../../../../../assets/icons/maintenance_icons/upload_chart_of_account.png";
import chartOfAccountIcon from "../../../../../assets/icons/maintenance_icons/chart_of_account.png";
import bankIcon from "../../../../../assets/icons/maintenance_icons/bank.png";
import subAccountCodeIcon from "../../../../../assets/icons/maintenance_icons/sub_account_code.png";
import partyOpeningBalanceIcon from "../../../../../assets/icons/maintenance_icons/party_opening_balance.png";

const categories = [
  {
    title: "Fiscal Year",
    icon: fiscalYearIcon,
  },
  {
    title: "Fiscal Year Close",
    icon: fiscalYearIcon,
  },
  {
    title: "Fiscal Year Reopen",
    icon: fiscalYearIcon,
  },
  {
    title: "GL Periods",
    icon: glPeriodIcon,
  },
  {
    title: "Branch",
    icon: branchIcon,
  },
  {
    title: "Balance Sheet",
    icon: branchSheetIcon,
  },
  {
    title: "Company",
    icon: companyIcon,
  },
  {
    title: "Upload Chart of Account",
    icon: uploadChartOfAccountIcon,
  },
  {
    title: "Chart of Account",
    icon: chartOfAccountIcon,
  },
  {
    title: "Banks",
    icon: bankIcon,
  },
  {
    title: "Sub Account Code",
    icon: subAccountCodeIcon,
  },
  {
    title: "Party Opening Balances",
    icon: partyOpeningBalanceIcon,
  },
];

const GeneralLedger = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/maintenance");
  };

  const handleCategoryClick = (categoryTitle) => {
    console.log(`Clicked on category: ${categoryTitle}`);
    
    if (categoryTitle === "Fiscal Year") {
    navigate("/maintenance/general-ledger/fiscal-year");
  }
   if (categoryTitle === "Fiscal Year Close") {
    navigate("/maintenance/general-ledger/fiscal-year-close");
  }
  if (categoryTitle === "Fiscal Year Reopen") {
    navigate("/maintenance/general-ledger/fiscal-year-reopen");
  }
  if (categoryTitle === "GL Periods") {
    navigate("/maintenance/general-ledger/gl-periods");
  }
  if (categoryTitle === "Branch") {
    navigate("/maintenance/general-ledger/branch");
  }
  if (categoryTitle === "Balance Sheet") {
    navigate("/maintenance/general-ledger/balance-sheet");
  }
  if (categoryTitle === "Company") {
    navigate("/maintenance/general-ledger/company");
  }
  if (categoryTitle === "Upload Chart of Account") {
    navigate("/maintenance/general-ledger/upload-chart-of-account");
  }
  if (categoryTitle === "Chart of Account") {
    navigate("/maintenance/general-ledger/chart-of-account");
  }
  if (categoryTitle === "Banks") {
    navigate("/maintenance/general-ledger/banks");
  }
  if (categoryTitle === "Sub Account Code") {
    navigate("/maintenance/general-ledger/sub-account-code");
  }
  if (categoryTitle === "Party Opening Balances") {
    navigate("/maintenance/general-ledger/party-opening-balances");
  }
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
            General Ledger
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="animate-fade-in-up-slow">
          <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4">
            {categories.map((cat, index) => (
              <div key={index} onClick={() => handleCategoryClick(cat.title)}>
                <GeneralLedgerSubModuleCard title={cat.title} icon={cat.icon} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default GeneralLedger;