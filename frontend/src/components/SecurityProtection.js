import { useEffect } from 'react';

const SecurityProtection = () => {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
      return false;
    };

    // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    const handleKeyDown = (e) => {
      // F12
      if (e.keyCode === 123) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.keyCode === 85) {
        e.preventDefault();
        return false;
      }
      
      // Ctrl+Shift+C (Element Inspector)
      if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
        e.preventDefault();
        return false;
      }
    };

    // Detect DevTools
    const detectDevTools = () => {
      const threshold = 160;
      
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold = window.outerHeight - window.innerHeight > threshold;
      
      if (widthThreshold || heightThreshold) {
        // DevTools detected - you could redirect or show a warning
        console.clear();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // خففنا إجراءات الحماية لتجنب تعارضات المتصفحات على الجوال
    const devToolsInterval = setInterval(detectDevTools, 2000);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsInterval);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default SecurityProtection;