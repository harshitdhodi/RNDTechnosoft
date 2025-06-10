const WhyChooseSection = () => {
    const features = [
        {
            title: "Skilled React JS Professionals",
            description:
                "Our in-house team of React JS experts builds high-performing web solutions tailored to your vision. We blend deep technical know-how with practical experience to deliver seamless user experiences.",
        },
        {
            title: "Proven Development Excellence",
            description:
                "With successful projects across industries, we bring a track record of consistent, scalable React JS solutions. Our results speak through performance, reliability, and client satisfaction.",
        },
        {
            title: "Dedicated In-House Team",
            description:
                "All development is managed under one roof by our committed team for greater collaboration and control. This ensures quality, speed, and accountability from start to finish.",
        },
        {
            title: "Future-Ready React Solutions",
            description:
                "We build modern React JS apps with intuitive UIs and powerful backends that grow with your business. Our focus is always on performance, scalability, and innovation.",
        },
        {
            title: "Agile Execution Process",
            description:
                "We implement agile methods to deliver faster outcomes, improve responsiveness, and embrace evolving project needs. This allows for smarter, more efficient workflows.",
        },
        {
            title: "Client-First Approach",
            description:
                "Your business priorities shape our development roadmap. We foster long-term partnerships by delivering real value with transparency, integrity, and trust.",
        },
    ]

    return (
        <div className="bg-gray-50 py-16 px-4">
            <div className="max-w-8xl 2xl:px-28 mx-auto">
                {/* Header Section */}
                <div  className="max-w-6xl 2xl:w-[60%]  mx-auto">

                <div className="text-center  mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-relaxed">
                        Why Choose RND Technosoft   for React JS Development Services?
                    </h2>
                    <p className="text-gray-600 max-w-4xl mx-auto leading-relaxed">
                        At RND Technosoft  , we provide expert <span className="text-blue-500 font-medium">Angular JS</span>{" "}
                        development to build dynamic, scalable, and high-performance applications. Our skilled team delivers
                        innovative, user-friendly solutions that align with your business goals and enhance performance across all
                        platforms.
                    </p>
                </div>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center mb-4">
                                <div className="w-8 h-8 bg-yellow-600 rounded"></div>
                            </div>

                            {/* Content */}
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">{feature.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="text-center">
                    <button className="bg-[#f3ca0d] hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-lg transition-colors">
                        Hire React JS Developer
                    </button>
                </div>
            </div>
        </div>
    )
}

export default WhyChooseSection
