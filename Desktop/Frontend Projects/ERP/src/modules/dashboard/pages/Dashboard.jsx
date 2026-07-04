import DashboardLayout from "../layout/DashboardLayout";
import Header from "../components/Header";
import ModuleGrid from "../components/ModuleGrid";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleModuleClick = (moduleTitle) => {
    if (moduleTitle === "Maintenance") {
      navigate("/maintenance");
    }
    if (moduleTitle === "Transactions") {
      navigate("/transaction");
    }
    if (moduleTitle === "Feed Mill") {
      navigate("/feedmill");
    }
    if (moduleTitle === "Plant") {
      navigate("/plant");
    }
    if (moduleTitle === "Shops") {
      navigate("/shops");
    }
    if (moduleTitle === "Reports") {
      navigate("/reports");
    }
    if (moduleTitle === "Transport") {
      navigate("/transport");
    }
    if (moduleTitle === "Utilities") {
      navigate("/utilities");
    }
    if (moduleTitle === "Auditors") {
      navigate("/auditors");
    }
  };

  return (
    <DashboardLayout>
      <Header />

      <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 120px)' }}>
        <div className="flex-1 px-2 sm:px-2 md:px-4 lg:px-6">
          {/* Module Grid with animation */}
          <div className="animate-fade-in-up-slow">
            <ModuleGrid onModuleClick={handleModuleClick} />
          </div>
        </div>

        {/* Footer Link - Bottom Center */}
        <div className="py-6 text-center">
          <a
            href="https://metasage.net/"
            target="_blank"
            rel="noopener noreferrer"
           className="text-gray-400 text-sm font-medium inline-flex items-center gap-1 group"
          > Powered by MetaSage
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;