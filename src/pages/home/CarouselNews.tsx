import React, { useState } from 'react'
import { Carousel } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const CarouselNews = () => {

    const [index, setIndex] = useState<number>(0);

    const handleSelect = (selectedIndex: number) => {
        setIndex(selectedIndex);
    };
    
    return (
        <>
            <Carousel 
            className='carousel-dark'
            style={{ marginTop: '16pt'}}
            interval={15000} indicators={true} controls={true} activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                    <img
                        className="d-block w-100"
                        src="https://source.unsplash.com/800x400/?island"
                        alt="First slide"
                    />
                </Carousel.Item>
                <Carousel.Item>
                    <Link to="/connectivity">
                        <img
                            className="d-block w-100"
                            src="https://source.unsplash.com/800x400/?sea"
                            alt="First slide" 
                        />
                    </Link>
                </Carousel.Item>
                <Carousel.Item>
                    <Link to="/products">
                        <img
                            className="d-block w-100"
                            src="https://source.unsplash.com/800x400/?nature"
                            alt="First slide"
                        />
                    </Link>
                </Carousel.Item>
            </Carousel>
        </>
    )
}

export default CarouselNews;