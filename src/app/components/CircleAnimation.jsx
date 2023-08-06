import React from "react";
import "./hero.css";

const CircleAnimation = () => {
  const smallCircles = [
    "/images/small-circle-1.png",
    "/images/small-circle-2.png",
    "/images/small-circle-3.png",
    "/images/small-circle-4.png",
  ];

  return (
    <div className="circle-animation">
      <div className="main-circle"></div>
      <div className="outer-circle"></div> {/* New circle element */}
      {smallCircles.map((circle, index) => (
        <div
          key={index}
          className={`small-circle circle-${index}`}
          style={{ animationDelay: `-${index}s` }}
        >
          <img src={circle} alt={`Small Circle ${index}`} />
        </div>
      ))}
    </div>
  );
};

export default CircleAnimation;
