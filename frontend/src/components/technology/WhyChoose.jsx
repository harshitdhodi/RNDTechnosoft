import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

const WhyChooseSection = () => {
    const { slug } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [slug]);

    // Render loading state
    if (loading) {
        return <div className="text-center py-16">Loading...</div>;
    }

    // Render error state
    if (error || !data) {
        return <div className="text-center py-16 text-red-500">Error: {error || 'No data found'}</div>;
    }

    return (
        <div className="bg-gray-50 py-16 px-4">
            <div className="max-w-8xl 2xl:px-28 mx-auto">
                {/* Header Section */}
                <div className="max-w-6xl 2xl:w-[60%] mx-auto">
                    <div className="text-center mb-12">
                        <ReactQuill
                            value={DOMPurify.sanitize(data.heading)}
                            readOnly={true}
                            theme={null}
                            className="text-gray-800 mb-6 leading-relaxed quill-heading"
                        />
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                    {data.card.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            {/* Image */}
                            <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                                <img
                                    src={`/api/logo/download/${feature.photo}`} // Use photo field from card
                                    alt={DOMPurify.sanitize(feature.heading) || 'Feature image'}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = '/fallback-image.png'; // Fallback image
                                    }}
                                />
                            </div>

                            {/* Content */}
                            <div
                                className="text-lg text-gray-800 mb-3"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feature.heading) }}
                            />
                            <div
                                className="text-gray-600 text-sm leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(feature.subHeading) }}
                            />
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <button className="bg-[#f3ca0d] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-lg transition-colors">
                        Hire {data.technologyId.imgTitle} Developer
                    </button>
                </div>
            </div>
        </div> 
    );
};

export default WhyChooseSection;