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

  const getProgressColor = (pct) => {
    if (pct <= 30) return "#FF4D4D";      
    if (pct <= 55) return "#FFD60A";      
    if (pct < 80) return "#56CDAD"; 
    return "#28A745";                     
  };

  const getMaxScale = (data) => {
    const maxVal = data.length > 0 ? Math.max(...data.map(d => d.count)) : 0;
    return maxVal < 10 ? maxVal + 5 : maxVal + 50;
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
    // Shanba (ST) va Yakshanba (SN) qilib o'zgartirildi
    const labels = type === 'week' ? ['M', 'T', 'W', 'T', 'F', 'ST', 'SN'] : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    return labels.map((label, index) => ({
      name: label,
      count: type === 'week' 
        ? jobs.filter(j => {
            const day = new Date(j.createdAt).getDay();
            // getDay(): 0-Yakshanba, 1-Dushanba... 6-Shanba
            // Grafik indexi: 0-M, 1-T, 2-W, 3-T, 4-F, 5-ST, 6-SN
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
    <div className="p-4 md:p-6 bg-[#F8F9FB] min-h-screen font-['Mulish']">
      
      <div className="flex justify-between items-center mb-6 max-w-[1400px] mx-auto gap-4">
        <div className="bg-white px-8 py-4 rounded-lg shadow-sm border border-gray-100 flex items-center flex-grow max-w-[1047px]">
          <h1 className="text-[20px] font-bold text-[#202430]">Dashboard</h1>
        </div>
        <button className="bg-[#50C594] text-white px-10 py-4 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all min-w-[180px] justify-center shadow-md">
          Post a Job
        </button>
      </div>

      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-4 bg-gradient-to-br from-[#163D5C] to-[#CA5ECA] p-8 rounded-[20px] text-white flex flex-col items-center justify-center shadow-xl" style={{ height: '400px' }}>
            <h3 className="text-[20px] font-bold mb-6 text-center w-full">Profile completed</h3>
            <div className="relative flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
              <svg width="200" height="200" className="transform -rotate-90">
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
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span style={{ fontSize: '36px', fontWeight: '700' }} className="leading-none">
                  {displayPercentage}%
                </span>
                <span className="text-[14px] opacity-80 mt-1">Complete</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white p-6 rounded-[20px] border border-[#E9E9E9] shadow-sm flex flex-col items-center" style={{ height: '400px' }}>
            <h3 className="text-[18px] font-bold text-[#202430] mb-4">Profile views</h3>
            
            <div className="bg-[#F8F8FD] p-1.5 rounded-xl flex items-center relative mb-6" style={{ width: '420px' }}>
               <div className="absolute bg-white shadow-md rounded-lg transition-transform duration-500 ease-in-out"
                  style={{ width: '204px', height: 'calc(100% - 12px)', transform: profileViewTab === 'week' ? 'translateX(0px)' : 'translateX(204px)' }} />
               <button onClick={() => { setProfileViewTab('week'); setProfileStats(formatData(rawJobs, 'week')); }}
                 className={`z-10 font-bold py-2.5 flex-1 transition-colors duration-300 ${profileViewTab === 'week' ? 'text-[#202430]' : 'text-gray-400'}`}>This week</button>
               <button onClick={() => { setProfileViewTab('month'); setProfileStats(formatData(rawJobs, 'month')); }}
                 className={`z-10 font-bold py-2.5 flex-1 transition-colors duration-300 ${profileViewTab === 'month' ? 'text-[#202430]' : 'text-gray-400'}`}>This month</button>
            </div>

            <div className="h-[240px] w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={profileStats}>
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#CA5ECA" />
                      <stop offset="100%" stopColor="#163D5C" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F3F3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#A3A3A3'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#A3A3A3'}} domain={[0, getMaxScale(profileStats)]} />
                  <Tooltip cursor={{fill: '#F8F8FD'}} />
                  <Bar dataKey="count" fill="url(#barGradient)" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[20px] border border-[#E9E9E9] shadow-sm flex flex-col items-center">
           <h3 className="text-[18px] font-bold text-[#202430] mb-6">Job posts</h3>
           <div className="bg-[#F8F8FD] p-1.5 rounded-xl flex items-center relative mb-8" style={{ width: '420px' }}>
              <div className="absolute bg-white shadow-md rounded-lg transition-transform duration-500 ease-in-out"
                  style={{ width: '204px', height: 'calc(100% - 12px)', transform: jobPostTab === 'week' ? 'translateX(0px)' : 'translateX(204px)' }} />
              <button onClick={() => { setJobPostTab('week'); setJobStats(formatData(rawJobs, 'week')); }}
                className={`z-10 font-bold py-2.5 flex-1 ${jobPostTab === 'week' ? 'text-[#202430]' : 'text-gray-400'}`}>This week</button>
              <button onClick={() => { setJobPostTab('month'); setJobStats(formatData(rawJobs, 'month')); }}
                className={`z-10 font-bold py-2.5 flex-1 ${jobPostTab === 'month' ? 'text-[#202430]' : 'text-gray-400'}`}>This month</button>
           </div>
           <div className="h-[300px] w-full" style={{ minWidth: 0 }}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <AreaChart data={jobStats}>
                  <defs>
                    <linearGradient id="colorJob" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5ABF89" stopOpacity={0.6}/>
                      <stop offset="100%" stopColor="#5ABF8900" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F3F3" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} domain={[0, getMaxScale(jobStats)]} />
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