"use client";
import React, { useState, useEffect } from "react";

const VideoYt = ({ videoId }) => {
  const [showAd, setShowAd] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAdPaused, setIsAdPaused] = useState(false);
  const [isTimer, setIsTimer] = useState(true);
  const [intervalId, setIntervalId] = useState(null);

  const startInterval = () => {
    const interval = setInterval(() => {
      setCurrentTime((prevTime) => prevTime + 1);
    }, 1000);
    setIntervalId(interval);
  };

  const stopInterval = () => {
    clearInterval(intervalId);
  };

  useEffect(() => {
    if (!isAdPaused) {
      startInterval();
    } else {
      stopInterval();
    }
  }, [isAdPaused]);

  useEffect(() => {
    if (currentTime === 15) {
      setIsTimer(false);
      setShowSkipButton(true);
    }
  }, [currentTime]);

  const handleSkip = () => {
    setShowAd(false);
    setShowSkipButton(false);
  };

  const handlePause = () => {
    setIsAdPaused(true);
    stopInterval();
  };

  const handleResume = () => {
    setIsAdPaused(false);
    startInterval();
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <div className="w-full aspect-video">
        {showSkipButton && (
          <div className="relative">
            <button
              className="absolute top-0 right-0 m-2 bg-gray-800 text-white rounded px-2 py-1 text-xs"
              onClick={handleSkip}
            >
              Skip Ad
            </button>
          </div>
        )}
        {isTimer && (
          <div className="relative">
            <button className="absolute top-0 right-0 m-2 bg-gray-800 text-white rounded px-2 py-1 text-xs">
              Skip Ad After ({currentTime}/{15} sec)
            </button>
          </div>
        )}
        {showAd && (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              frameBorder="0"
              allowFullScreen
              className="w-full h-full"
              onPause={handlePause}
              onPlay={handleResume}
            ></iframe>
          </>
        )}
        {!showAd && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            frameBorder="0"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default VideoYt;
