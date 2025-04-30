import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Chap1Slide1 from '../slides/Chap1Slide1';
import Chap1Slide2 from '../slides/Chap1Slide2';
import Chap1Slide3 from '../slides/Chap1Slide3';

const STORAGE_CURRENT = 'chapter1_current_slide';
const STORAGE_MAX = 'chapter1_max_slide';

export default function Chapter1() {
  const swiperRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [max, setMax] = useState(0);
  const [allVisitedInSlide1, setAllVisitedInSlide1] = useState(false);


  const slideComponents = [<Chap1Slide1 setAllVisited={setAllVisitedInSlide1} />, <Chap1Slide2 />, <Chap1Slide3 />];
 

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
        {slideComponents.map((SlideComponent, index) => (
        <SwiperSlide key={index}>
          {SlideComponent}
          <div style={{ marginTop: '1rem' }}>
            {index > 0 && <button onClick={prevSlide} className='left'>Předchozí</button>}
            {index < slideComponents.length - 1 && ((index == 0 && allVisitedInSlide1) || max > index  || index > 0) && (
              <button onClick={nextSlide} className='right'>Další</button>
            )}
          </div>
        </SwiperSlide>
      ))}
      </Swiper>

     
    </>
  );
}
