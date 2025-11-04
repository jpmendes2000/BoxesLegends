import { useState, useEffect } from "react";
//import Banner1 from "../assets/Banner.jpg";
import Banner2 from "../assets/Benner-2.jpg";
import Banner3 from "../assets/Banner-3.jpg";

function BannerRotativo() {
  const imagens = [/*Banner1, */ Banner2, Banner3];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % imagens.length);
    }, 9000); // 9 segundos

    return () => clearInterval(intervalo);
  }, [imagens.length]);

  return (
    <div className="banner-container">
      <img 
        src={imagens[index]} 
        alt={`Banner ${index + 1}`} 
        className="banner-img" 
      />
    </div>
  );
}

export default BannerRotativo;
