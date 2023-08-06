"use client";
import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Services from "./components/Services";
import RecentProject from "./components/RecentProject";
import Statas from "./components/Statas";
import Footer from "./components/Footer";
import Sponsored from "./components/Sponsored";
import VisionMission from "./components/VisionMission";
import AdsComponent from "./components/ads/AdsComponent_1080x1920";
import AdsComponent1 from "./components/ads/AdsComponent_970x250";
import BottomNav from "./components/bottomnav/BottomNav";

export default function Home() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate a 5-second loading delay
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <span className="loading loading-dots loading-lg"></span>
        </div>
      ) : (
        <>
          <Navbar />
          <HeroSection />
          <div className="container">
            <AdsComponent />
          </div>
          <Services />
          <RecentProject />

          <Statas />
          <VisionMission />
          <Sponsored />
          <AdsComponent1 />
          <Footer />
          <BottomNav />
        </>
      )}
    </div>
  );
}
