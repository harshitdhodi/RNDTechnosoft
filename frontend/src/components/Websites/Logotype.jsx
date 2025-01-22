import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function Logotype() {
  const { slug } = useParams();
  const [logotypes, setLogotypes] = useState([]);
  const [heading, setHeading] = useState("");
  const [subheading, setSubheading] = useState("");

  //   const cardData = [
  //     {
  //       id: 1,
  //       name: "John Doe",
  //       role: "Architect & Engineer",
  //       image: "img_avatar.png",
  //       description: "We love that guy",
  //     },
  //     {
  //       id: 2,
  //       name: "Jane Smith",
  //       role: "Designer",
  //       image: "img_avatar.png",
  //       description: "Creative mind",
  //     },
  //     {
  //       id: 3,
  //       name: "Mike Johnson",
  //       role: "Developer",
  //       image: "img_avatar.png",
  //       description: "Code wizard",
  //     },
  //     {
  //       id: 4,
  //       name: "Emily Davis",
  //       role: "Project Manager",
  //       image: "img_avatar.png",
  //       description: "Organizational genius",
  //     },
  //     {
  //       id: 5,
  //       name: "Chris Lee",
  //       role: "Tester",
  //       image: "img_avatar.png",
  //       description: "Quality assurance",
  //     },
  //     {
  //       id: 6,
  //       name: "Anna Brown",
  //       role: "Content Writer",
  //       image: "img_avatar.png",
  //       description: "Wordsmith",
  //     },
  //     {
  //       id: 7,
  //       name: "David Wilson",
  //       role: "SEO Specialist",
  //       image: "img_avatar.png",
  //       description: "Traffic master",
  //     },
  //     {
  //       id: 8,
  //       name: "Sophia Clark",
  //       role: "Marketing Specialist",
  //       image: "img_avatar.png",
  //       description: "Growth hacker",
  //     },
  //   ];

  const fetchLogotypes = async () => {
    try {
      const response = await axios.get(`/api/logotype/getLogotype`, {
        withCredentials: true,
      });
      setLogotypes(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchLogotypes();
  }, []);

  const fetchHeadings = async () => {
    try {
      const response = await axios.get(
        "/api/pageHeading/heading?pageType=logotype",
        { withCredentials: true }
      );
      const { heading, subheading } = response.data;
      setHeading(heading || "");
      setSubheading(subheading || "");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHeadings();
  }, []);

  return (
    slug === "logo-design" && (
      <div className="flex flex-col items-center justify-center md:mb-16">
        <p className="text-[30px] md:text-[40px] font-serif mb-4 text-center"> {heading}</p>
        <p className="text-[20px] mb-8 text-gray-700 text-center">{subheading}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mx-auto justify-center">
          {logotypes.map((card) => (
            <div key={card.id} className="m-4 w-64 h-64 [perspective:1000px]">
              <div className="relative w-full h-full transition-transform duration-500  [transform-style:preserve-3d] hover:[transform:rotateX(180deg)]">
                <div className="absolute w-full h-full [backface-visibility:hidden]  shadow-lg bg-[#f7dc86] flex flex-col items-center justify-center p-4">
                  <h1 className="text-xl font-bold text-center">{card.title}</h1>
                  <img
                    src={`/api/image/download/${card.photo[0]}`}
                    alt={card.alt[0]}
                    title={card.title[0]}
                    className="w-full h-full object-contain "
                  />
                </div>
                <div className="absolute w-full h-full [backface-visibility:hidden] shadow-lg bg-black text-white flex flex-col items-center justify-center [transform:rotateX(180deg)] ">
                  <p
                    className=""
                    dangerouslySetInnerHTML={{ __html: card.description }}
                  ></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
}
