// src/modules/maintenance/submodules/general_ledger/page/Fiscal_Year_Close.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../../../../dashboard/layout/DashboardLayout";
import Header from "../../../../../dashboard/components/Header";
import backIcon from "../../../../../../assets/icons/btn_back.png";
import fiscalYearIcon from "../../../../../../assets/icons/maintenance_icons/fiscal_year.png";
import BtnSave from "../../../../../../ui/buttons/btn_save";
import BtnExit from "../../../../../../ui/buttons/btn_exit";
import { fiscalYearCloseAPI } from "../../../../../../services/api's/fiscalYearCloseAPI";
import CustomLoading from "../../../../../../ui/loading/CustomLoading";

const Fiscal_Year_Close = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [fiscalYear, setFiscalYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [fiscalYearError, setFiscalYearError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBackClick = () => {
    navigate("/maintenance/general-ledger");
  };

  const handleFiscalYearChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setFiscalYear(value);
      if (value.length === 4) {
        setFiscalYearError("");
      } else if (value.length > 0 && value.length !== 4) {
        setFiscalYearError("Enter correct fiscal year (e.g., 2030)");
      } else {
        setFiscalYearError("");
      }
    }
  };

  const handleStartDateChange = (e) => {
    const value = e.target.value;
    setStartDate(value);
    if (value) {
      setStartDateError("");
    }
  };

  const handleEndDateChange = (e) => {
    const value = e.target.value;
    setEndDate(value);
    if (value) {
      setEndDateError("");
    }
  };

  const handleSave = async () => {
  let hasError = false;
  
  if (fiscalYear.length !== 4) {
    setFiscalYearError("Enter correct fiscal year (e.g., 2030)");
    hasError = true;
  }
  if (!startDate) {
    setStartDateError("Please select start date");
    hasError = true;
  }
  if (!endDate) {
    setEndDateError("Please select end date");
    hasError = true;
  }
  if (hasError) return;
  setLoading(true);
  try {
    const response = await fiscalYearCloseAPI.createFiscalYearClose(fiscalYear, startDate, endDate);
    
    if (response.data.success) {
      setLoading(false);
      navigate("/maintenance/general-ledger");
    }
  } catch (error) {
    setLoading(false);
    if (error.response?.data?.error) {
      if (error.response.data.error.includes("Fiscal year")) {
        setFiscalYearError(error.response.data.error);
      } else if (error.response.data.error.includes("Start date")) {
        setStartDateError(error.response.data.error);
      } else if (error.response.data.error.includes("End date")) {
        setEndDateError(error.response.data.error);
      }
    }
  }
};

  const handleExit = () => {
    navigate("/maintenance/general-ledger");
  };

  const handleModalClose = () => {
    setIsOpen(false);
    navigate("/maintenance/general-ledger");
  };

  const getFiscalYearBorder = () => {
    if (fiscalYearError) return "border-red-500";
    if (fiscalYear.length === 4) return "border-green-500";
    return "border-gray-300";
  };

  const getStartDateBorder = () => {
    if (startDateError) return "border-red-500";
    if (startDate) return "border-green-500";
    return "border-gray-300";
  };

  const getEndDateBorder = () => {
    if (endDateError) return "border-red-500";
    if (endDate) return "border-green-500";
    return "border-gray-300";
  };

  if (!isOpen) return null;

  return (
    <DashboardLayout>
      <Header />
      {loading && <CustomLoading />}
      <div className="px-2 sm:px-2 md:px-4 lg:px-6 mt-4">
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
          >Fiscal Year Close
          </h2>
        </div>

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondary/20 backdrop-blur-xs animate-fade-in px-10">
          <div className="relative w-full max-w-md mx-auto">
            <div className="relative bg-primary overflow-hidden">              
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-600 to-rose-500"></div>
              <div className="px-6 pt-4">
                <div className="flex items-center justify-center gap-3">
                  <div>
                    <h3 className="text-lg font-semibold font-inter text-secondary">Fiscal Year Close</h3>
                  </div>
                </div>
              </div>
              <div className="px-4 py-4">
                <div className="space-y-4">
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
                        className={`w-full px-4 py-3 border-2 focus:outline-none bg-primary text-secondary font-poppins text-sm  ${getFiscalYearBorder()} focus:${fiscalYear.length === 4 ? 'border-green-500' : 'border-red-400'}`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <img 
                          src={fiscalYearIcon} 
                          alt="calendar" 
                          className="w-5 h-5 object-contain opacity-70"
                        />
                      </div>
                    </div>
                    {fiscalYearError && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {fiscalYearError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-[600] text-secondary font-inter mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      className={`w-full px-4 py-3 border-2 focus:outline-none bg-primary text-secondary font-poppins text-sm ${getStartDateBorder()} focus:border-red-400`}
                    />
                    {startDateError && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {startDateError}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-[600] text-secondary font-inter mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      className={`w-full px-4 py-3 border-2 focus:outline-none bg-primary text-secondary font-poppins text-sm ${getEndDateBorder()} focus:border-red-400`}
                    />
                    {endDateError && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {endDateError}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-4">
                <BtnExit onClick={handleExit} />
                <BtnSave onClick={handleSave} disabled={loading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Fiscal_Year_Close;