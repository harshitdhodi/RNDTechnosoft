import { useState, useEffect, useCallback } from "react";

// Hexagon component
const Hexagon = ({ subsection, hexProps, renderHexagonContent }) => {
    return (
        <div className="relative">
            <div
                className="hexagon flex items-center justify-center w-[100px] h-[110px] mx-auto"
                style={hexProps.style}
                onClick={hexProps.onClick}
                role="button"
                aria-label={`Select ${subsection.title || "service"}`}
            >
                {renderHexagonContent(subsection)}
            </div>
        </div>
    );
};

const HexGridDemo = ({ expertData }) => {
    const [subsections, setSubsections] = useState([]);
    const [filteredSubsections, setFilteredSubsections] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [categories, setCategories] = useState([]);
    const [hexagonsPerRow, setHexagonsPerRow] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            let newHexPerRow = 4;

            if (width < 640) {
                newHexPerRow = 3;
            } else if (width < 1024) {
                newHexPerRow = 4;
            }

            if (filteredSubsections.length > 0 && filteredSubsections.length < newHexPerRow) {
                newHexPerRow = Math.min(filteredSubsections.length, 2);
            }

            setHexagonsPerRow(newHexPerRow);
        };

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
    }, [filteredSubsections.length]);

    useEffect(() => {
        if (!expertData?.[0]?.subsections) {
            setSubsections([]);
            setFilteredSubsections([]);
            setCategories([]);
            return;
        }

        const all = expertData[0].subsections;
        setSubsections(all);
        setFilteredSubsections(all);

        const uniqueCategories = [...new Set(all
            .filter(item => item.serviceparentCategoryId)
            .map(item => item.serviceparentCategoryId))];

        setCategories(uniqueCategories);
    }, [expertData]);

    const handleCategoryChange = useCallback((category) => {
        setSelectedCategory(category);
        if (category === "all") {
            setFilteredSubsections(subsections);
        } else {
            setFilteredSubsections(subsections.filter(
                item => item.serviceparentCategoryId === category
            ));
        }
    }, [subsections]);

    const getHexProps = useCallback((subsection) => ({
        style: {
            fill: "white",
            stroke: "inherit",
            strokeWidth: 2,
        },
        onClick: () => {
            if (subsection?.title) {
                alert(`${subsection.title} has been clicked`);
            }
        },
    }), []);

    const renderHexagonContent = useCallback((subsection) => {
        if (!subsection) return null;
        return (
            <img
                src={
                    subsection.photo
                        ? `/api/image/download/${subsection.photo}`
                        : subsection.icon
                            ? `/icons/${subsection.icon}`
                            : "/placeholder.svg?height=60&width=60"
                }
                alt={subsection.title || "Hexagon image"}
                className="w-full h-full object-contain p-1 object-center"
            />
        );
    }, []);

    const formatCategoryName = useCallback((category) => {
        if (!category || typeof category !== "string") return category;
        return category
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }, []);

    const calculateRows = () => {
        const rows = [];
        let currentIndex = 0;

        // Special case for 5 items: 3 in first row, 2 in second row
        if (filteredSubsections.length === 5) {
            rows.push({
                hexagons: filteredSubsections.slice(0, 3),
                isSingle: false,
                isLastTwo: false,
            });
            rows.push({
                hexagons: filteredSubsections.slice(3, 5),
                isSingle: false,
                isLastTwo: true,
            });
            return rows;
        }

        // Special case for 12 items: 3,2,3,2,3,2
        if (filteredSubsections.length === 12) {
            for (let i = 0; i < 12;) {
                rows.push({
                    hexagons: filteredSubsections.slice(i, i + 3),
                    isSingle: false,
                    isLastTwo: false,
                });
                i += 3;
                if (i < 12) {
                    rows.push({
                        hexagons: filteredSubsections.slice(i, i + 2),
                        isSingle: false,
                        isLastTwo: (i + 2 >= 12),
                    });
                    i += 2;
                }
            }
            return rows;
        }

        while (currentIndex < filteredSubsections.length) {
            const remaining = filteredSubsections.length - currentIndex;

            // If only 1 item remains, center it
            if (remaining === 1) {
                rows.push({
                    hexagons: [filteredSubsections[currentIndex]],
                    isSingle: true,
                    isLastTwo: false,
                });
                break;
            }

            // If only 2 items remain, put both in one row
            if (remaining === 2) {
                rows.push({
                    hexagons: filteredSubsections.slice(currentIndex, currentIndex + 2),
                    isSingle: false,
                    isLastTwo: true,
                });
                break;
            }

            const isEven = (filteredSubsections.length - currentIndex === 1) ? true : rows.length % 2 === 0;
            const rowSize = isEven ? hexagonsPerRow : hexagonsPerRow - 1;
            const take = Math.min(remaining, rowSize);

            rows.push({
                hexagons: filteredSubsections.slice(currentIndex, currentIndex + take),
                isSingle: take === 1,
                isLastTwo: false,
            });

            currentIndex += take;
        }

        return rows;
    };

    return (
        <div className="w-full flex flex-col justify-center items-center py-12 px-4">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-semibold">
                    We Are <span className="text-yellow-400">Experts In</span>
                </h2>
                <p className="text-lg mt-2">Harnessing Expertise for Your Success</p>
            </div>

            {/* Categories */}
            <div className="flex justify-center gap-4 mb-8 flex-wrap">
                <div
                    className={`px-4 py-2 rounded-md ${selectedCategory === "all"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                        } cursor-pointer text-sm`}
                    onClick={() => handleCategoryChange("all")}
                >
                    All Services
                </div>
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={`px-4 py-2 rounded-md ${selectedCategory === category
                            ? "bg-yellow-400 text-white"
                            : "bg-gray-100 hover:bg-gray-200"
                            } cursor-pointer text-sm`}
                        onClick={() => handleCategoryChange(category)}
                    >
                        {formatCategoryName(category)}
                    </div>
                ))}
            </div>

            {/* Hexagon Grid */}
            <div className="w-full lg:mt-10 flex justify-center items-center">
                {filteredSubsections.length > 0 ? (
                    <div className="flex flex-col items-center">
                        {calculateRows().map((row, rowIndex) => {
                            const isEven = rowIndex % 2 === 0;
                            const marginTop = rowIndex === 0 ? "" : "lg:mt-[-6.3rem] md:mt-[-4.7rem] mt-[-3.5rem]";
                            const justifyClass =
                                row.isSingle
                                    ? "justify-center sm:translate-x-[6.6rem]"
                                    : row.isLastTwo
                                        ? "justify-start"
                                        : "justify-center";

                            return (
                                <div
                                    key={rowIndex}
                                    className={`flex ${justifyClass} mb-2 relative ${marginTop}`}
                                >
                                    {row.hexagons.map((subsection, idx) => (
                                        <div key={`${rowIndex}-${idx}`} className="lg:mx-9 md:mx-6 mx-5">
                                            <Hexagon
                                                subsection={subsection}
                                                hexProps={getHexProps(subsection)}
                                                renderHexagonContent={renderHexagonContent}
                                            />
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-500">
                        <p>No services found in this category.</p>
                    </div>
                )}
            </div>

            <style jsx global>{`
        .hexagon {
            background-color: transparent !important;
            clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
            width: 140px;
            height: 154px;
        }
        @media (max-width: 768px) {
            .hexagon {
                width: 100px !important;
                height: 110px !important;
            }
        }
        @media (max-width: 480px) {
            .hexagon {
                width: 80px !important;
                height: 90px !important;
            }
        }
      `}</style>
        </div>
    );
};

export default HexGridDemo;
