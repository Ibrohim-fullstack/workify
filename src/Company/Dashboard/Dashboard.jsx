import React, { useState, useEffect } from 'react';
import { companyApi, jobApi } from '../../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, AreaChart, Area, Tooltip
} from 'recharts';

const Dashboard = () => {
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rawJobs, setRawJobs] = useState([]);
  const [profileViewTab, setProfileViewTab] = useState('week');
  const [jobPostTab, setJobPostTab] = useState('week');
  const [profileStats, setProfileStats] = useState([]);
  const [jobStats, setJobStats] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 450);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 450);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getProgressColor = (pct) => {
    if (pct <= 30) return "#FF4D4D";
    if (pct <= 55) return "#FFD60A";
    if (pct < 80) return "#56CDAD";
    return "#28A745";
  };

  const getMaxScale = (data) => {
    const maxVal = data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;
    return maxVal < 5 ? 5 : maxVal + 1;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const saved = localStorage.getItem("user_info") || sessionStorage.getItem("user_info");
        if (!saved) return;
        const user = JSON.parse(saved);

        const res = await companyApi.getAll();
        const myData = res.data.find(c => c.id === user.id);

        if (myData) {
          const fields = [
            myData.company_name, myData.email, myData.phone,
            myData.industry, myData.country, myData.city,
            myData.password, myData.website, myData.about_company, myData.profileimg_url
          ];
          const filled = fields.filter(v => v !== null && v !== undefined && v !== "" && v !== "string").length;
          setPercentage(filled * 10);
        }

        const jobsRes = await jobApi.getAll();
        const myJobs = jobsRes.data.filter(job => job.company_id === user.id || job.ownerId === user.id);

        setRawJobs(myJobs);
        setProfileStats(formatData(myJobs, 'week'));
        setJobStats(formatData(myJobs, 'week'));
      } catch (err) {
        console.error("Xato:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const formatData = (jobs, type) => {
    const labels = type === 'week'
      ? ['M', 'T', 'W', 'T', 'F', 'ST', 'SN']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    return labels.map((label, index) => ({
      name: label,
      count: type === 'week'
        ? jobs.filter(j => {
          const day = new Date(j.createdAt).getDay();
          const mappedDay = day === 0 ? 6 : day - 1;
          return mappedDay === index;
        }).length
        : jobs.filter(j => new Date(j.createdAt).getMonth() === index).length
    }));
  };

  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const displayPercentage = Math.min(percentage, 100);
  const offset = circumference - (displayPercentage / 100) * circumference;

  if (loading) return null;

  return (
    <div className="p-3 md:p-6 bg-[#F8F9FB] min-h-screen font-['Mulish']">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 max-w-[1400px] mx-auto gap-4">
        <div className="bg-white px-6 md:px-8 py-4 rounded-lg shadow-sm border border-gray-100 flex items-center w-full sm:flex-grow sm:max-w-[1047px]">
          <h1 className="text-[18px] md:text-[20px] font-bold text-[#202430]">Dashboard</h1>
        </div>
        <button
          style={{ background: 'linear-gradient(95.14deg, #1D3F61 0%, #C25DC5 100%)' }}
          className="text-white w-full sm:w-auto px-10 py-4 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all min-w-[180px] shadow-md border-none"
        >
          Post a Job
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* PROFILE CARD */}
          <div className="lg:col-span-4 bg-gradient-to-br from-[#163D5C] to-[#CA5ECA] p-6 md:p-8 rounded-[20px] text-white flex flex-col items-center justify-center shadow-xl h-[350px] md:h-[400px]">
            <h3 className="text-[18px] md:text-[20px] font-bold mb-6 text-center w-full">Profile completed</h3>
            <div className="relative flex items-center justify-center w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
              <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                <circle cx="100" cy="100" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="20" fill="transparent" />
                <circle
                  cx="100" cy="100" r={radius}
                  stroke={getProgressColor(displayPercentage)}
                  strokeWidth="20"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[28px] md:text-[36px] font-bold leading-none">
                  {displayPercentage}%
                </span>
                <span className="text-[12px] md:text-[14px] opacity-80 mt-1">Complete</span>
              </div>
            </div>
          </div>

          {/* PROFILE VIEWS */}
          <div className="lg:col-span-8 bg-white p-4 md:p-6 rounded-[20px] border border-[#E9E9E9] shadow-sm flex flex-col items-center h-[400px]">
            <h3 className="text-[16px] md:text-[18px] font-bold text-[#202430] mb-4">Profile views</h3>

            <div className="bg-[#F8F8FD] p-1 rounded-xl flex items-center relative mb-6 w-full max-w-[420px]">
              <div className="absolute bg-white shadow-md rounded-lg transition-all duration-500 ease-in-out"
                style={{
                  width: 'calc(50% - 4px)',
                  height: 'calc(100% - 8px)',
                  left: profileViewTab === 'week' ? '4px' : 'calc(50%)'
                }} />
              <button onClick={() => { setProfileViewTab('week'); setProfileStats(formatData(rawJobs, 'week')); }}
                className={`z-10 font-bold py-2 text-[13px] md:text-[14px] flex-1 transition-colors ${profileViewTab === 'week' ? 'text-[#202430]' : 'text-gray-400'}`}>This week</button>
              <button onClick={() => { setProfileViewTab('month'); setProfileStats(formatData(rawJobs, 'month')); }}
                className={`z-10 font-bold py-2 text-[13px] md:text-[14px] flex-1 transition-colors ${profileViewTab === 'month' ? 'text-[#202430]' : 'text-gray-400'}`}>This month</button>
            </div>

            <div className="h-[220px] md:h-[240px] w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profileStats} margin={{ top: 5, right: 30, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CA5ECA" />
                      <stop offset="100%" stopColor="#163D5C" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F3F3" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A3A3A3', fontSize: isMobile ? 9 : 11 }}
                    interval={isMobile && profileViewTab === 'month' ? 1 : 0}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#A3A3A3', fontSize: 12 }}
                    width={35}
                    domain={[0, getMaxScale(profileStats)]}
                  />
                  <Tooltip cursor={{ fill: '#F8F8FD' }} />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={isMobile ? 8 : 16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* JOB POSTS */}
        <div className="bg-white p-4 md:p-8 rounded-[20px] border border-[#E9E9E9] shadow-sm flex flex-col items-center">
          <h3 className="text-[16px] md:text-[18px] font-bold text-[#202430] mb-6">Job posts</h3>
          <div className="bg-[#F8F8FD] p-1 rounded-xl flex items-center relative mb-8 w-full max-w-[420px]">
            <div className="absolute bg-white shadow-md rounded-lg transition-all duration-500 ease-in-out"
              style={{
                width: 'calc(50% - 4px)',
                height: 'calc(100% - 8px)',
                left: jobPostTab === 'week' ? '4px' : 'calc(50%)'
              }} />
            <button onClick={() => { setJobPostTab('week'); setJobStats(formatData(rawJobs, 'week')); }}
              className={`z-10 font-bold py-2 text-[13px] md:text-[14px] flex-1 ${jobPostTab === 'week' ? 'text-[#202430]' : 'text-gray-400'}`}>This week</button>
            <button onClick={() => { setJobPostTab('month'); setJobStats(formatData(rawJobs, 'month')); }}
              className={`z-10 font-bold py-2 text-[13px] md:text-[14px] flex-1 ${jobPostTab === 'month' ? 'text-[#202430]' : 'text-gray-400'}`}>This month</button>
          </div>
          <div className="h-[250px] md:h-[300px] w-full" style={{ minWidth: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={jobStats} margin={{ top: 5, right: 30, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorJob" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5ABF89" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#5ABF8900" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F3F3" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A3A3A3', fontSize: isMobile ? 9 : 11 }}
                  interval={isMobile && jobPostTab === 'month' ? 1 : 0}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#A3A3A3', fontSize: 12 }}
                  width={35}
                  domain={[0, getMaxScale(jobStats)]}
                />
                <Tooltip />
                <Area type="monotone" dataKey="count" stroke="#5ABF89" strokeWidth={3} fill="url(#colorJob)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;