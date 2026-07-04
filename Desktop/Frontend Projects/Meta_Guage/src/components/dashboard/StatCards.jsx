import { motion } from "framer-motion";
import { Users, TrendingUp, Activity, Clock, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";
import aifaPetrolAPI from "../../api/aifa_petrol_api";
import metafixAPI from "../../api/metafix_api";

const defaultStats = [
  {
    label: "DAU",
    value: "Loading...",
    icon: Users,
    gradient: "from-blue-500 to-cyan-500",
    borderColor: "border-blue-500/20",
    glowColor: "shadow-blue-500/10",
    key: "dau",
    subtext: "Daily Active Users Duration",
  },
  {
    label: "MAU",
    value: "Loading...",
    icon: TrendingUp,
    gradient: "from-violet-500 to-purple-500",
    borderColor: "border-violet-500/20",
    glowColor: "shadow-violet-500/10",
    key: "mau",
    subtext: "Monthly Active Users Duration",
  },
  {
    label: "TOTAL USERS LOGIN",
    value: "Loading...",
    icon: Activity,
    gradient: "from-emerald-500 to-teal-500",
    borderColor: "border-emerald-500/20",
    glowColor: "shadow-emerald-500/10",
    key: "active_users",
  }, 
  {
    label: "TOTAL SESSION DURATION",
    value: "Loading...",
    icon: Clock,
    gradient: "from-amber-500 to-orange-500",
    borderColor: "border-amber-500/20",
    glowColor: "shadow-amber-500/10",
    key: "total_duration",
  },
  {
    label: "FEEDBACK SCORE",
    value: "4.6 / 5",
    icon: MessageSquare,
    gradient: "from-gray-500 to-slate-500",
    borderColor: "border-gray-500/20",
    glowColor: "shadow-gray-500/10",
    key: "feedback",
  },
];

export default function StatCards({ projectName = "Aifa Petrol", dateRange }) {
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjectData = async (projectId) => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      if (projectId === "Metafix") {
        // Fetch Metafix data
        try {
          const response = await metafixAPI.getProjectSession();
          if (response && response.success && response.data) {
            const projectData = response.data.find(item => item.project_name === 'Metafix');
            const grandTotal = response.data.find(item => item.project_name === '');
            
            data = {
              dau: projectData?.dau || "00:00:00",
              mau: grandTotal?.mau || "00:00:00",
              active_users: projectData?.active_users || "0",
              total_duration: projectData?.total_duration || "00:00:00",
              session_count: projectData?.session_count || "0",
            };
          } else {
            throw new Error("Invalid response from Metafix API");
          }
        } catch (err) {
          console.error('Failed to fetch Metafix data:', err);
          data = {
            dau: "00:00:00",
            mau: "00:00:00",
            active_users: "0",
            total_duration: "00:00:00",
            session_count: "0",
          };
          setError("Failed to load Metafix data");
        }
      } else {
        // Fetch Aifa Petrol data
        try {
          const response = await aifaPetrolAPI.getProjectSession();
          if (response && response.success && response.data) {
            const grandTotal = response.data.find(item => item.session_date === 'Grand Total');
            if (grandTotal) {
              data = {
                dau: grandTotal.dau || "00:00:00",
                mau: grandTotal.mau || "00:00:00",
                active_users: grandTotal.active_users || "0",
                total_duration: grandTotal.total_duration || "00:00:00",
                session_count: grandTotal.session_count || "0",
              };
            } else {
              throw new Error("No grand total found");
            }
          } else {
            throw new Error("Invalid response from Aifa Petrol API");
          }
        } catch (err) {
          console.error('Failed to fetch Aifa Petrol data:', err);
          data = {
            dau: "00:00:00",
            mau: "00:00:00",
            active_users: "0",
            total_duration: "00:00:00",
            session_count: "0",
          };
          setError("Failed to load Aifa Petrol data");
        }
      }
      
      if (data) {
        setStats(prevStats => 
          prevStats.map(stat => {
            switch (stat.key) {
              case "dau":
                return { ...stat, value: data.dau || "00:00:00" };
              case "mau":
                return { ...stat, value: data.mau || "00:00:00" };
              case "active_users":
                return { ...stat, value: data.active_users || "0" };
              case "total_duration":
                return { ...stat, value: data.total_duration || "00:00:00" };
              default:
                return stat;
            }
          })
        );
        if (error) setError(null);
      }
    } catch (err) {
      console.error(`Failed to fetch data for ${projectId}:`, err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectName) {
      fetchProjectData(projectName);
    }
  }, [projectName, dateRange]);

  if (error && !loading) {
    const errorStats = [...defaultStats];
    errorStats[0].value = "00:00:00";
    errorStats[1].value = "00:00:00";
    errorStats[2].value = "0";
    errorStats[3].value = "00:00:00";
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        {errorStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
            whileHover={{ y: -3, scale: 1.01, transition: { duration: 0.2 } }}
            className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 rounded-xl border ${stat.borderColor} p-3 cursor-pointer hover:shadow-xl ${stat.glowColor} transition-all duration-300 overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                 style={{ background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, transparent)` }} />
            
            <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
                 style={{ boxShadow: `0 0 15px ${stat.glowColor.split(' ')[0].replace('shadow-', '').replace('/10', '')}` }} />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] uppercase tracking-wider font-medium text-gray-100" style={{ fontFamily: 'Jura' }}>
                      {stat.label}
                    </p>
                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-medium">
                      {stat.subtext}
                    </span>
                  </div>
                  <div className={`w-6 h-0.5 bg-gradient-to-r ${stat.gradient} mt-1 rounded-full`} />
                </div>
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10 flex items-center justify-center shrink-0 shadow-md`}>
                  <stat.icon className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              
              <div className="mt-1">
                <p className="text-lg font-bold text-white break-words tracking-tight" style={{ fontFamily: 'Jura' }}>
                  {stat.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            delay: index * 0.08, 
            duration: 0.4,
            ease: "easeOut"
          }}
          whileHover={{ 
            y: -3,
            scale: 1.01,
            transition: { duration: 0.2 }
          }}
          className={`relative bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 rounded-xl border ${stat.borderColor} p-3 cursor-pointer hover:shadow-xl ${stat.glowColor} transition-all duration-300 overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
               style={{ background: `linear-gradient(135deg, ${stat.gradient.split(' ')[1]}, transparent)` }} />
          
          <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
               style={{ boxShadow: `0 0 15px ${stat.glowColor.split(' ')[0].replace('shadow-', '').replace('/10', '')}` }} />
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[11px] uppercase tracking-wider font-medium text-gray-100" style={{ fontFamily: 'Jura' }}>
                    {stat.label}
                  </p>
                  {stat.subtext && (
                    <span className="text-[8px] text-gray-400 uppercase tracking-wider font-medium">
                      {stat.subtext}
                    </span>
                  )}
                </div>
                <div className={`w-6 h-0.5 bg-gradient-to-r ${stat.gradient} mt-1 rounded-full`} />
              </div>
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-10 flex items-center justify-center shrink-0 shadow-md`}>
                <stat.icon className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            
            <div className="mt-1">
              <p className="text-lg font-bold text-white break-words tracking-tight" style={{ fontFamily: 'Jura' }}>
                {loading ? (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 bg-white/20 rounded-full animate-pulse"></span>
                    <span className="w-2 h-2 bg-white/20 rounded-full animate-pulse delay-75"></span>
                    <span className="w-2 h-2 bg-white/20 rounded-full animate-pulse delay-150"></span>
                  </span>
                ) : stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}