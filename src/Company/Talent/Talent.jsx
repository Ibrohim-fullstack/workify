import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { talentApi } from '../../services/api';

function Talents() {
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                setLoading(true);
                const response = await talentApi.getAll();
                setTalents(response.data || []);
            } catch (err) {
                console.error('API Error:', err);
                setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        fetchTalents();
    }, []);

    const formatCount = (count) => {
        return new Intl.NumberFormat('de-DE').format(count);
    };

    const formatPrice = (price) => {
        const value = price || 0;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(value);
    };

    const parseSkills = (skillsStr) => {
        try {
            if (!skillsStr) return [];
            const parsed = JSON.parse(skillsStr);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    };

    if (loading) return <div className="flex justify-center items-center min-h-screen text-gray-500 font-medium">Yuklanmoqda...</div>;
    if (error) return <div className="flex justify-center items-center min-h-screen text-red-500 font-medium">{error}</div>;

    return (
        <div className="bg-[#fcfcfc] min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* HEADER QISMI */}
                <div className="mb-6">
                    <div className="flex items-baseline gap-2 pb-3">
                        <span className="text-[20px] md:text-[25px] font-medium text-[#404040] tracking-tight">
                            {formatCount(talents.length)}
                        </span>
                        <span className="text-[20px] md:text-[25px] font-medium text-[#404040] lowercase tracking-tight">
                            talents
                        </span>
                    </div>
                    <div className="h-[1.5px] w-full bg-[#e5e7eb]"></div>
                </div>

                {/* TALENTLAR RO'YXATI */}
                <div className="space-y-5">
                    {talents.map((talent) => {
                        const skills = parseSkills(talent.skils);

                        return (
                            <div key={talent.id} className="bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300">

                                {/* KARTA YUQORI QISMI */}
                                <div className="p-5 md:p-7">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                                        <div className="flex items-center gap-4 md:gap-5">
                                            {/* Avatar */}
                                            <div className="relative shrink-0">
                                                <img
                                                    src={talent.image || "https://via.placeholder.com/150"}
                                                    alt={talent.last_name}
                                                    className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover grayscale border border-gray-100"
                                                />
                                            </div>
                                            <div>
                                                <h2 className="text-lg md:text-2xl font-bold text-[#3a3a3a] leading-tight">
                                                    {talent.specialty || talent.occupation || "Designer"}
                                                </h2>
                                                <p className="text-gray-700 text-[16px] md:text-[20px] font-medium mt-1">
                                                    {talent.first_name} {talent.last_name}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Joylashuv va Narx */}
                                        <div className="flex flex-row md:flex-col justify-between items-center md:items-end w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0">
                                            <div className="flex items-center text-[#4b5563] text-sm md:text-lg font-semibold">
                                                <svg className="w-4 h-4 md:w-5 md:h-5 mr-1.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {talent.city || talent.location || "Uzbekistan"}
                                            </div>
                                            <div className="text-[18px] md:text-[25px] font-bold text-[#343434] tracking-tight mt-2">
                                                {formatPrice(talent.minimum_salary)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio / About */}
                                    <div className="mt-6">
                                        <p className="text-[#484f57] text-[15px] md:text-[18px] leading-relaxed line-clamp-2">
                                            {talent.about || "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content "}
                                        </p>
                                    </div>
                                </div>

                                {/* AJRATUVCHI CHIZIQ */}
                                <div className="border-t border-gray-100 mx-6"></div>

                                {/* KARTA PASTKI QISMI */}
                                <div className="p-5 md:p-8">
                                    <div className="flex flex-col space-y-6">
                                        <div>
                                            <h4 className="text-[#6e7074] text-[14px] md:text-[18px] font-semibold uppercase tracking-wider mb-4">Required skills</h4>
                                            <div className="flex flex-wrap gap-2 md:gap-2.5">
                                                {skills.length > 0 ? (
                                                    skills.map((s, idx) => (
                                                        <span key={idx} className="px-3 py-1.5 md:px-4 md:py-2 bg-[#f1f5f9] text-[#475569] text-sm md:text-base font-medium rounded-lg border border-slate-100">
                                                            {s.skill} ({s.experience_years} {parseFloat(s.experience_years) > 1 ? 'years' : 'year'})
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic font-medium">No skills specified</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Tugmalar */}
                                        <div className="flex flex-col sm:flex-row justify-end gap-3 md:gap-4 mt-2">
                                            <Link
                                                to={`/talents/${talent.id}`}
                                                className="w-full sm:w-auto px-6 md:px-[60px] py-3 md:py-[15px] bg-[#1D3D54] text-white text-base md:text-[20px] font-[650] rounded-lg hover:bg-[#152c3d] transition-all shadow-sm text-center"
                                            >
                                                View profile
                                            </Link>
                                            <button className="w-full sm:w-auto px-6 md:px-[40px] py-3 md:py-[15px] border-2 border-[#1D3D54] text-[#1D3D54] text-base md:text-[20px] font-[650] rounded-lg md:rounded-[15px] hover:bg-slate-50 transition-all text-center">
                                                Resume
                                            </button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>

                {talents.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-400 font-medium">Hozircha talentlar mavjud emas.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Talents;