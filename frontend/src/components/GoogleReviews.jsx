import { useEffect } from "react";

const GoogleReviewsWidget = () => {
  useEffect(() => {
    // Check if script already exists to avoid duplicates
    if (!document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div
      className="elfsight-app-5da35617-e545-4423-b05a-03c02633a90e"
      data-elfsight-app-lazy
    />
  );
};

export default GoogleReviewsWidget;
