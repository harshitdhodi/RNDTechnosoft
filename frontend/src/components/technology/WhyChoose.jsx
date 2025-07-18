import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';
import img1 from '../../images/HowRnd/agile.png';

const WhyChooseSection = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to normalize heading tags to <h2>
    const normalizeHeading = (html) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = DOMPurify.sanitize(html, {
            FORBID_ATTR: ['style', 'class'],
            FORBID_TAGS: ['h1', 'h3', 'h5'],
            ADD_TAGS: ['h2'],
        });
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        return `<h2>${textContent}</h2>`;
    };

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/technologySecData/get/${slug}?type=Why Choose`);
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const result = await response.json();
                setData(result[0]);
                console.log('Fetched data for slug:', result[0]);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Quill configuration
    const quillConfig = {
        readOnly: true,
        theme: null,
        modules: {
            toolbar: false,
        },
    };

    // Render loading state
    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-md">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Render error state
    if (error || !data) {
        return (
            <div className="text-center py-16 text-red-500">
                Error: {error || 'No data found'}
            </div>
        );
    }
    return (
        <div className="bg-gray-50  px-4">
            <div className="max-w-8xl 2xl:px-28 mx-auto services-landing">
                {/* Header Section */}
                <div className="max-w-6xl 2xl:w-[80%] mx-auto">
                    <div className=" mb-12">
                        <ReactQuill
                            value={DOMPurify.sanitize(data.heading, {
                                FORBID_ATTR: ['style', 'class'],
                                ADD_TAGS: ['h2'],
                            })}
                            {...quillConfig}
                            className="quill-heading border-none"
                        />
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2  gap-8 mb-12">
                    {data.card.map((feature, index) => (
                        <div
                            key={index}
                            className="group relative bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            role="article"
                            aria-label={`Feature: ${feature.heading || 'Feature Card'}`}
                        >
                            {/* Image */}
                            <div className="mb-4 flex justify-start group-hover:scale-105 transition-transform duration-300">
                                {feature.photo ? (
                                    <img
                                        src={`/api/logo/download/${feature.photo}`}
                                        alt={feature.altName || DOMPurify.sanitize(feature.heading, { ALLOWED_TAGS: [] }) || 'Feature image'}
                                        title={feature.imgTitle || DOMPurify.sanitize(feature.heading, { ALLOWED_TAGS: [] })}
                                        className="w-16 h-16 object-contain"
                                        loading="lazy"
                                        onError={(e) => {
                                            console.error(`Failed to load image: /api/logo/download/${feature.photo}`);
                                            e.target.src = img1; // Fallback to dummy image without hiding the img tag
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={img1}
                                        alt="Fallback icon"
                                        className="object-contain w-16 h-16"
                                        loading="lazy"
                                    />
                                )}
                            </div>

                            {/* Feature Heading */}
                            <ReactQuill
                                value={normalizeHeading(feature.heading)}
                                {...quillConfig}
                                className="quill-heading2 text-lg font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-300 border-none"
                            />

                            {/* Feature Description */}
                            <ReactQuill
                                value={DOMPurify.sanitize(feature.subHeading, {
                                    FORBID_ATTR: ['style', 'class'],
                                    ADD_TAGS: ['p'],
                                })}
                                {...quillConfig}
                                className="quill-description text-gray-600 text-sm leading-relaxed border-none"
                            />

                            {/* Hover effect overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-100/10 to-indigo-100/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <button className="bg-[#f3ca0d] text-white px-4 py-2 rounded-lg font-medium text-lg transition-colors">
                        Hire {data.technologyId.imgTitle} Developer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseSection;