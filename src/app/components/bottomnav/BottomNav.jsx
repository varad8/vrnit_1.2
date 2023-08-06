"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function BottomNav() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Check if the viewport width is less than or equal to 768px (adjust as needed)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Call handleResize initially and add event listener for window resize
    handleResize();
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleButtonClick = (index) => {
    if (index === 0) {
      router.push("/");
    } else if (index === 1) {
      router.push("/profile");
    } else if (index === 2) {
      router.push("/projectinfo");
    }
    setActiveIndex(index);
  };

  if (!isMobile) {
    return null; // Render nothing if not on mobile
  }

  return (
    <div className="btm-nav">
      <button
        className={activeIndex === 0 ? "active" : ""}
        onClick={() => handleButtonClick(0)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>
      <button
        className={activeIndex === 1 ? "active" : ""}
        onClick={() => handleButtonClick(1)}
      >
        <svg
          fill="currentColor"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          ></path>
        </svg>
      </button>
      <button
        className={activeIndex === 2 ? "active" : ""}
        onClick={() => handleButtonClick(2)}
      >
        <svg
          fill="currentColor"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            clip-rule="evenodd"
            fill-rule="evenodd"
            d="M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm14.25 6a.75.75 0 01-.22.53l-2.25 2.25a.75.75 0 11-1.06-1.06L15.44 12l-1.72-1.72a.75.75 0 111.06-1.06l2.25 2.25c.141.14.22.331.22.53zm-10.28-.53a.75.75 0 000 1.06l2.25 2.25a.75.75 0 101.06-1.06L8.56 12l1.72-1.72a.75.75 0 10-1.06-1.06l-2.25 2.25z"
          ></path>
        </svg>
      </button>
    </div>
  );
}

export default BottomNav;
