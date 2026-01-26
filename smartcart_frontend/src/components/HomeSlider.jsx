// src/components/HomeSlider.jsx
import { useEffect, useState } from "react";
import "./HomeSlider.css";

/* SLIDER IMAGES */
import slide1 from "../assets/slider/keyboard.jpeg";
import slide2 from "../assets/slider/mouse.jpeg";
import slide3 from "../assets/slider/laptop.jpeg";

const images = [slide1, slide2, slide3];

function HomeSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home-slider">
      <img src={images[index]} alt="Promotion Banner" />
    </div>
  );
}

export default HomeSlider;
