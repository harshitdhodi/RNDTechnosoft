import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdClose } from 'react-icons/io';
import { FaPlay, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import ReviweHeding from "../WhatWeDo/ReviewHeading";

const Gallery = () => {
    const [fullscreenVideo, setFullscreenVideo] = useState(null);
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`/api/testimonial/getTestimonialsFront`, { withCredentials: true });
                setReviews(response.data.data);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        };
        fetchReviews();
    }, []);

    const renderRating = (rating) => {
        const totalStars = 5;
        const filledStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const unfilledStars = totalStars - filledStars - (hasHalfStar ? 1 : 0);

        return (
            <div className="flex items-center">
                {[...Array(filledStars)].map((_, i) => (
                    <FaStar key={`filled-${i}`} className="text-yellow-400 w-4 h-4" />
                ))}
                {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 w-4 h-4" />}
                {[...Array(unfilledStars)].map((_, i) => (
                    <FaRegStar key={`unfilled-${i}`} className="text-yellow-400 w-4 h-4" />
                ))}
            </div>
        );
    };

    return (
        <div className="bg-gray-100  ">
            <div className="">
                <ReviweHeding />
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 w-[90%] mx-auto py-16">
                    {reviews.map((item) => (
                        <div key={item._id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105">
                            <div className="relative h-[20rem]">
                                {item.photo.length > 0 && (
                                    <img
                                        className="w-full h-full"
                                        src={`/api/image/download/${item.photo[0]}`}
                                        alt={item.alt[0] || "testimonial-photo"}
                                    />
                                )}
                                {item.video && (
                                    <button
                                        onClick={() => setFullscreenVideo(`/api/video/download/${item.video}`)}
                                        className="absolute bottom-4 right-4 bg-red-600 text-white p-3 rounded-full hover:bg-red-700 transition-colors duration-300"
                                        aria-label="Play video"
                                    >
                                        <FaPlay className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                            <div className="p-6">
                                <p className="text-gray-600 mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: item.testimony }}></p>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">{item.designation}</p>
                                    </div>
                                    {item.rating && renderRating(item.rating)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {fullscreenVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
                    <div className="relative w-full h-full max-w-4xl max-h-screen p-4">
                        <video
                            className="w-full h-full object-contain"
                            src={fullscreenVideo}
                            controls
                            autoPlay
                        />
                        <button
                            className="absolute top-2 right-2 text-white bg-red-600 rounded-full p-2 hover:bg-red-700 transition-colors duration-300"
                            onClick={() => setFullscreenVideo(null)}
                            aria-label="Close video"
                        >
                            <IoMdClose className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;