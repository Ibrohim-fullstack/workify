import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Pencil, X, Camera } from 'lucide-react';
import { companyApi, jobApi, applicationApi } from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyCompany = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({ active: 0, posted: 0, hired: 56 });
  const [formData, setFormData] = useState({});
  
  // Yangi rasm tanlanganda vaqtinchalik ko'rsatish uchun state
  const [imagePreview, setImagePreview] = useState(null);

  const defaultAvatar = "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
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
      toast.error("Failed to load company data");
    } finally {
      setLoading(false);
    }
  };

  // --- RASMNI TANLASH VA O'QISH ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // 1. Ekranda ko'rinishi uchun vaqtinchalik URL yaratamiz
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // 2. Faylni darhol serverga yuborish (ixtiyoriy)
      // Yoki buni handleUpdate ichida formData bilan yuborsangiz ham bo'ladi
      try {
        const imageFormData = new FormData();
        imageFormData.append('file', file); // API-ga qarab 'image' yoki 'file' kaliti

        // Agar sizda rasmni alohida yuklaydigan API bo'lsa:
        // const res = await companyApi.uploadImage(imageFormData);
        // setFormData({ ...formData, profileimg_url: res.data.url });
        
        toast.info("Rasm tanlandi. Saqlash tugmasini bosing.");
        
        // Bu misolda rasmni formData ichiga saqlab qo'yamiz
        setFormData(prev => ({ ...prev, profileimg_file: file }));
      } catch (err) {
        toast.error("Rasm yuklashda xatolik");
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const targetId = company?.id || formData?.id;
    if (!targetId) return;

    try {
      // Agar rasm fayli bo'lsa, FormData ishlatish kerak bo'lishi mumkin
      // Hozirgi holatda oddiy JSON yuborilyapti:
      const { created_at, profileimg_file, ...updateData } = formData;
      
      const response = await companyApi.update(targetId, updateData);

      if (response.status === 200 || response.data) {
        const existingInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
        const updatedUserInfo = {
          ...existingInfo,
          company_name: updateData.company_name || existingInfo.company_name,
          city: updateData.city || existingInfo.city,
          profileimg_url: updateData.profileimg_url || existingInfo.profileimg_url
        };
        localStorage.setItem('user_info', JSON.stringify(updatedUserInfo));
        window.dispatchEvent(new Event('storage'));

        setIsModalOpen(false);
        fetchData();
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    }
  };

  return (
    <div className="p-1 sm:p-2 lg:p-8 bg-[#F9FAFB] min-h-screen font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 mt-8 md:mt-0">
        <h1 className="text-xl sm:text-2xl font-bold text-[#4B5563] bg-white px-6 py-4 rounded-2xl shadow-sm w-full md:flex-1 text-center md:text-left">
          Company profile
        </h1>
        <button className="bg-[#5CB85C] hover:bg-[#4cae4c] text-white w-full md:w-auto px-10 py-4 rounded-2xl font-bold shadow-md active:scale-95 transition-all">
          Post a Job
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] xl:grid-cols-[380px_1fr] gap-8">
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-sm relative h-fit border border-gray-50">
          <button onClick={() => setIsModalOpen(true)} className="absolute right-6 top-6 text-gray-300 hover:text-[#5CB85C] transition-colors">
            <Pencil size={20} />
          </button>

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 mb-4">
              <img
                // imagePreview bo'lsa yangi rasmni, bo'lmasa eskisini ko'rsatadi
                src={imagePreview || formData?.profileimg_url || defaultAvatar}
                className="w-full h-full rounded-full object-cover border-4 border-gray-50 shadow-md"
                alt="Profile"
              />
              <label className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-[#5CB85C] p-3 rounded-full text-white cursor-pointer shadow-lg hover:bg-[#4cae4c] transition-all">
                <Camera size={20} />
                <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageChange} // Rasm tanlanganda ishlaydi
                />
              </label>
            </div>
            <h2 className="text-xl font-bold text-[#1F2937] text-center mt-4 break-words w-full">
              {company?.company_name || 'Unknown Company'}
            </h2>
            <p className="text-gray-400 text-sm mt-1">{company?.industry || 'Industry not specified'}</p>
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-50">
            <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">Company info</h3>
            <InfoRow label="Since" value={company?.created_at ? new Date(company.created_at).getFullYear() : '2026'} />
            <InfoRow label="City" value={company?.city} />
            <InfoRow label="Country" value={company?.country} />
            <InfoRow label="Phone" value={company?.phone} />
            <InfoRow label="Email" value={company?.email} />
            <InfoRow label="Website" value={company?.website} isLink />
          </div>
        </div>

        {/* RIGHT COLUMN - Stats and About */}
        <div className="space-y-8 overflow-hidden">
          <div className="bg-gradient-to-br from-[#2B3263] via-[#7B4BA2] to-[#BD4CA1] rounded-[2rem] p-8 sm:p-12 text-white shadow-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70 mb-8 text-center">Dashboard Statistics</p>
            <div className="grid grid-cols-3 gap-4">
              <StatBox number={stats.active} label="Active" />
              <div className="border-x border-white/10"><StatBox number={`+${stats.posted}`} label="Posted" /></div>
              <StatBox number={stats.hired} label="Hired" />
            </div>
          </div>

          <div className="w-full bg-white rounded-[2rem] p-6 sm:p-10 shadow-sm border border-gray-100 relative min-h-[400px]">
            <button onClick={() => setIsModalOpen(true)} className="absolute right-8 top-8 text-gray-300 hover:text-blue-500 transition-colors">
              <Pencil size={20} />
            </button>
            <h3 className="font-bold text-gray-800 text-xl mb-6">About company</h3>
            <div className="text-gray-500 text-sm sm:text-base leading-relaxed break-all whitespace-pre-wrap">
              {company?.about_company || "Company information not provided..."}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative my-auto">
            <div className="p-8 flex justify-center items-center relative border-b border-gray-50">
              <h2 className="text-xl font-bold text-gray-700">Edit Company details</h2>
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 text-gray-400 hover:text-red-500 transition-colors">
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-8 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                <ModalInput label="Company name" value={formData?.company_name} onChange={v => setFormData({ ...formData, company_name: v })} />
                <ModalInput label="Phone" value={formData?.phone} onChange={v => setFormData({ ...formData, phone: v })} />
                <ModalInput label="Website" value={formData?.website} onChange={v => setFormData({ ...formData, website: v })} />
                <ModalInput label="Industry" value={formData?.industry} onChange={v => setFormData({ ...formData, industry: v })} />
                <ModalInput label="Country" value={formData?.country} onChange={v => setFormData({ ...formData, country: v })} />
                <ModalInput label="City" value={formData?.city} onChange={v => setFormData({ ...formData, city: v })} />
              </div>

              <div className="mt-8 text-left">
                <label className="block text-gray-500 font-bold mb-2 text-sm ml-1">About</label>
                <textarea
                  className="w-full h-[180px] border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-[#5CB85C]/50 focus:border-[#5CB85C] text-sm leading-relaxed resize-none break-all overflow-y-auto custom-scrollbar"
                  placeholder="Describe your company..."
                  value={formData?.about_company || ""}
                  onChange={(e) => setFormData({ ...formData, about_company: e.target.value })}
                />
              </div>

              <div className="mt-10 flex justify-center">
                <button type="submit" className="bg-[#5CB85C] text-white px-16 py-4 rounded-2xl font-bold shadow-lg hover:bg-[#4cae4c] active:scale-[0.98] transition-all uppercase tracking-widest text-sm">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-komponentlar (O'zgarishsiz qoldi)
const InfoRow = ({ label, value, isLink }) => (
  <div className="flex flex-row justify-between text-sm py-3 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 font-medium">{label}:</span>
    <span className="font-bold text-gray-700 truncate ml-4 text-right flex-1 max-w-[180px] sm:max-w-none">
      {isLink && value ? (
        <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">{value}</a>
      ) : (value || '---')}
    </span>
  </div>
);

const StatBox = ({ number, label }) => (
  <div className="flex flex-col items-center justify-center">
    <span className="text-2xl sm:text-4xl font-extrabold mb-2">{number}</span>
    <span className="text-[8px] sm:text-[11px] uppercase opacity-70 tracking-widest font-bold">{label}</span>
  </div>
);

const ModalInput = ({ label, value, onChange }) => (
  <div className="flex flex-col text-left">
    <label className="text-gray-400 font-bold mb-2 text-xs ml-1 uppercase tracking-wider">{label}</label>
    <input
      type="text"
      className="border border-gray-100 rounded-2xl p-4 focus:ring-2 focus:ring-[#5CB85C]/50 outline-none text-sm bg-gray-50/50 transition-all"
      value={value || ''}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

export default MyCompany;