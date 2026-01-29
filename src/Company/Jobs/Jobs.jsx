import { useState, useEffect } from 'react';
import './Jobs.css';
import { formatDistanceToNow } from 'date-fns';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://workifybackend-production.up.railway.app/api/jobs');

                if (!response.ok) {
                    throw new Error(`Server xatosi: ${response.status}`);
                }

                const data = await response.json();

                if (!data || data.length === 0) {
                    setJobs(getMockJobs());
                } else {
                    const formattedData = data.map(job => formatJobData(job));
                    setJobs(formattedData);
                }
            } catch (err) {
                console.error('Fetch xatosi:', err);
                setError(err.message);
                setJobs(getMockJobs());
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return formatDistanceToNow(date, { addSuffix: true });
        } catch (e) {
            return 'recently';
        }
    };

    const getCompanyLogo = (companyName) => {
        if (!companyName) return 'TC';

        const words = companyName.split(' ');
        if (words.length >= 2) {
            return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
        }
        return companyName.substring(0, 2).toUpperCase();
    };

    const parseSkills = (skillsString) => {
        if (!skillsString) return [];

        if (typeof skillsString === 'string') {
            return skillsString.split(',').map(skill => skill.trim());
        }

        if (Array.isArray(skillsString)) {
            return skillsString;
        }

        return [];
    };

    const formatJobData = (apiJob) => {
        let companyName = "TechCells";
        if (apiJob.company && apiJob.company.company_name) {
            companyName = apiJob.company.company_name;
        }

        let companyType = "Computer Software";
        if (apiJob.company && apiJob.company.industry) {
            companyType = apiJob.company.industry;
        }

        const rating = 4.0;
        const reviews = "1K";

        let jobTitle = "UX/UI Designer";
        if (apiJob.occupation) {
            jobTitle = apiJob.occupation;
        }

        let salaryRange = "$400-1,000";
        if (apiJob.salary_min !== undefined && apiJob.salary_max !== undefined) {
            salaryRange = `$${apiJob.salary_min}-${apiJob.salary_max}`;
        }

        let description = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.";
        if (apiJob.description) {
            description = apiJob.description;
        }

        // Skills - API dan kelgan skills ni ishlatamiz
        let skills = parseSkills(apiJob.skills);

        // Agar skills bo'sh bo'lsa, specialty ni ishlatamiz
        if (skills.length === 0 && apiJob.specialty) {
            skills = [apiJob.specialty];
        }

        // Agar hali ham bo'sh bo'lsa, default skills
        if (skills.length === 0) {
            skills = [
                "Figma (2 years)",
                "Adobe Photoshop (1 year)",
                "Responsive UX/UI (6 years)",
                "Adobe XD (1 year)"
            ];
        }

        let location = 'Tashkent, Uzbekistan';
        if (apiJob.location) {
            location = apiJob.location;
        } else if (apiJob.company && apiJob.company.city) {
            location = `${apiJob.company.city}, ${apiJob.company.country || 'Uzbekistan'}`;
        }

        let jobType = 'Full-time';
        if (apiJob.job_type) {
            jobType = apiJob.job_type;
        }

        let createdAt = 'recently';
        if (apiJob.createdAt) {
            createdAt = formatDate(apiJob.createdAt);
        }

        return {
            id: apiJob.id || Date.now().toString(),
            companyName,
            companyType,
            rating,
            reviews,
            jobTitle,
            salaryRange,
            description: description.length > 150 ? description.substring(0, 150) + '...' : description,
            skills,
            location,
            jobType,
            createdAt,
            workplaceType: apiJob.workplace_type || 'Office',
            specialty: apiJob.specialty || 'Software Development'
        };
    };

    // const getMockJobs = () => {
    //     return [
    //         {
    //             id: '1',
    //             companyName: 'LeverX',
    //             companyType: 'Software',
    //             rating: 4.0,
    //             reviews: '1K',
    //             jobTitle: 'Backend Developer',
    //             salaryRange: '$500-1,200',
    //             description: 'We are looking for a skilled backend developer',
    //             skills: ["Node.js", "SQL", "MongoDB", "Express.js", "REST API", "Git", "Docker", "AWS"],
    //             location: 'Tashkent, Uzbekistan',
    //             jobType: 'Full-time',
    //             createdAt: '2 days ago',
    //             workplaceType: 'Remote',
    //             specialty: 'Node.js'
    //         },
    //         {
    //             id: '2',
    //             companyName: 'ITpark',
    //             companyType: 'Technology',
    //             rating: 4.2,
    //             reviews: '2.5K',
    //             jobTitle: 'Frontend Developer',
    //             salaryRange: '$600-1,500',
    //             description: 'We are looking for an experienced frontend developer with React skills',
    //             skills: ["React", "JavaScript", "TypeScript", "CSS", "HTML5", "Redux", "Webpack", "SASS", "Bootstrap"],
    //             location: 'Namangan, Uzbekistan',
    //             jobType: 'Full-time',
    //             createdAt: '1 week ago',
    //             workplaceType: 'Office',
    //             specialty: 'React.js'
    //         }
    //     ];
    // };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<span key={i} className="star">★</span>);
            } else {
                stars.push(<span key={i} className="star">☆</span>);
            }
        }

        return stars;
    };

    if (loading) {
        return (
            <div className="jobs-container">
                <div className="jobs-loading">
                    <p>Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="jobs-container">
            <div className="jobs-header">
                <div className="header-main">
                    <div className="header-count">
                        <span className="count-number">{jobs.length}. jobs</span>
                    </div>
                </div>
            </div>

            <hr className='hrr'/>

            <div className="jobs-list">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job.id} className="job-card">
                            <div className="card-content">
                                {/* Kompaniya sarlavhasi */}
                                <div className="company-header">
                                    <div className="company-left">
                                        <div className="company-logo">
                                            {getCompanyLogo(job.companyName)}
                                        </div>
                                        <div className="company-details">
                                            <h2 className="company-name">{job.companyName}</h2>
                                            <p className="company-type">{job.companyType}</p>
                                            <div className="company-rating">
                                                <div className="stars">{renderStars(job.rating)}</div>
                                                <span className="rating-number">({job.rating.toFixed(1)})</span>
                                                <span className="reviews">{job.reviews} reviews</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* O'ng tomondagi ma'lumotlar - faqat lokatsiya, vaqt, workplace type */}
                                    <div className="company-right">
                                        <div className="job-meta">
                                            <div className="meta-item location-item">
                                                <span className="meta-icon"></span>
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="meta-item created-item">
                                                <span className="meta-icon"></span>
                                                <span>{job.createdAt}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span className="meta-icon"></span>
                                                <button className='hiri'>Now hiring</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="divider"></div>

                                <div className="job-title-section">
                                    <h3 className="job-title">{job.jobTitle}</h3>
                                    <div className="job-salary">{job.salaryRange}</div>
                                </div>

                                <div className="job-description">
                                    <p>{job.description}</p>
                                </div>

                                <div className="job-footer">
                                    {/* Required skills - pastgi chap burchakda */}
                                    <div className="job-skills">
                                        <h4 className="skills-title">Required skills:</h4>
                                        <ul className="skills-list">
                                            {job.skills && job.skills.map((skill, index) => (
                                                <li key={index} className="skill-item">{skill}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Tugmalar - pastgi o'ng burchakda, yonma-yon */}
                                    <div className="job-buttons">
                                        <button
                                            className="btn-quick-apply"
                                            onClick={() => console.log('Quick apply:', job.id)}
                                        >
                                            Quick apply
                                        </button>
                                        <button
                                            className="btn-view-job"
                                            onClick={() => console.log('View job:', job.id)}
                                        >
                                            View job post
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-jobs">
                        <p>Hozircha ishlar mavjud emas...</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Jobs;