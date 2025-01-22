import React, { useEffect } from 'react';

const Chatbot = () => {
  useEffect(() => {
    // Tawk.to chatbot script
    var Tawk_API = Tawk_API || {};
    var Tawk_LoadStart = new Date();
    
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://embed.tawk.to/630dcc4b37898912e96620d6/1gbmuc2sq";
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");

    // Append the script to the document body
    document.body.appendChild(script);

    return () => {
      // Cleanup: Remove the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  return <div id="chatbot-container"></div>;
};

export default Chatbot;
