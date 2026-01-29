import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Talent.css';

function Talents() {
    const [talents, setTalents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTalents = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://workifybackend-production.up.railway.app/api/talent');

                if (!response.ok) {
                    throw new Error(`Server xatosi: ${response.status}`);
                }

                const data = await response.json();

                // Normalize qilish
                const normalizedData = data.map(talent => normalizeTalentData(talent));
                setTalents(normalizedData);
            } catch (err) {
                console.error('Fetch xatosi:', err);
                setError(err.message);

                // Mock ma'lumotlar
                setTalents(getMockTalents());
            } finally {
                setLoading(false);
            }
        };

        fetchTalents();
    }, []);

    // API ma'lumotlarini normalize qilish
    const normalizeTalentData = (talent) => {
        // ID
        const id = talent.id;

        // Ism va familiya
        const firstName = talent.first_name || talent.firstName || '';
        const lastName = talent.last_name || talent.lastName || '';

        // Kasb/Role - rasmda "Designer" ko'rinadi
        let role = '';
        if (talent.specialty) {
            role = talent.specialty;
        } else if (talent.occupation) {
            role = talent.occupation;
        } else {
            role = 'Designer'; // Default qilib "Designer" qo'ydim
        }

        // Shahar va mamlakat
        let city = '';
        if (talent.city && talent.country) {
            city = `${talent.city}, ${talent.country}`;
        } else if (talent.city) {
            city = talent.city;
        } else if (talent.location) {
            city = talent.location;
        } else if (talent.country) {
            city = talent.country;
        } else {
            city = 'Noma\'lum';
        }

        // Narx - minimum_salary maydoni bor
        const price = talent.minimum_salary || 1250;

        // Tavsif - about maydoni
        const description = talent.about ||
            "fact that a reader will be distracted by the readable content of a page when lo-sum is that it has a more-or-less normal distribution of letters, as opposed to usi";

        // Skills - skils maydoni JSON string formatda
        let skills = [];
        if (talent.skils) {
            try {
                // JSON stringini parse qilish
                const parsedSkills = JSON.parse(talent.skils);
                if (Array.isArray(parsedSkills)) {
                    skills = parsedSkills.map(item => {
                        if (item.skill && item.experience_years) {
                            return `${item.skill} (${item.experience_years} year${item.experience_years > 1 ? 's' : ''})`;
                        }
                        return item.skill || item;
                    }).filter(skill => skill);
                }
            } catch (e) {
                console.error('Skills parse qilishda xato:', e);
                // Agar parse qilishda xato bo'lsa, default skills
                skills = ["be Photoshop (1 year)", "Adobe Photoshop (1 year)", "Adobe XD (1 year)"];
            }
        }

        // Agar skills bo'sh bo'lsa, default qo'yish
        if (skills.length === 0) {
            skills = ["be Photoshop (1 year)", "Adobe Photoshop (1 year)", "Adobe XD (1 year)"];
        }

        // Rasm
        const image = talent.image;

        return {
            id,
            firstName,
            lastName,
            role,
            city,
            price,
            description,
            skills,
            image
        };
    };

    // Mock ma'lumotlar - rasmdagiga o'xshash
    // const getMockTalents = () => {
    //     return [
    //         {
    //             id: 1,
    //             firstName: "",
    //             lastName: "Ibrokhimov",
    //             role: "Designer",
    //             city: "Tashkent, Uzbekistan",
    //             price: 1250,
    //             description: "fact that a reader will be distracted by the readable content of a page when lo-sum is that it has a more-or-less normal distribution of letters, as opposed to usi",
    //             skills: ["be Photoshop (1 year)", "Adobe Photoshop (1 year)", "Adobe XD (1 year)"],
    //             image: null
    //         }
    //     ];
    // };

    // Format number with dots as thousand separators (1.250.00)
    const formatPrice = (price) => {
        if (!price && price !== 0) return '$0.00';

        const priceStr = price.toString();
        const parts = priceStr.split('.');
        const whole = parts[0];
        const decimal = parts[1] || '00';

        const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const formattedDecimal = decimal.padEnd(2, '0').slice(0, 2);

        return `$${formattedWhole}.${formattedDecimal}`;
    };

    // Format talent count with dots (1.256)
    const formatTalentCount = (count) => {
        return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    if (loading) {
        return (
            <div className="talents-container">
                <div className="talents-loading">
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (error && talents.length === 0) {
        return (
            <div className="talents-container">
                <div className="talents-error">
                    <p>Xato: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="talents-container">
            <div className="talents-header">
                <div className="header-main">
                    <div className="header-count">{formatTalentCount(talents.length)}.</div>
                    <h1 className="header-title"><span className="talent-text">talents</span></h1>
                </div>
            </div>
            <hr className='hr' />
            <div className="talents-list">
                {talents.length > 0 ? (
                    talents.map((talent) => (
                        <div key={talent.id} className="talent-card">
                            <div className="card-content">
                                {/* Avatar va ism bir qatorda */}
                                <div className="top-section">
                                    <div className="talent-avatar">
                                        {talent.image ? (
                                            <img
                                                src={talent.image}
                                                alt={`${talent.firstName} ${talent.lastName}`}
                                                className="avatar-image"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML =
                                                        `<div class="avatar-initials">
                                ${talent.firstName[0] || ''}${talent.lastName[0] || ''}
                            </div>`;
                                                }}
                                            />
                                        ) : (
                                            <div className="avatar-initials">
                                                {talent.firstName[0] || ''}{talent.lastName[0] || ''}
                                            </div>
                                        )}
                                    </div>

                                    <div className="avatar-name-container">
                                        <p className="talent-role">{talent.role}</p>
                                        <h3 className="talent-name">
                                            {talent.firstName} {talent.lastName}
                                        </h3>
                                    </div>

                                    {/* Narx va manzil o'ng tomonda */}
                                    <div className="talent-price-location">
                                        <div className="talent-location">
                                            <svg className="location-icon" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                            </svg>
                                            <span>{talent.city}</span>
                                        </div>
                                        <div className="talent-price">{formatPrice(talent.price)}</div>
                                    </div>
                                </div>

                                <div className="card-right">
                                    <div className="talent-description">
                                        <p>{talent.description}</p>
                                    </div>

                                    <hr className='hrrr' />

                                    <div className="talent-skills">
                                        <h4 className="skills-title">Required skills</h4>
                                        <div className="skills-list">
                                            {talent.skills && talent.skills.slice(0, 4).map((skill, idx) => (
                                                <span key={idx} className="skill-tag">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="talent-buttons">
                                        <Link to={`/talents/${talent.id}`} className="btn-view-profile">
                                            View profile
                                        </Link>
                                        <button className="btn-resume">
                                            Resume
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-talents">
                        <p>Hozircha talentlar mavjud emas...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Talents;