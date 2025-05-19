import HexagonGrid from "./HexagonGrid";
import { useState, useEffect } from "react";

const HexGridDemo = ({ expertData }) => {
  const [subsections, setSubsections] = useState([]);
  const [filteredSubsections, setFilteredSubsections] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categories, setCategories] = useState([]);
  const [gridConfig, setGridConfig] = useState({
    width: 700,
    height: 660,
    hexagonsPerRow: 3,
  });

  // Responsive grid configuration
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      let newConfig = { width: 700, height: 900, hexagonsPerRow: 3 };

      if (width < 640) {
        // Small screens: 2 hexagons per row
        newConfig = { width: 500, height: 1500, hexagonsPerRow: 2 };
      } else if (width < 1024) {
        // Medium screens: 3 hexagons per row
        newConfig = { width: 700, height: 1000, hexagonsPerRow: 3 };
      } else if (width < 2024) {
        // Medium screens: 3 hexagons per row
        newConfig = { width: 800, height: 450, hexagonsPerRow: 3 };
      }

      // Adjust hexagonsPerRow if data is insufficient
      if (filteredSubsections.length > 0 && filteredSubsections.length < newConfig.hexagonsPerRow) {
        newConfig.hexagonsPerRow = Math.min(filteredSubsections.length, 2);
      }

      setGridConfig(newConfig);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [filteredSubsections.length]);

  // Process expertData
  useEffect(() => {
    if (expertData && expertData[0] && expertData[0].subsections) {
      const allSubsections = expertData[0].subsections;
      setSubsections(allSubsections);
      setFilteredSubsections(allSubsections);

      const uniqueCategories = [
        ...new Set(
          allSubsections
            .filter((item) => item.serviceparentCategoryId)
            .map((item) => item.serviceparentCategoryId)
        ),
      ];
      setCategories(uniqueCategories);
    }
  }, [expertData]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setFilteredSubsections(subsections);
    } else {
      const filtered = subsections.filter(
        (item) => item.serviceparentCategoryId === category
      );
      setFilteredSubsections(filtered);
    }
  };

  const getHexProps = (subsection) => ({
    style: {
      fill: "white",
      stroke: "inherit",
      strokeWidth: 2,
    },
    onClick: () => {
      if (subsection && subsection.title) {
        alert(`${subsection.title} has been clicked`);
      }
    },
  });

  const renderHexagonContent = (subsection) => {
    if (!subsection) return null;

    return (
      <g>
        <image
          href={
            subsection.photo
              ? `/api/image/download/${subsection.photo}`
              : subsection.icon
              ? `/icons/${subsection.icon}`
              : "/placeholder.svg?height=60&width=60"
          }
          x="8%"
          y="17%"
          height="80%"
          width="80%"
          preserveAspectRatio="xMidYMid meet"
        />
       
      </g>
    );
  };

  const TitleSection = () => (
    <div className="text-center mb-8">
      <h2 className="text-3xl font-semibold">
        We Are <span className="text-yellow-400">Experts In</span>
      </h2>
      <p className="text-lg mt-2">Harnessing Expertise for Your Success</p>
    </div>
  );

  const formatCategoryName = (category) => {
    if (!category) return "";
    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const ServiceCategories = () => (
    <div className="flex justify-center gap-4 mb-8 flex-wrap">
      <div
        className={`px-4 py-2 rounded-md ${
          selectedCategory === "all"
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
          className={`px-4 py-2 rounded-md ${
            selectedCategory === category
              ? "bg-yellow-400 text-white"
              : "bg-gray-100 hover:bg-gray-200"
          } cursor-pointer text-sm`}
          onClick={() => handleCategoryChange(category)}
        >
          {formatCategoryName(category)}
        </div>
      ))}
    </div>
  );

  const NoResults = () => (
    <div className="py-12 text-center text-gray-500">
      <p>No services found in this category.</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col justify-center items-center py-12 px-4">
      <TitleSection />
      <ServiceCategories />
      <div className="w-full mt-5 flex justify-center ml-20 items-center">
        {filteredSubsections.length > 0 ? (
          <HexagonGrid
            gridWidth={gridConfig.width}
            gridHeight={gridConfig.height}
            hexagonsPerRow={gridConfig.hexagonsPerRow}
            hexagons={filteredSubsections}
            hexProps={getHexProps}
            renderHexagonContent={renderHexagonContent}
          />
        ) : (
          <NoResults />
        )}
      </div>
    </div>
  );
};

export default HexGridDemo;