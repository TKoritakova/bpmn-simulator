import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';

const STORAGE_CURRENT = 'chapter1_current_slide';
const STORAGE_MAX = 'chapter1_max_slide';

export default function Chapter1() {
  const swiperRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [max, setMax] = useState(0);

  const slides = [
    'Slide 1', 'Slide 2', 'Slide 3', 'Slide 4', 'Slide 5',
    'Slide 6', 'Slide 7', 'Slide 8', 'Slide 9'
  ];


  useEffect(() => {
    const savedSlide = parseInt(localStorage.getItem(STORAGE_CURRENT), 10);
    const savedMax = parseInt(localStorage.getItem(STORAGE_MAX), 10);
    if (!isNaN(savedSlide)) {
      setCurrent(savedSlide);
    }
    if (!isNaN(savedMax)) {
      setMax(savedMax);
    }
  }, []);

  useEffect(() => {
    if (swiperRef.current && !isNaN(current)) {
      swiperRef.current.slideTo(current, 0);
    }
  }, [current]);


  const handleSwiper = (swiper) => {
    swiperRef.current = swiper;
  };


  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    setCurrent(newIndex);
    localStorage.setItem(STORAGE_CURRENT, newIndex);

    if (newIndex > max) {
      setMax(newIndex);
      localStorage.setItem(STORAGE_MAX, newIndex);
    }
  };

  const nextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slideNext();
    }
  };

  const prevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.slidePrev();
    }
  };

  return (
    <>
      <Swiper
        onSwiper={handleSwiper}
        onSlideChange={handleSlideChange}
        modules={[Navigation, Pagination]}
        pagination={{ type: 'progressbar' }}
        className="chapterSwiper"
        allowTouchMove={false}
        keyboard={{ enabled: false }}
      >
        {slides.map((text, index) => (
          <SwiperSlide key={index}>
            {text}
            <div style={{ marginTop: '1rem' }}>
              {index > 0 && <button onClick={prevSlide}>Předchozí</button>}
              {index < slides.length - 1 && <button onClick={nextSlide}>Další</button>}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

     
    </>
  );
}
