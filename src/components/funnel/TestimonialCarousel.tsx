import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import depoimento1 from "@/assets/testimonials/depoimento-1.png";
import depoimento2 from "@/assets/testimonials/depoimento-2.png";
import depoimento3 from "@/assets/testimonials/depoimento-3.png";
import depoimento4 from "@/assets/testimonials/depoimento-4.png";
import depoimento5 from "@/assets/testimonials/depoimento-5.png";
import depoimento6 from "@/assets/testimonials/depoimento-6.png";
import depoimento7 from "@/assets/testimonials/depoimento-7.png";
import depoimento8 from "@/assets/testimonials/depoimento-8.png";
import depoimento9 from "@/assets/testimonials/depoimento-9.png";
import depoimento10 from "@/assets/testimonials/depoimento-10.png";

const testimonialImages = [
  depoimento1,
  depoimento2,
  depoimento3,
  depoimento4,
  depoimento5,
  depoimento6,
  depoimento7,
  depoimento8,
  depoimento9,
  depoimento10,
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialImages.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonialImages.length) % testimonialImages.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonialImages.length);
  };

  return (
    <div className="w-full space-y-3">
      <h3 className="text-base font-bold text-foreground text-center">
        💬 O que dizem os saxofonistas:
      </h3>
      
      <div className="relative">
        {/* Main image container */}
        <div className="relative overflow-hidden rounded-xl border border-border bg-card/30">
          <img
            src={testimonialImages[currentIndex]}
            alt={`Depoimento ${currentIndex + 1}`}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-card/80 backdrop-blur border border-border flex items-center justify-center text-foreground hover:bg-card transition-colors"
          aria-label="Próximo"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Dots indicator */}
      <div className="flex justify-center gap-1.5">
        {testimonialImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentIndex(index);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-primary w-4"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Ir para depoimento ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;
