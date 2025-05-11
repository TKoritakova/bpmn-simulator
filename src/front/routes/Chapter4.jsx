import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import Chap4Slide1 from '../slides/Chap4Slide1';



const LOCAL_KEY_CHAP4_SUBMITTED = "chapter4-submitted";

export default function Chapter4() {


  const [slideFinished, setSlideFinished] = useState({});
  const slideComponents = [<Chap4Slide1 setSlideFinished={setSlideFinished} />];
  const navigate = useNavigate();
 
  const [submitted, setSubmitted] = useState(false); 

  useEffect(() => {
    setSubmitted(localStorage.getItem(LOCAL_KEY_CHAP4_SUBMITTED));
  }, []);

  useEffect(() => {
    if(slideFinished[1]) {
      setSubmitted(localStorage.getItem(LOCAL_KEY_CHAP4_SUBMITTED));
    }
  }, [slideFinished]);

  const resetApp = () => {
    localStorage.clear();
    navigate('/bpmn-simulator/');
  }

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
          {index === slideComponents.length - 1 && ((slideFinished[index+1]) || submitted) && (
            <button className='right reset-app' onClick={resetApp}>Resetovat aplikaci</button>
                        
          )}
        </SwiperSlide>
      ))}
      </Swiper>

     
    </>
  );
}
