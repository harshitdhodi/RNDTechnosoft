import React, { useState, useRef, useEffect } from 'react';
import { gsap } from "gsap";
import { RiArrowDownSLine, RiArrowRightSLine } from "react-icons/ri";
import axios from 'axios';

const WebSolution = () => {
    const [openIndex, setOpenIndex] = useState(null);
    const answerRefs = useRef([]);
    const [webSolutionData, setWebSolutionData] = useState(null);
    const [videoUrl, setVideoUrl] = useState("");

    useEffect(() => {
        if (openIndex !== null) {
            gsap.fromTo(
                answerRefs.current[openIndex],
                { height: 0, opacity: 0 },
                { height: "auto", opacity: 1, duration: 0.3, ease: "power1.out" }
            );
        }
    }, [openIndex]);

    const toggleFAQ = (index) => {
        if (openIndex === index) {
            gsap.to(answerRefs.current[index], {
                height: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power1.out",
                onComplete: () => setOpenIndex(null),
            });
        } else {
            setOpenIndex(index);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/api/content/types/webSolution', { withCredentials: true });
                const data = response.data[0];
                setWebSolutionData(data);
                setVideoUrl(`/api/video/download/${data.video}`);
            } catch (error) {
                console.error("Error fetching web solution data:", error);
            }
        };

        fetchData();
    }, []);

    if (!webSolutionData) {
        return null
    }

    return (
        <section className="relative bg-[#333] overflow-hidden">
            {/* Shape Divider */}
            <div className="absolute inset-x-0 top-0">
                <svg
                    className="w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="none"
                >
                    <path
                        className="fill-current text-white"
                        d="M421.9,6.5c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.9,23.5,100.5,35.7c75.8,32.2,133.7,44.5,192.6,49.7c23.6,2.1,48.7,3.5,103.4-2.5c54.7-6,106.2-25.6,106.2-25.6V0H0v30.3c0,0,72,32.6,158.4,30.5c39.2-0.7,92.8-6.7,134-22.4c21.2-8.1,52.2-18.2,79.7-24.2C399.3,7.9,411.6,7.5,421.9,6.5z"
                    />
                </svg>
            </div>
            <div className='mt-44  flex flex-col items-start justify-center mx-8 md:mx-14 lg:mx-36 '>
                <div>
                    <h2 className="sm:text-5xl text-3xl font-semibold mb-4 font-playfair text-white" dangerouslySetInnerHTML={{ __html: webSolutionData.heading }}></h2>
                </div>
                <div>
                    <p className="sm:text-xl text-base mb-8 w-full text-white text-justify font-inter sm:pt-10 pt-7" dangerouslySetInnerHTML={{ __html: webSolutionData.description }}></p>
                </div>

                <div className="flex flex-col lg:flex-row w-full gap-8 lg:gap-16 mt-4">
                    <div className="lg:w-1/2">
                     
                        {webSolutionData.questions.map((faq, index) => (
                            <div key={index} className="mb-4">
                                <div className="flex items-center justify-between px-4 sm:px-7 md:px-10 lg:px-14 bg-[#f9f7f1] rounded-[20px] py-3 sm:py-4 lg:py-[14px] cursor-pointer" onClick={() => toggleFAQ(index)}>
                                    <h3 className="text-base sm:text-lg lg:text-xl font-inter font-medium">{faq.question}</h3>
                                    <span className="text-lg sm:text-xl lg:text-2xl">{openIndex === index ? <RiArrowDownSLine /> : <RiArrowRightSLine />}</span>
                                </div>
                                <div
                                    ref={(el) => (answerRefs.current[index] = el)}
                                    className={`overflow-hidden text-white font-inter ${openIndex === index ? 'block' : 'hidden'}`}
                                >
                                    <div className="p-3 sm:p-4 lg:p-5 px-8 sm:px-10 lg:px-12 font-inter text-sm sm:text-base lg:text-base text-justify">
                                        <p dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:w-1/2">
                    <video controls className="w-full h-auto mb-8">
                            <source src={videoUrl} type="video/mp4" title={webSolutionData.videotitle} />
                            Your browser does not support the video tag.
                        </video>

                    </div>
                </div>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7 mb-8  pb-32">
                {webSolutionData.subsections.map((item, index) => (
                            <div key={index} className="text-center space-y-4">
                                <img
                                    src={`/api/image/download/${item.photo}`}
                                    alt={item.photoAlt}
                                    title={item.imgtitle}
                                    className="sm:w-28  sm:h-28 lg:w-32 lg:h-32  w-28 h-28  object-cover mx-auto"                                />
                                <p className="lg:text-base text-sm font-semibold font-inter text-white" dangerouslySetInnerHTML={{ __html: item.description }}></p>
                            </div>
                        ))}
                </div>
            </div>

            {/* Shape Divider Bottom */}
            <div className="absolute inset-x-0 bottom-0">
                <svg
                    className="w-full"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1000 100"
                    preserveAspectRatio="none"
                >
                    <path
                        className="fill-current text-white"
                        d="M421.9,93.5c22.6,2.5,51.5-0.4,75.5-5.3c23.6-4.9,70.9-23.5,100.5-35.7c75.8-32.2,133.7-44.5,192.6-49.7c23.6-2.1,48.7-3.5,103.4,2.5c54.7,6,106.2,25.6,106.2,25.6V100H0V69.7c0,0,72-32.6,158.4-30.5c39.2,0.7,92.8,6.7,134,22.4c21.2,8.1,52.2,18.2,79.7,24.2C399.3,92.1,411.6,92.5,421.9,93.5z"
                    />
                </svg>
            </div>
        </section>
    );
};

export default WebSolution;
