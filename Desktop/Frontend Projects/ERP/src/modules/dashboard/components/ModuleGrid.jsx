import ModuleCard from "./ModuleCard";
import maintenanceIcon from "../../../assets/icons/modules/maintenance.png";
import transactionsIcon from "../../../assets/icons/modules/transactions.png";
import feedMillIcon from "../../../assets/icons/modules/feed_mill.png";
import plantIcon from "../../../assets/icons/modules/plant.png";
import shopIcon from "../../../assets/icons/modules/shop.png";
import reportsIcon from "../../../assets/icons/modules/reports.png";
import transportIcon from "../../../assets/icons/modules/transport.png";
import utilitiesIcon from "../../../assets/icons/modules/utilities.png";
import auditorsIcon from "../../../assets/icons/modules/auditors.png";
import securityIcon from "../../../assets/icons/modules/security.png";
const modules = [
  {
    title: "Maintenance",
    icon: maintenanceIcon,
  },
  {
    title: "Transactions",
    icon: transactionsIcon,
  },
  {
    title: "Feed Mill",
    icon: feedMillIcon,
  },
  {
    title: "Plant",
    icon: plantIcon,
  },
  {
    title: "Shops",
    icon: shopIcon,
  },
  {
    title: "Reports",
    icon: reportsIcon,
  },
  {
    title: "Transport",
    icon: transportIcon,
  },
  {
    title: "Utilities",
    icon: utilitiesIcon,
  },
  {
    title: "Auditors",
    icon: auditorsIcon,
  },
  {
    title: "Security",
    icon: securityIcon,
  },
];

const ModuleGrid = ({ onModuleClick }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-4 mt-4">
      {modules.map((mod, index) => (
        <div key={index} onClick={() => onModuleClick(mod.title)}>
          <ModuleCard {...mod} />
        </div>
      ))}
    </div>
  );
};

export default ModuleGrid;