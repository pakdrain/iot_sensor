import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Globe, Smartphone, Monitor } from "lucide-react";
import aifaPetrolAPI from "../../api/aifa_petrol_api";
import metafixAPI from "../../api/metafix_api";

// Function to convert time string (HH:MM:SS) to seconds
const timeToSeconds = (timeStr) => {
  if (!timeStr || timeStr === '00:00:00') return 0;
  const parts = timeStr.split(':');
  if (parts.length === 3) {
    return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  }
  return 0;
};

// Function to convert seconds to HH:MM:SS
const secondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Function to format numbers with K/M suffix
const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Map project name to icon and type
const getProjectMetadata = (projectName) => {
  if (projectName === "Aifa_Petrol" || projectName === "Aifa Petrol") {
    return {
      icon: Globe,
      type: "WEB",
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    };
  }
  if (projectName === "Metafix") {
    return {
      icon: Globe,
      type: "WEB & APP",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
    };
  }
  return {
    icon: Globe,
    type: "WEB",
    iconColor: "text-gray-500",
    iconBg: "bg-gray-50",
  };
};

export default function TopProjects({ projectName = "Aifa Petrol", dateRange, className = "" }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllProjectsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let allProjectsData = [];
        
        // Fetch data from both APIs to get all projects
        const fetchAifaPetrol = async () => {
          try {
            const response = await aifaPetrolAPI.getProjectSession();
            if (response && response.success && response.data) {
              const grandTotal = response.data.find(item => item.session_date === 'Grand Total');
              const last30DaysData = response.data.filter(item => 
                item.session_date !== 'Grand Total'
              );
              
              const totalActiveUsers = last30DaysData.reduce((sum, item) => {
                return sum + (parseInt(item.active_users) || 0);
              }, 0);
              
              const totalDurationSeconds = last30DaysData.reduce((sum, item) => {
                return sum + timeToSeconds(item.total_duration);
              }, 0);
              
              const totalDurationFormatted = secondsToTime(totalDurationSeconds);
              
              const metadata = getProjectMetadata("Aifa Petrol");
              
              return {
                name: "Aifa Petrol",
                displayName: "Aifa Petrol",
                type: metadata.type,
                icon: metadata.icon,
                iconColor: metadata.iconColor,
                iconBg: metadata.iconBg,
                active: totalActiveUsers.toString(),
                mau: grandTotal?.mau || "00:00:00",
                totalDuration: totalDurationFormatted,
                totalDurationSeconds: totalDurationSeconds, 
                activeUsersCount: totalActiveUsers,
              };
            }
            return null;
          } catch (err) {
            console.error('Failed to fetch Aifa Petrol:', err);
            return null;
          }
        };
        
        const fetchMetafix = async () => {
          try {
            const response = await metafixAPI.getProjectSession();
            if (response && response.success && response.data) {
              const projectData = response.data.find(item => item.project_name === 'Metafix');
              const grandTotal = response.data.find(item => item.project_name === '');
              const last30DaysData = response.data.filter(item => 
                item.project_name === 'Metafix' && item.session_date !== ''
              );
              
              const totalActiveUsers = last30DaysData.reduce((sum, item) => {
                return sum + (parseInt(item.active_users) || 0);
              }, 0);
              
              const totalDurationSeconds = last30DaysData.reduce((sum, item) => {
                return sum + timeToSeconds(item.total_duration);
              }, 0);
              
              const totalDurationFormatted = secondsToTime(totalDurationSeconds);
              
              const metadata = getProjectMetadata("Metafix");
              
              return {
                name: "Metafix",
                displayName: "Metafix",
                type: metadata.type,
                icon: metadata.icon,
                iconColor: metadata.iconColor,
                iconBg: metadata.iconBg,
                active: totalActiveUsers.toString(),
                mau: grandTotal?.mau || "00:00:00",
                totalDuration: totalDurationFormatted,
                totalDurationSeconds: totalDurationSeconds,
                activeUsersCount: totalActiveUsers,
              };
            }
            return null;
          } catch (err) {
            console.error('Failed to fetch Metafix:', err);
            return null;
          }
        };
        
        // Fetch both projects
        const [aifaData, metafixData] = await Promise.all([
          fetchAifaPetrol(),
          fetchMetafix()
        ]);
        
        // Combine all valid projects
        allProjectsData = [aifaData, metafixData].filter(project => project !== null);
        
        // Sort projects by total duration (descending) - highest duration first
        allProjectsData.sort((a, b) => b.totalDurationSeconds - a.totalDurationSeconds);
        
        setProjects(allProjectsData);
      } catch (error) {
        console.error('Error fetching top projects data:', error);
        setError("Failed to load data");
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProjectsData();
  }, [projectName, dateRange]);

  // Take top 5 projects
  const topProjects = projects.slice(0, 5);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-xl border border-gray-100 p-4"
      >
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <p className="text-xs text-gray-500">Loading projects data...</p>
          </div> 
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-xl border border-gray-100 p-4"
      >
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <p className="text-xs text-gray-500">Please try again later</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (topProjects.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-xl border border-gray-100 p-4"
      >
        <div className="flex items-center justify-center h-96">
          <p className="text-sm text-gray-500">No project data available</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-xl border border-gray-100 p-4"
    >
      {/* Header */}
      <div className="mb-2">
        <h3 className="text-base text-gray-800" style={{ fontFamily: 'Jura', fontWeight: '700' }}>Top projects</h3>
        <p className="text-xs text-gray-400 mt-1">Ranked by Total Duration</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left text-[11px] text-gray-400 uppercase tracking-wider py-3 pr-4" style={{ fontFamily: 'sans-serif', fontWeight: '500' }}>
                Project
              </th>
              <th className="text-right text-[11px] text-gray-400 uppercase tracking-wider py-3 px-4" style={{ fontFamily: 'sans-serif', fontWeight: '500' }}>
                Active (30 days)
              </th>
              <th className="text-right text-[11px] text-gray-400 uppercase tracking-wider py-3 px-4" style={{ fontFamily: 'sans-serif', fontWeight: '500' }}>
                MAU
              </th>
              <th className="text-right text-[11px] text-gray-400 uppercase tracking-wider py-3 pl-4" style={{ fontFamily: 'sans-serif', fontWeight: '500' }}>
                Total Duration
              </th>
            </tr> 
          </thead>
          <tbody>
            {topProjects.map((project, index) => (
              <motion.tr
                key={project.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + index * 0.06 }}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${project.iconBg} flex items-center justify-center`}>
                      <project.icon className={`w-4 h-4 ${project.iconColor}`} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-800" style={{ fontFamily: 'Jura', fontWeight: '700' }}>
                        {project.displayName}
                      </p>
                      <p className="text-[11px] text-gray-400" style={{ fontFamily: 'sans-serif', fontWeight: '500' }}>{project.type}</p>
                    </div>
                  </div>
                </td>
                <td className="text-right py-4 px-4">
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Jura', fontWeight: '700' }}>
                    {formatNumber(parseInt(project.active))}
                  </span>
                </td>
                <td className="text-right py-4 px-4">
                  <span className="text-sm text-gray-700" style={{ fontFamily: 'Jura', fontWeight: '700' }}>
                    {project.mau}
                  </span>
                </td>
                <td className="text-right py-4 pl-4" style={{ fontFamily: 'Jura', fontWeight: '700' }}>
                  <span className="text-sm text-gray-700">
                    {project.totalDuration}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}