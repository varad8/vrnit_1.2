import React from "react";
import YouTube from "react-youtube";

const VideoPlayer = ({ videoId }) => {
  const opts = {
    height: "300",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };

  return (
    <div className="w-full aspect-auto">
      <YouTube videoId={videoId} opts={opts} />
    </div>
  );
};

export default VideoPlayer;
