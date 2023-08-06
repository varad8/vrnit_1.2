import React from "react";
import "./hero.css";
import CircleAnimation from "./CircleAnimation";

const HeroSection = () => {
  return (
    <div style={{ background: "#40476D" }}>
      <div className="container mx-auto px-4">
        <div class="flex flex-wrap items-center justify-center">
          <div class="w-full sm:w-1/2 p-4">
            <h1 class="text-3xl font-bold text-white font1">VRNITSOLUTION</h1>
            <p className="text-white font2">
              Your gateway to digital success. We offer cutting-edge web
              development, Android app creation, and ecommerce marketing
              services to empower your business. Let us help you unleash your
              online potential and drive growth in the ever-evolving world of
              technology.
            </p>
          </div>
          <div class="w-full justify-center sm:w-1/2 p-4">
            <CircleAnimation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
