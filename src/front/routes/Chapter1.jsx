import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Chap1Slide1 from '../slides/Chap1Slide1';
import Chap1Slide2 from '../slides/Chap1Slide2';
import Chap1Slide3 from '../slides/Chap1Slide3';
import Chap1Slide4 from '../slides/Chap1Slide4';
import Chap1Slide5 from '../slides/Chap1Slide5';
import Chap1Slide6 from '../slides/Chap1Slide6';

const STORAGE_CURRENT = 'chapter1_current_slide';
const STORAGE_MAX = 'chapter1_max_slide';
const LOCAL_KEY_CHAP1_SUBMITTED = "chapter1-test-submitted";

export default function Chapter1() {
  const swiperRef = useRef(null);
  const [current, setCurrent] = useState(0);
  const [max, setMax] = useState(0);
  const [slideFinished, setSlideFinished] = useState({});
  const [submitted, setSubmitted] = useState(false);


  const slideComponents = [<Chap1Slide1 setSlideFinished={setSlideFinished} />, <Chap1Slide2 setSlideFinished={setSlideFinished} />, <Chap1Slide3 setSlideFinished={setSlideFinished}/>, <Chap1Slide4 setSlideFinished={setSlideFinished}/>, <Chap1Slide5 setSlideFinished={setSlideFinished}/>, <Chap1Slide6 setSlideFinished={setSlideFinished}/>];
 

  useEffect(() => {
    const savedSlide = parseInt(localStorage.getItem(STORAGE_CURRENT), 10);
    const savedMax = parseInt(localStorage.getItem(STORAGE_MAX), 10);
    if (!isNaN(savedSlide)) {
      setCurrent(savedSlide);
    }
    if (!isNaN(savedMax)) {
      setMax(savedMax);
    }
    const getSubmitted = localStorage.getItem(LOCAL_KEY_CHAP1_SUBMITTED);
    if(getSubmitted) {
      setSubmitted(true);
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
            {index < slideComponents.length - 1 && ((slideFinished[index+1]) || max > index) && (
              <button onClick={nextSlide} className='right'>Další</button>
            )}
            {index === slideComponents.length - 1 && ((slideFinished[index+1]) || submitted) && (
              <Link to="/bpmn-simulator/lesson-2"><button className='right'>Další lekce</button></Link>
              
            )}
          </div>
        </SwiperSlide>
      ))}
      </Swiper>

     
    </>
  );
}
