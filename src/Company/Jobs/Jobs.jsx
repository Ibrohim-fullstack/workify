import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobApi } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await jobApi.getAll();
                setJobs(response.data || []);
            } catch (err) {
                console.error('Fetch error:', err);
                setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const formatDate = (dateString) => {
        try {
            if (!dateString) return 'recently';
            return formatDistanceToNow(new Date(dateString), { addSuffix: true });
        } catch (e) { return 'recently'; }
    };

    const parseSkills = (skillsData) => {
        if (!skillsData) return [];
        if (typeof skillsData === 'string') {
            return skillsData.split(',').map(s => s.trim()).filter(s => s !== "");
        }
        if (Array.isArray(skillsData)) return skillsData;
        return [];
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">Yuklanmoqda...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500 font-medium">{error}</div>;

    return (
        <div className="bg-[#fcfcfc] min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="mb-6">
                    <div className="flex items-baseline gap-2 pb-3">
                        <span className="text-[20px] md:text-[25px] font-medium text-[#404040] tracking-tight">
                            {new Intl.NumberFormat('de-DE').format(jobs.length)}
                        </span>
                        <span className="text-[20px] md:text-[25px] font-medium text-[#404040] lowercase tracking-tight">jobs</span>
                    </div>
                    <div className="h-[1.5px] w-full bg-[#e5e7eb]"></div>
                </div>

                {/* JOBS LIST */}
                <div className="space-y-5">
                    {jobs.map((job) => {
                        const skills = parseSkills(job.skils);
                        const company = job.company || {};

                        return (
                            <div key={job.id} className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">

                                {/* 1. TOP SECTION */}
                                <div className="p-5 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div className="flex items-center gap-4 md:gap-5">
                                            {/* Logo */}
                                            <div className="w-12 h-12 md:w-16 md:h-16 bg-[#00A193] rounded-full flex items-center justify-center overflow-hidden shrink-0">
                                                {company.profileimg_url ? (
                                                    <img src={company.profileimg_url} alt="logo" className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-white text-xl md:text-2xl font-bold">
                                                        {company.company_name?.substring(0, 2).toUpperCase() || 'TC'}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Company details */}
                                            <div>
                                                <h3 className="text-lg md:text-2xl font-bold text-[#3a3a3a] leading-tight">
                                                    {company.company_name || 'TechCells'}
                                                </h3>
                                                <p className="text-gray-700 text-[18px] md:text-[26px] font-sans font-[400]">
                                                    {company.industry || 'Computer Software'}
                                                </p>
                                                <div className="flex items-center gap-1 mt-1">
                                                    <div className="flex text-yellow-400 text-[20px] md:text-[30px] tracking-tighter transform md:-translate-y-3 -translate-y-1">★★★★<span className="text-gray-300">★</span></div>
                                                    <span className="text-gray-500 text-[12px] md:text-[15px] font-semibold ml-1 transform md:-translate-y-2 -translate-y-0.5">(4.0) 1K reviews</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meta data */}
                                        <div className="flex flex-row md:flex-col justify-between md:items-end items-center gap-1.5 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                            <div className="flex items-center text-[#4b5563] text-sm md:text-lg font-semibold">
                                                <svg className="w-4 h-4 mr-1 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                </svg>
                                                {job.location || 'Tashkent'}
                                            </div>
                                            <div className="flex flex-col md:items-end items-start">
                                                <span className="text-gray-600 text-[14px] md:text-[20px] font-medium">{formatDate(job.createdAt)}</span>
                                                <span className="mt-1 bg-[#52D195] text-white text-[9px] md:text-[11px] font-black px-2 md:px-2.5 py-1 md:py-2.5 rounded-lg md:rounded-xl uppercase tracking-widest mt-4">
                                                    Now hiring
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 mx-6"></div>

                                {/* 2. MIDDLE SECTION */}
                                <div className="p-5 md:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                                        <h2 className="text-[18px] md:text-[22px] font-bold text-[#515151] tracking-tight">
                                            {job.occupation || 'Job Title'}
                                        </h2>
                                        <div className="text-[20px] md:text-[25px] font-bold text-[#343434] tracking-tight">
                                            ${job.salary_min}-{job.salary_max}
                                        </div>
                                    </div>
                                    <p className="text-[#484f57] text-[15px] md:text-[18px] leading-relaxed line-clamp-2">
                                        {job.description || "Ma'lumot berilmagan."}
                                    </p>
                                </div>

                                {/* 3. BOTTOM SECTION */}
                                <div className="p-5 md:p-6 pt-0">
                                    <div className="flex flex-col md:flex-row justify-between items-stretch md:items-end gap-6">
                                        <div className="w-full">
                                            <h4 className="text-[#1a1a1a] text-[13px] md:text-[14px] font-bold mb-3">Required skills:</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {skills.length > 0 ? (
                                                    skills.map((skill, idx) => (
                                                        <span key={idx} className="px-3 py-1.5 md:px-4 md:py-2 bg-[#f1f5f9] text-[#475569] text-[12px] md:text-[14px] font-semibold rounded-lg border border-slate-100">
                                                            {skill}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-sm italic">Skills not listed</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Action buttons */}
                                        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                                            <button className="w-full sm:w-auto px-6 md:px-[60px] py-3 md:py-[15px] bg-[#1D3D54] text-white text-[16px] md:text-[20px] font-[650] rounded-lg hover:bg-[#152c3d] transition-all shadow-sm">
                                                Quick apply
                                            </button>
                                            <Link
                                                to={`/jobs/${job.id}`}
                                                className="w-full sm:w-auto px-6 md:px-[30px] py-3 md:py-[15px] border-2 border-[#1D3D54] text-[#1D3D54] text-[16px] md:text-[20px] font-[650] rounded-lg hover:bg-slate-50 transition-all text-center whitespace-nowrap"
                                            >
                                                View job post
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Jobs;