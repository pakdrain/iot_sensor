import { Routes, Route } from "react-router-dom";
import Dashboard from "../modules/dashboard/pages/Dashboard";
import Maintenance from "../modules/maintenance/page/Maintenance";
import Transaction from "../modules/transaction/page/Transaction";
import FeedMill from "../modules/feed_mill/page/FeedMill"; 
import Plant from "../modules/plant/page/Plant"; 
import Shops from "../modules/shops/page/Shops"; 
import Reports from "../modules/reports/page/Reports";
import Transport from "../modules/transport/page/Transport";
import Utilities from "../modules/utilities/page/Utilities";
import Auditors from "../modules/auditors/page/Auditors";
import GeneralLedger from "../modules/maintenance/submodules/general_ledger/page/GeneralLedger";
import Fiscal_Year from "../modules/maintenance/submodules/general_ledger/categories/fiscal_year/Fiscal_Year";
import FiscalYearClose from "../modules/maintenance/submodules/general_ledger/categories/fiscal_year_close/Fiscal_Year_Close";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/maintenance" element={<Maintenance />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/feedMill" element={<FeedMill />} />
      <Route path="/plant" element={<Plant />} />
      <Route path="/shops" element={<Shops />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/transport" element={<Transport />} />
      <Route path="/utilities" element={<Utilities />} />
      <Route path="/auditors" element={<Auditors />} />
      <Route path="/maintenance/general-ledger" element={<GeneralLedger />} />
      <Route path="/maintenance/general-ledger/fiscal-year" element={<Fiscal_Year />} />
      <Route path="/maintenance/general-ledger/fiscal-year-close" element={<FiscalYearClose />} />

    </Routes>
  );
};

export default AppRoutes;