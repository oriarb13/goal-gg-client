import React from "react";
import Lottie from "lottie-react";
import ballLoaderAnimation from "./Animation.json";

const BallLoader: React.FC = () => {
  return (
    <Lottie
      animationData={ballLoaderAnimation}
      loop={true}
      autoplay={true}
      style={{ width: 150, height: 150 }}
    />
  );
};

export default BallLoader;
