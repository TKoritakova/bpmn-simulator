import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Chap4Slide1 from '../slides/Chap4Slide1';





export default function Chapter4() {


  const [slideFinished, setSlideFinished] = useState({});
  const slideComponents = [<Chap4Slide1 setSlideFinished={setSlideFinished} />];
 


  return (
    <>
      <Swiper       
        modules={[Navigation, Pagination]}
        pagination={{ type: 'progressbar' }}
        className="chapterSwiper"
        allowTouchMove={false}
        keyboard={{ enabled: false }}
      >
        {slideComponents.map((SlideComponent, index) => (
        <SwiperSlide key={index}>
          {SlideComponent}
        </SwiperSlide>
      ))}
      </Swiper>

     
    </>
  );
}
