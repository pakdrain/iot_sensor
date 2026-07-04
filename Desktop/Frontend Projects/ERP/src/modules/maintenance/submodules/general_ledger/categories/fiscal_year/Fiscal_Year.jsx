import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../../../dashboard/layout/DashboardLayout";
import Header from "../../../../../dashboard/components/Header";
import backIcon from "../../../../../../assets/icons/btn_back.png";
import fiscalYearIcon from "../../../../../../assets/icons/maintenance_icons/fiscal_year.png";
import BtnSave from "../../../../../../ui/buttons/btn_save";
import BtnExit from "../../../../../../ui/buttons/btn_exit";
import { fiscalYearAPI } from "../../../../../../services/api's/fiscalYearAPI";
import CustomLoading from "../../../../../../ui/loading/CustomLoading";

const Fiscal_Year = () => {
  const navigate = useNavigate();
  const [fiscalYear, setFiscalYear] = useState("");
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleBackClick = () => {
    navigate("/maintenance/general-ledger");
  };

  const handleFiscalYearChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setFiscalYear(value);
      setError("");
      
      // Validate length
      if (value.length > 0 && value.length !== 4) {
        setError("Enter correct fiscal year (e.g., 2030)");
      }
      if (value.length === 4) {
        setError("");
      }
    }
  };

  const handleSave = async () => {
    if (fiscalYear.length !== 4) {
      setError("Please enter a valid 4-digit fiscal year");
      return;
    }
    
    setLoading(true);
    try {
      // Calling the Fiscal Year API 
      const response = await fiscalYearAPI.createFiscalYear(fiscalYear);
      
      if (response.data.success) {
        console.log("Fiscal Year saved:", response.data.data);
        navigate("/maintenance/general-ledger");
      } else {
        setError(response.data.error || "Failed to save fiscal year");
      }
    } catch (err) {
      console.error("Error saving fiscal year:", err);
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Something went wrong");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    navigate("/maintenance/general-ledger");
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate("/maintenance/general-ledger");
  };

  if (!isOpen) return null;

  const getBorderColor = () => {
    if (error) return "border-red-500";
    if (fiscalYear.length === 4) return "border-green-500";
    return "border-gray-300";
  };

  return (
    <DashboardLayout>
      <Header />
      {loading && <CustomLoading />}
      <div className="px-2 sm:px-2 md:px-4 lg:px-6 mt-4">
        {/* Back Button and Title Section */}
        <div className="flex items-center gap-2 mb-6 animate-slide-in-slow">
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
          > Fiscal Year
          </h2>
        </div>

        {/* Stylish Modal/Popup */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/20 backdrop-blur-xs animate-fade-in px-10">
          <div className="relative w-full max-w-md mx-auto">
            {/* Modal Content */}
            <div className="relative bg-primary overflow-hidden">
              {/* Decorative Top Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-rose-500"></div>
              {/* Header */}
              <div className="px-6 pt-4">
                <div className="flex items-center justify-center gap-3">
                  <div>
                    <h3 className="text-lg font-semibold font-inter text-secondary">Fiscal Year</h3>
                  </div>
                </div>
              </div>
              {/* Body */}
              <div className="px-4 py-4">
                <div className="space-y-4">
                  {/* Fiscal Year Input */}
                  <div>
                    <label className="block text-sm font-[600] text-secondary font-inter mb-2">
                      Fiscal Year <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fiscalYear}
                        onChange={handleFiscalYearChange}
                        placeholder="Enter Fiscal Year"
                        maxLength={4}
                        disabled={loading}
                        className={`w-full px-4 py-3 border-2 focus:outline-none bg-primary text-secondary font-poppins text-sm transition-all duration-200 ${getBorderColor()} focus:${fiscalYear.length === 4 ? 'border-green-500' : 'border-red-400'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <img 
                          src={fiscalYearIcon} 
                          alt="calendar" 
                          className="w-5 h-5 object-contain opacity-70"
                        />
                      </div>
                    </div>
                    {error && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer with Buttons */}
              <div className="px-6 py-2 border-t border-gray-200 flex justify-end gap-3">
                <BtnExit onClick={handleExit} disabled={loading} />
                <BtnSave onClick={handleSave} disabled={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Fiscal_Year;