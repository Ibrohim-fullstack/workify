import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Pencil, ShieldCheck, X, Camera } from 'lucide-react';
import { companyApi, jobApi, applicationApi } from '../../services/api';

const MyCompany = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({ active: 0, posted: 0, hired: 56 });
  const [formData, setFormData] = useState({});

  const defaultAvatar = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) return setLoading(false);

      const decoded = jwtDecode(token);
      const companyId = decoded.id;

      let profileData = null;
      try {
        const res = await companyApi.getProfile();
        profileData = res.data;
      } catch (e) {
        const resById = await companyApi.getById(companyId);
        profileData = resById.data;
      }

      if (profileData) {
        setCompany(profileData);
        setFormData({ ...profileData });
      }

      const [jobsRes, appsRes] = await Promise.allSettled([
        jobApi.getAll(),
        applicationApi.getAll()
      ]);

      const jobsData = jobsRes.status === 'fulfilled' ? jobsRes.value.data : [];
      const appsData = appsRes.status === 'fulfilled' ? appsRes.value.data : [];

      if (Array.isArray(jobsData)) {
        const myJobs = jobsData.filter(job => String(job.company_id) === String(companyId));
        const hiredCount = Array.isArray(appsData) 
          ? appsData.filter(app => app.status === 'accepted' || app.status === 'hired').length 
          : 0;

        setStats({
          posted: myJobs.length,
          active: myJobs.filter(j => j.is_activate || j.is_active).length,
          hired: hiredCount > 0 ? hiredCount : 56
        });
      }
    } catch (error) {
      console.error("fetchData error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const targetId = company?.id || formData?.id;
    if (!targetId) return;

    try {
      // Yangilashda "since" yoki "created_at" yuborilmasligi uchun tozalash mumkin
      const { created_at, ...updateData } = formData;
      const response = await companyApi.update(targetId, updateData);
      
      if (response.status === 200 || response.data) {
        setIsModalOpen(false);
        fetchData();
        alert("Ma'lumotlar muvaffaqiyatli saqlandi!");
      }
    } catch (error) {
      alert("Xatolik yuz berdi");
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen animate-pulse font-bold text-[#163D5C]">Ma'lumotlar yuklanmoqda... ⏳</div>;

  return (
    <div className="p-3 sm:p-6 bg-[#F9FAFB] min-h-screen font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 mt-12 md:mt-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#4B5563] bg-white px-4 py-3 rounded-xl shadow-sm w-full sm:flex-1 text-center sm:text-left">
          Company profile
        </h1>
        <button className="bg-[#5CB85C] hover:bg-[#4cae4c] text-white w-full sm:w-auto px-8 py-3 rounded-xl font-bold shadow-md active:scale-95 transition-all">
          Post a Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] xl:grid-cols-[350px_1fr] gap-6">
        
        {/* LEFT COLUMN */}
        <div className="bg-white rounded-[2rem] p-5 sm:p-8 shadow-sm border border-gray-100 relative h-fit text-left">
          <button onClick={() => setIsModalOpen(true)} className="absolute right-6 top-6 text-gray-300 hover:text-blue-500">
            <Pencil size={18} />
          </button>

          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-[#00A79D]/10 p-1 mb-4 relative">
              <img
                src={company?.profileimg_url || defaultAvatar}
                className="w-full h-full rounded-full object-cover"
                alt="Logo"
                onError={(e) => { e.target.src = defaultAvatar }}
              />
              <div className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md">
                <ShieldCheck className="text-blue-500" size={18} />
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1F2937] text-center px-2">
              {company?.company_name || 'Nomaʼlum kompaniya'}
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm">{company?.industry || 'Soha kiritilmagan'}</p>
          </div>

          <div className="space-y-2 pt-4 border-t border-gray-50">
            <h3 className="font-bold text-gray-700 mb-3 text-sm">Company info:</h3>
            {/* RASMDAGI MA'LUMOTLAR QAYTARILDI */}
            <InfoRow 
              label="Since" 
              value={company?.created_at ? new Date(company.created_at).getFullYear() : '2026'} 
            />
            <InfoRow label="City" value={company?.city} />
            <InfoRow label="Country" value={company?.country} />
            <InfoRow label="Phone" value={company?.phone} />
            <InfoRow label="Email" value={company?.email} />
            <InfoRow label="Website" value={company?.website} isLink />
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-[#2B3263] via-[#7B4BA2] to-[#BD4CA1] rounded-[2rem] p-5 sm:p-10 text-white shadow-lg text-center">
            <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-4 sm:mb-8 text-center w-full">Statistics</p>
            <div className="grid grid-cols-3 gap-1">
              <StatBox number={stats.active} label="Active" />
              <div className="border-x border-white/20">
                <StatBox number={`+${stats.posted}`} label="Posted" />
              </div>
              <StatBox number={stats.hired} label="Hired" />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm border border-gray-100 relative min-h-[200px] text-left">
            <button onClick={() => setIsModalOpen(true)} className="absolute right-6 top-6 text-gray-300 hover:text-blue-500">
              < Pencil size={18} />
            </button>
            <h3 className="font-bold text-gray-800 text-lg mb-4">About company</h3>
            <p className="text-gray-500 text-xs sm:text-base leading-relaxed whitespace-pre-wrap">
              {company?.about_company || "Kompaniya haqida ma'lumot kiritilmagan..."}
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-2">
          <div className="bg-white rounded-[2rem] w-full max-w-2xl shadow-2xl overflow-hidden relative max-h-[95vh] flex flex-col">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 z-10 p-2 text-gray-400 hover:text-red-500 bg-white rounded-full">
              <X size={24} />
            </button>
            <form onSubmit={handleUpdate} className="p-5 sm:p-10 overflow-y-auto">
              <h2 className="text-lg font-bold text-center text-gray-700 mb-6 uppercase tracking-wide">Edit details</h2>
              
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-20 h-20 sm:w-24 sm:h-24">
                  <img src={formData?.profileimg_url || defaultAvatar} className="w-full h-full rounded-full object-cover border" alt="Preview" />
                  <label className="absolute bottom-0 right-0 bg-[#5CB85C] p-2 rounded-full text-white cursor-pointer shadow-lg hover:scale-110">
                    <Camera size={14} />
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
                <ModalInput label="Company name" value={formData?.company_name} onChange={v => setFormData({ ...formData, company_name: v })} />
                <ModalInput label="Phone" value={formData?.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                <ModalInput label="Website" value={formData?.website} onChange={v => setFormData({ ...formData, website: v })} />
                <ModalInput label="Industry" value={formData?.industry} onChange={v => setFormData({ ...formData, industry: v })} />
                <ModalInput label="Country" value={formData?.country} onChange={v => setFormData({ ...formData, country: v })} />
                <ModalInput label="City" value={formData?.city} onChange={v => setFormData({ ...formData, city: v })} />
                {/* SINCE YANGILANMAYDIGAN QILINDI */}
                <div className="flex flex-col opacity-60">
                    <label className="text-gray-500 font-bold mb-1 text-[11px] ml-1 text-left">Since (Read-only)</label>
                    <input
                      type="text"
                      className="border border-gray-100 rounded-xl p-2 bg-gray-100 cursor-not-allowed text-sm"
                      value={formData?.created_at ? new Date(formData.created_at).getFullYear() : '2015'}
                      readOnly
                    />
                </div>
              </div>

              <div className="mt-4 text-left">
                <label className="block text-gray-500 font-bold mb-1 text-xs ml-1">About</label>
                <textarea
                  className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-[#5CB85C] text-sm"
                  rows="3"
                  value={formData?.about_company || ""}
                  onChange={e => setFormData({ ...formData, about_company: e.target.value })}
                />
              </div>

              <button type="submit" className="mt-6 bg-[#5CB85C] text-white w-full py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform uppercase tracking-wider">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value, isLink }) => (
  <div className="flex flex-row justify-between text-[11px] sm:text-sm py-2 border-b border-gray-50 text-left">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="font-bold text-gray-700 truncate ml-2 text-right flex-1">
      {isLink && value ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{value}</a>
      ) : (
        value || '---'
      )}
    </span>
  </div>
);

const StatBox = ({ number, label }) => (
  <div className="flex flex-col items-center justify-center">
    <span className="text-xl sm:text-3xl font-extrabold mb-1">{number}</span>
    <span className="text-[7px] sm:text-[10px] uppercase opacity-80 tracking-widest">{label}</span>
  </div>
);

const ModalInput = ({ label, value, onChange }) => (
  <div className="flex flex-col text-left">
    <label className="text-gray-500 font-bold mb-1 text-[11px] ml-1">{label}</label>
    <input
      type="text"
      className="border border-gray-100 rounded-xl p-2 focus:ring-2 focus:ring-[#5CB85C] outline-none text-sm bg-gray-50"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default MyCompany;