import { useEffect } from "react";

const GoogleReviewsGridWidget = () => {
  useEffect(() => {
    // Avoid adding the script multiple times
    if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className="elfsight-app-e821f089-412d-4a2e-b36e-0f17207e6e17 mt-10"
      data-elfsight-app-lazy
    />
  );
};

export default GoogleReviewsGridWidget;
