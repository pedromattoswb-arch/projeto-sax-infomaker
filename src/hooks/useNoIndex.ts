import { useEffect } from "react";

/**
 * Sets <meta name="robots" content="noindex, nofollow"> on protected pages
 * to prevent search engine indexing. Cleans up on unmount.
 */
const useNoIndex = () => {
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);
};

export default useNoIndex;
