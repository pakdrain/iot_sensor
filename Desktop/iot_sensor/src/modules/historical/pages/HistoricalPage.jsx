import React, { useState, useEffect, useCallback } from 'react';
import DashboardLayout from '../../dashboard/layout/DashboardLayout';
import { FiDownload } from 'react-icons/fi';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  getHistoricalData,
  getRegions,
  getCitiesByRegionId,
  getShopsByCityId,
  getHistoryFreezers,
  getHistorySensors
} from '../../../services/api/api';

const HistoricalPage = () => {
  // Selected values
  const [selectedRegionId, setSelectedRegionId] = useState('');
  const [selectedRegionName, setSelectedRegionName] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const [selectedShopId, setSelectedShopId] = useState('');
  const [selectedShopName, setSelectedShopName] = useState('');
  const [selectedFreezerId, setSelectedFreezerId] = useState('');
  const [selectedFreezerName, setSelectedFreezerName] = useState('');
  const [selectedSensorName, setSelectedSensorName] = useState('');
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Dropdown options
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [shops, setShops] = useState([]);
  const [freezers, setFreezers] = useState([]);
  const [sensors, setSensors] = useState([]);

  // Set default dates on mount
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];
    setStartDate(sevenDaysAgoStr);
    setEndDate(todayStr);
    fetchRegions();
  }, []);

  // Fetch cities when region changes
  useEffect(() => {
    if (selectedRegionId) {
      fetchCities(selectedRegionId);
      setSelectedCityId('');
      setSelectedCityName('');
      setSelectedShopId('');
      setSelectedShopName('');
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setFreezers([]);
      setSensors([]);
      setHistoricalData([]);
    } else {
      setCities([]);
      setShops([]);
      setFreezers([]);
      setSensors([]);
    }
  }, [selectedRegionId]);

  // Fetch shops when city changes
  useEffect(() => {
    if (selectedCityId) {
      fetchShopsByCity(selectedCityId);
      setSelectedShopId('');
      setSelectedShopName('');
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setFreezers([]);
      setSensors([]);
      setHistoricalData([]);
    } else {
      setShops([]);
      setFreezers([]);
      setSensors([]);
    }
  }, [selectedCityId]);

  // Fetch freezers when shop changes
  useEffect(() => {
    if (selectedShopId) {
      fetchFreezers(selectedShopId);
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setSensors([]);
      setHistoricalData([]);
    } else {
      setFreezers([]);
      setSensors([]);
    }
  }, [selectedShopId]);

  // Fetch sensors when freezer changes
  useEffect(() => {
    if (selectedFreezerName) {
      fetchSensors(selectedFreezerName);
      setSelectedSensorName('');
      setHistoricalData([]);
    } else {
      setSensors([]);
    }
  }, [selectedFreezerName]);

  // Fetch historical data when all required filters are selected
  useEffect(() => {
    const hasRequiredFilters = selectedRegionId && selectedCityId && selectedShopId && selectedFreezerName && selectedSensorName && startDate && endDate;
    
    if (hasRequiredFilters) {
      const timer = setTimeout(() => {
        fetchHistoricalData();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [selectedRegionId, selectedCityId, selectedShopId, selectedFreezerName, selectedSensorName, startDate, endDate]);

  // ============================================
  // API CALLS
  // ============================================

  // Get Regions - /locations/regions
  const fetchRegions = useCallback(async () => {
    try {
      const response = await getRegions();
      console.log('Regions response:', response);
      let regionData = response.data || response;
      if (Array.isArray(regionData)) {
        const regionList = regionData.map(item => ({
          id: item.region_id || item.id,
          name: item.region_name || item.name || item
        }));
        setRegions(regionList);
      }
    } catch (err) {
      console.error('Error fetching regions:', err);
    }
  }, []);

  // Get Cities by Region ID - /locations/cities?region_id={regionId}
  const fetchCities = useCallback(async (regionId) => {
    try {
      const response = await getCitiesByRegionId(regionId);
      console.log('Cities response:', response);
      let cityData = response.data || response;
      if (Array.isArray(cityData)) {
        const cityList = cityData.map(item => ({
          id: item.city_id || item.id,
          name: item.city_name || item.name || item
        }));
        setCities(cityList);
        console.log('Cities set:', cityList);
      }
    } catch (err) {
      console.error('Error fetching cities:', err);
    }
  }, []);

  // Get Shops by City ID - /locations/shops?city_id={cityId}
  const fetchShopsByCity = useCallback(async (cityId) => {
    try {
      console.log('Fetching shops for cityId:', cityId);
      const response = await getShopsByCityId(cityId);
      console.log('Shops response:', response);
      
      let shopData = response.data || response;
      
      if (shopData && !Array.isArray(shopData) && shopData.data) {
        shopData = shopData.data;
      }
      
      console.log('Shop data after processing:', shopData);
      
      if (Array.isArray(shopData) && shopData.length > 0) {
        const shopList = shopData.map(item => ({
          id: item.shop_id || item.id,
          name: item.shop_name || item.name || item
        }));
        setShops(shopList);
        console.log('Shops set:', shopList);
      } else {
        console.warn('No shops found for cityId:', cityId);
        setShops([]);
      }
    } catch (err) {
      console.error('Error fetching shops:', err);
      setShops([]);
    }
  }, []);

  // Get Freezers by Shop ID - /history/freezers/{shopId}
  const fetchFreezers = useCallback(async (shopId) => {
    try {
      console.log('🔄 Fetching freezers for shopId:', shopId);
      const response = await getHistoryFreezers(shopId);
      console.log('📦 Full Freezers response:', response);
      
      let freezerData = response.data || response;
      
      if (freezerData && !Array.isArray(freezerData)) {
        if (freezerData.data && Array.isArray(freezerData.data)) {
          freezerData = freezerData.data;
        } else {
          freezerData = [];
        }
      }
      
      console.log('📊 Processed freezerData:', freezerData);
      
      if (Array.isArray(freezerData) && freezerData.length > 0) {
        const freezerList = freezerData.map((item, index) => {
          // Use freezer_name if available, otherwise use sensor_rom
          const name = item.freezer_name || 
                      item.sensor_rom || 
                      `Freezer ${index + 1}`;
          
          const id = item.sensor_rom || `freezer_${index}`;
          
          console.log(`✅ Freezer ${index + 1}: ID=${id}, Name=${name}`);
          
          return {
            id: id,        // sensor_rom as ID
            name: name     // freezer_name or sensor_rom as display name
          };
        });
        
        setFreezers(freezerList);
        console.log('✅ Final Freezers set:', freezerList);
      } else {
        console.warn('⚠️ No freezers found for shopId:', shopId);
        setFreezers([]);
      }
    } catch (err) {
      console.error('❌ Error fetching freezers:', err);
      setFreezers([]);
    }
  }, []);

  // Get Sensors by Freezer Name - /history/sensors/{freezerName}
  const fetchSensors = useCallback(async (freezerName) => {
    try {
      console.log('🔄 Fetching sensors for freezerName:', freezerName);
      
      if (!freezerName) {
        console.warn('⚠️ No freezer name provided');
        setSensors([]);
        return;
      }
      
      const response = await getHistorySensors(freezerName);
      console.log('📦 Full Sensors response:', JSON.stringify(response, null, 2));
      
      if (!response) {
        console.warn('⚠️ No response from API');
        setSensors([]);
        return;
      }
      
      let sensorData = response.data || response;
      
      if (sensorData && !Array.isArray(sensorData)) {
        if (sensorData.data && Array.isArray(sensorData.data)) {
          sensorData = sensorData.data;
        } else {
          sensorData = [];
        }
      }
      
      console.log('📊 Processed sensorData:', sensorData);
      
      if (Array.isArray(sensorData) && sensorData.length > 0) {
        const sensorList = sensorData.map((item, index) => {
          const name = item.sensor_name || 
                      item.sensor_rom || 
                      `Sensor ${index + 1}`;
          
          const id = item.sensor_id || 
                    item.id || 
                    item.sensor_rom || 
                    `sensor_${index}`;
          
          console.log(`✅ Sensor ${index + 1}: ID=${id}, Name=${name}`);
          
          return {
            id: id,
            name: name
          };
        });
        
        setSensors(sensorList);
        console.log('✅ Final Sensors set:', sensorList);
      } else {
        console.warn('⚠️ No sensors found for freezerName:', freezerName);
        setSensors([]);
      }
    } catch (err) {
      console.error('❌ Error fetching sensors:', err);
      setSensors([]);
    }
  }, []);

  // Get Historical Data
  const fetchHistoricalData = useCallback(async () => {
    if (!startDate || !endDate) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const filters = {};
      
      // ✅ Only add filters that have values
      if (selectedRegionName) filters.region = selectedRegionName;
      if (selectedCityName) filters.city = selectedCityName;
      if (selectedShopName) filters.shop = selectedShopName;
      
      // ✅ Use sensor_rom (ID) for freezer filter
      if (selectedFreezerId) {
        filters.sensor_rom = selectedFreezerId;
      } else if (selectedFreezerName) {
        filters.freezer_name = selectedFreezerName;
      }
      
      // ✅ Use sensor_name for sensor filter
      if (selectedSensorName) filters.sensor_name = selectedSensorName;

      console.log('🔍 Fetching historical data with filters:', filters);
      console.log('📅 Date range:', startDate, 'to', endDate);
      
      const response = await getHistoricalData(startDate, endDate, filters);
      console.log('📦 Historical Data Response:', response);
      
      let reportData = response.data || response;
      let formattedData = [];
      
      if (response.success === false) {
        setError(response.message || 'Failed to fetch historical data');
        setHistoricalData([]);
        setLoading(false);
        return;
      }
      
      if (Array.isArray(reportData)) {
        formattedData = reportData.map(item => {
          const date = new Date(item.reading_time || item.timestamp);
          const hours = date.getHours().toString().padStart(2, '0');
          const minutes = date.getMinutes().toString().padStart(2, '0');
          const timeStr = `${hours}:${minutes}`;
          
          const temp = parseFloat(item.temperature);
          let status = 'Normal';
          if (temp >= -12 && temp <= -5) {
            status = 'Normal';
          } else if (temp > -5) {
            status = 'Warning';
          } else if (temp < -12) {
            status = 'Critical';
          }
          
          return {
            time: timeStr,
            timestamp: date,
            temperature: temp,
            status: status,
            sensor_rom: item.sensor_rom || '',
            freezer_name: item.freezer_name || '',
            shop_name: item.shop_name || '',
            city: item.city || '',
            region: item.region || '',
            reading_time: item.reading_time || ''
          };
        });
      }
      
      setHistoricalData(formattedData);
      
      if (formattedData.length === 0) {
        setError(`No historical data found for the selected filters and date range (${startDate} to ${endDate})`);
      } else {
        setError(null);
      }
      
    } catch (err) {
      console.error('❌ Error fetching historical data:', err);
      setError(err.message || 'Failed to fetch historical data');
      setHistoricalData([]);
    } finally {
      setLoading(false);
    }
  }, [selectedRegionName, selectedCityName, selectedShopName, selectedFreezerId, selectedFreezerName, selectedSensorName, startDate, endDate]);

  // ============================================
  // HANDLERS
  // ============================================

  const handleRegionChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [id, name] = value.split('|');
      setSelectedRegionId(id);
      setSelectedRegionName(name);
      setSelectedCityId('');
      setSelectedCityName('');
      setSelectedShopId('');
      setSelectedShopName('');
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setFreezers([]);
      setSensors([]);
      setHistoricalData([]);
    } else {
      setSelectedRegionId('');
      setSelectedRegionName('');
      setSelectedCityId('');
      setSelectedCityName('');
      setSelectedShopId('');
      setSelectedShopName('');
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setFreezers([]);
      setSensors([]);
      setHistoricalData([]);
    }
  };

  const handleCityChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [id, name] = value.split('|');
      setSelectedCityId(id);
      setSelectedCityName(name);
      setSelectedShopId('');
      setSelectedShopName('');
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setFreezers([]);
      setSensors([]);
      setHistoricalData([]);
    } else {
      setSelectedCityId('');
      setSelectedCityName('');
      setSelectedShopId('');
      setSelectedShopName('');
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setFreezers([]);
      setSensors([]);
      setHistoricalData([]);
    }
  };

  const handleShopChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [id, name] = value.split('|');
      setSelectedShopId(id);
      setSelectedShopName(name);
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setFreezers([]);
      setSensors([]);
      setHistoricalData([]);
    } else {
      setSelectedShopId('');
      setSelectedShopName('');
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setFreezers([]);
      setSensors([]);
      setHistoricalData([]);
    }
  };

  const handleFreezerChange = (e) => {
    const value = e.target.value;
    if (value) {
      const [id, name] = value.split('|');
      setSelectedFreezerId(id);        // ✅ Store sensor_rom as ID
      setSelectedFreezerName(name);    // ✅ Store freezer_name
      setSelectedSensorName('');
      setSensors([]);
      setHistoricalData([]);
    } else {
      setSelectedFreezerId('');
      setSelectedFreezerName('');
      setSelectedSensorName('');
      setSensors([]);
      setHistoricalData([]);
    }
  };

  const handleSensorChange = (e) => {
    const value = e.target.value;
    if (value) {
      setSelectedSensorName(value);
      setHistoricalData([]);
    } else {
      setSelectedSensorName('');
      setHistoricalData([]);
    }
  };

  // ============================================
  // GET FILTERED DATA FOR CHART
  // ============================================

  const filteredData = historicalData || [];

  // ============================================
  // CALCULATE STATS
  // ============================================

  const temps = filteredData.map(item => item.temperature).filter(t => t !== undefined && t !== null);
  const minTemp = temps.length > 0 ? Math.min(...temps) : 0;
  const maxTemp = temps.length > 0 ? Math.max(...temps) : 0;
  const avgTemp = temps.length > 0 ? (temps.reduce((a, b) => a + b, 0) / temps.length) : 0;

  // ============================================
  // STATUS BADGE
  // ============================================

  const getStatusBadge = (status) => {
    const styles = {
      'Normal': 'bg-green-100 text-green-700',
      'Critical': 'bg-red-100 text-red-700',
      'Warning': 'bg-yellow-100 text-yellow-700'
    };
    const dots = {
      'Normal': 'bg-green-500',
      'Critical': 'bg-red-500',
      'Warning': 'bg-yellow-500'
    };
    return { style: styles[status] || 'bg-gray-100 text-gray-700', dot: dots[status] || 'bg-gray-500' };
  };

  // ============================================
  // EXPORT TO CSV
  // ============================================

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      alert('No data to export');
      return;
    }

    const headers = ['Time', 'Temperature (°C)', 'Status', 'Freezer', 'Shop', 'City', 'Region', 'Sensor'];
    const rows = filteredData.map(item => [
      item.time,
      item.temperature,
      item.status,
      item.freezer_name || '-',
      item.shop_name || '-',
      item.city || '-',
      item.region || '-',
      item.sensor_rom || '-'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `historical_data_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // ============================================
  // GET DISPLAY RANGE
  // ============================================

  const getDisplayRange = () => {
    if (startDate && endDate) {
      if (startDate === endDate) {
        return startDate;
      }
      return `${startDate} to ${endDate}`;
    }
    return 'Select date range';
  };

  // ============================================
  // CHECK IF ALL FILTERS ARE SELECTED
  // ============================================

  const hasRequiredFilters = selectedRegionId && selectedCityId && selectedShopId && selectedFreezerName && selectedSensorName;

  // ============================================
  // STYLES
  // ============================================

  const selectClass = "w-auto px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 text-[9px] sm:text-xs md:text-sm text-white rounded bg-gradient-to-b from-[#0b1a30] to-[#1a3a6b] focus:outline-none cursor-pointer";
  const dateClass = "w-auto px-1.5 sm:px-1 md:px-2 py-0.5 sm:py-1 md:py-1.5 text-[9px] sm:text-xs md:text-sm text-black border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white cursor-pointer";
  const buttonClass = "flex items-center gap-0.5 sm:gap-1 px-2 sm:px-2 md:px-3 py-0.5 sm:py-1 md:py-1.5 bg-gradient-to-b from-[#0b1a30] to-[#1a3a6b] text-white text-[9px] sm:text-xs md:text-sm rounded shadow-lg hover:opacity-90 transition-opacity whitespace-nowrap";

  // ============================================
  // RENDER
  // ============================================

  return (
    <DashboardLayout>
      <div className="max-w-full px-2 sm:px-3 md:px-4">

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 md:gap-2 mb-2 sm:mb-3 md:mb-4 animate-fade-in-up delay-100">
          <select
            value={selectedRegionId ? `${selectedRegionId}|${selectedRegionName}` : ''}
            onChange={handleRegionChange}
            className={selectClass}
            style={{ fontFamily: 'Jura, sans-serif' }}
          >
            <option value="" className="text-black">Regions</option>
            {regions.map((region) => (
              <option key={region.id} value={`${region.id}|${region.name}`} className="text-black">
                {region.name}
              </option>
            ))}
          </select>

          <select
            value={selectedCityId ? `${selectedCityId}|${selectedCityName}` : ''}
            onChange={handleCityChange}
            className={selectClass}
            style={{ fontFamily: 'Jura, sans-serif' }}
            disabled={!selectedRegionId}
          >
            <option value="" className="text-black">Cities</option>
            {cities.map((city) => (
              <option key={city.id} value={`${city.id}|${city.name}`} className="text-black">
                {city.name}
              </option>
            ))}
          </select>

          <select
            value={selectedShopId ? `${selectedShopId}|${selectedShopName}` : ''}
            onChange={handleShopChange}
            className={selectClass}
            style={{ fontFamily: 'Jura, sans-serif' }}
            disabled={!selectedCityId || shops.length === 0}
          >
            <option value="" className="text-black">
              {shops.length === 0 ? 'No Shops Available' : 'Shops'}
            </option>
            {shops.map((shop) => (
              <option key={shop.id} value={`${shop.id}|${shop.name}`} className="text-black">
                {shop.name}
              </option>
            ))}
          </select>

          <select
            value={selectedFreezerId ? `${selectedFreezerId}|${selectedFreezerName}` : ''}
            onChange={handleFreezerChange}
            className={selectClass}
            style={{ fontFamily: 'Jura, sans-serif' }}
            disabled={!selectedShopId || freezers.length === 0}
          >
            <option value="" className="text-black">
              {freezers.length === 0 ? 'No Freezers' : 'Select Freezer'}
            </option>
            {freezers.map((freezer) => (
              <option key={freezer.id} value={`${freezer.id}|${freezer.name}`} className="text-black">
                {freezer.name}
              </option>
            ))}
          </select>

          <select
            value={selectedSensorName}
            onChange={handleSensorChange}
            className={selectClass}
            style={{ fontFamily: 'Jura, sans-serif' }}
            disabled={!selectedFreezerId || sensors.length === 0}
          >
            <option value="" className="text-black">
              {sensors.length === 0 ? 'No Sensors' : 'Select Sensor'}
            </option>
            {sensors.map((sensor) => (
              <option key={sensor.id || sensor.name} value={sensor.name} className="text-black">
                {sensor.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={dateClass}
          />

          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={dateClass}
          />

          <button 
            onClick={exportToCSV}
            className={buttonClass}
            style={{ fontFamily: 'Jura, sans-serif' }}
            disabled={filteredData.length === 0}
          >
            <FiDownload size={12} className="sm:w-3 sm:h-3 md:w-4 md:h-4" />
            <span className="hidden xs:inline">Export</span>
            <span className="xs:hidden">Export CSV</span>
          </button>
        </div>

        {/* Graph */}
        <div className="bg-white shadow-lg border border-gray-300 overflow-hidden rounded-lg p-2 sm:p-2 md:p-3 lg:p-4 mb-2 sm:mb-3 md:mb-4 animate-zoom-in delay-300">
          <div className="flex flex-col xs:flex-row justify-between items-center xs:items-center gap-1 mb-2 sm:mb-3">
            <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
              Temperature Trend
            </h3>
            {loading && <span className="text-xs text-gray-500">Loading...</span>}
            {error && <span className="text-xs text-red-500">{error}</span>}
          </div>

          <div className="w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72">
            {loading ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Loading data...
                </div>
              </div>
            ) : !hasRequiredFilters ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs flex-col gap-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Please select Region, City, Shop, Freezer & Sensor to view data</span>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full text-red-500 text-xs">
                {error}
              </div>
            ) : filteredData && filteredData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={filteredData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#d4f0e4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a4e2ce" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    tick={{ fontSize: 10, fill: '#000000' }}
                    axisLine={false}
                    tickLine={false}
                    interval={Math.floor(filteredData.length / 8)}
                    padding={{ left: 5, right: 5 }}
                  />

                  <YAxis 
                    tick={{ fontSize: 8, fill: '#000000' }}
                    axisLine={false}
                    tickLine={false}
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `${value}°`}
                    width={25}
                  />

                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #525a54',
                      borderRadius: 6,
                      fontSize: 10,
                    }}
                    formatter={(value, name) => {
                      const item = filteredData.find(d => d.temperature === value);
                      const status = item?.status || 'Normal';
                      const colors = {
                        'Normal': '#22c55e',
                        'Warning': '#eab308', 
                        'Critical': '#ef4444'
                      };
                      return [
                        <span style={{ color: colors[status] || '#1a3a6b' }}>
                          {value}°C
                        </span>,
                        'Temperature'
                      ];
                    }}
                    labelFormatter={(label) => `Time: ${label}`}
                    cursor={{ stroke: '#d1d5db', strokeWidth: 1 }}
                  />

                  <Area 
                    type="monotone" 
                    dataKey="temperature" 
                    name="Temperature"
                    stroke="#489b4f" 
                    strokeWidth={2}
                    fill="url(#colorTemp)" 
                    dot={filteredData.length <= 24}
                    activeDot={{ r: 4, fill: '#42a357' }}
                  />

                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-xs flex-col gap-2">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>No data available for selected filters</span>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 md:gap-3 mt-1.5 sm:mt-2">
            <div className="flex items-center gap-1">
              <span className="w-3 sm:w-4 md:w-6 h-0.5 bg-[#1a3a6b]"></span>
              <span className="text-[10px] sm:text-[12px] text-black">Temperature</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
              <span className="text-[10px] sm:text-[12px] text-black">Normal</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
              <span className="text-[10px] sm:text-[12px] text-black">Warning</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="text-[10px] sm:text-[12px] text-black">Critical</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {hasRequiredFilters && filteredData.length > 0 && (
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3 md:mb-4">
            <div className="bg-gradient-to-b from-[#0b1a30] to-[#1a3a6b] shadow-lg rounded-lg p-1.5 sm:p-2 md:p-3 text-center animate-fade-in-up delay-200">
              <p className="text-[8px] sm:text-[10px] md:text-[12px] text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>MIN TEMPERATURE</p>
              <p className="text-xs sm:text-sm md:text-base font-bold text-blue-400" style={{ fontFamily: 'Jura, sans-serif' }}>{minTemp.toFixed(1)}°C</p>
            </div>
            <div className="bg-gradient-to-b from-[#0b1a30] to-[#1a3a6b] shadow-lg rounded-lg p-1.5 sm:p-2 md:p-3 text-center animate-fade-in-up delay-300">
              <p className="text-[8px] sm:text-[10px] md:text-[12px] text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>MAX TEMPERATURE</p>
              <p className="text-xs sm:text-sm md:text-base font-bold text-red-600" style={{ fontFamily: 'Jura, sans-serif' }}>{maxTemp.toFixed(1)}°C</p>
            </div>
            <div className="bg-gradient-to-b from-[#0b1a30] to-[#1a3a6b] shadow-lg rounded-lg p-1.5 sm:p-2 md:p-3 text-center animate-fade-in-up delay-400">
              <p className="text-[8px] sm:text-[10px] md:text-[12px] text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>AVG TEMPERATURE</p>
              <p className="text-xs sm:text-sm md:text-base font-bold text-green-500" style={{ fontFamily: 'Jura, sans-serif' }}>{avgTemp.toFixed(1)}°C</p>
            </div>
          </div>
        )}

        {/* Reading History Table */}
        {hasRequiredFilters && filteredData.length > 0 && (
          <div className="bg-white shadow-lg border border-gray-300 overflow-hidden rounded-lg animate-fade-in-up delay-500">
            <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-3 border-b border-gray-200">
              <h3 className="text-[10px] sm:text-xs md:text-sm font-semibold text-black" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Reading History {selectedFreezerName && `- ${selectedFreezerName}`}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[280px] sm:min-w-[350px] md:min-w-full">
                <thead className="bg-gradient-to-b from-[#0b1a30] to-[#1a3a6b] border-b border-gray-300">
                  <tr>
                    <th className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-left text-[8px] sm:text-[10px] md:text-[12px] text-white uppercase tracking-wider" style={{ fontFamily: 'Jura, sans-serif' }}>Time</th>
                    <th className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-left text-[8px] sm:text-[10px] md:text-[12px] text-white uppercase tracking-wider" style={{ fontFamily: 'Jura, sans-serif' }}>Temperature</th>
                    <th className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-left text-[8px] sm:text-[10px] md:text-[12px] text-white uppercase tracking-wider" style={{ fontFamily: 'Jura, sans-serif' }}>Status</th>
                    <th className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-left text-[8px] sm:text-[10px] md:text-[12px] text-white uppercase tracking-wider" style={{ fontFamily: 'Jura, sans-serif' }}>Freezer</th>
                    <th className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-left text-[8px] sm:text-[10px] md:text-[12px] text-white uppercase tracking-wider" style={{ fontFamily: 'Jura, sans-serif' }}>Sensor</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500 text-xs">Loading...</td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500 text-xs">No data available</td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => {
                      const { style, dot } = getStatusBadge(item.status);
                      return (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-[8px] sm:text-[10px] md:text-[12px] text-black">{item.time}</td>
                          <td className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-[8px] sm:text-[10px] md:text-[12px] text-black">{item.temperature}°C</td>
                          <td className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2">
                            <span className={`inline-flex items-center gap-0.5 px-1 sm:px-1.5 md:px-2 py-0.5 text-[6px] sm:text-[8px] md:text-[10px] font-medium rounded-full ${style}`}>
                              <span className={`w-0.5 h-0.5 sm:w-1 sm:h-1 rounded-full ${dot}`}></span>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-[8px] sm:text-[10px] md:text-[12px] text-black">{item.freezer_name || '-'}</td>
                          <td className="px-1.5 sm:px-2 md:px-3 py-1 sm:py-1.5 md:py-2 text-[8px] sm:text-[10px] md:text-[12px] text-black">{item.sensor_rom || '-'}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default HistoricalPage;