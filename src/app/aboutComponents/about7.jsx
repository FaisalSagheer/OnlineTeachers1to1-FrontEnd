"use client"

import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import "../style.css"
import { FaStar } from "react-icons/fa";
import SvgTestimonCloud1 from "../image/svgTestimonCloud1.svg"
import SvgTestimonCloud2 from "../image/svgTestimonCloud2.svg"
import SvgTestimonCloud3 from "../image/svgTestimonCloud3.svg"
import TestimonialImg1 from "../image/testimonial-style.jpg"
import TestimonialImg2 from "../image/testimonial-style (5).jpg"
import TestimonialImg3 from "../image/testimonial-style (3).jpg"
import TestimonialImg4 from "../image/testimonial-style (4).jpg"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";



export default function About7() {

    gsap.registerPlugin(ScrollTrigger)


    useGSAP(() => {


        gsap.from(".testimonialDiv h3", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".testimonialDiv",
                scroller: "body",

                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            }
        })
        gsap.from(".testimonialDiv h2", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".testimonialDiv",
                scroller: "body",

                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            }
        })
        gsap.from(".testimonBoxAnime", {
            y: 300,
            opacity: 0,
            delay: 2,
            scrollTrigger: {
                trigger: ".testimonialDiv",
                scroller: "body",

                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            }
        })

    })


    const quotes = [
        {
            quote: "The one-on-one prep classes gave my daughter the perfect head start.",
            author: "Farah (London, UK)",
            image: TestimonialImg1,
            image1: SvgTestimonCloud1
        },
        {
            quote: "My ADHD son finally feels understood and supported in his learning.",
            author: "Sheikh Al Salim (Oman)",
            image: TestimonialImg2,
            image1: SvgTestimonCloud2
        },
        {
            quote: "My kid loved their music and computer classes. It was fun and educational!",
            author: "Mehwish (Bahrain)",
            image: TestimonialImg3,
            image1: SvgTestimonCloud3
        },
        {
            quote: "Personal tuition boosted my daughter's reading and confidence fast!",
            author: "Ayat (KSA)",
            image: TestimonialImg4,
            image1: SvgTestimonCloud2
        },
         {
            quote: "The virtual school feels personal and keeps our kids excited to learn.",
            author: "Henry & Lily (Virginia, USA)",
            image: TestimonialImg4,
            image1: SvgTestimonCloud2
        },
            {
            quote: "The tutors helped my son open up and thrive in English and tech skills.",
            author: "Faris Ahmed (Oman)",
            image: TestimonialImg4,
            image1: SvgTestimonCloud2
        }
    ];


    const settings = {
        dots: true,
        arrow: true,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        cssEase: "linear",
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                dots: true,
                arrows: false,
                infinite: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                cssEase: "linear",
              }
            }
          ]
    };




    return (
        <>
            <section className="SectionEleven pt-32 pb-24">

                <div className="testimonialDiv pb-20  text-center">
                    <h3>Client Feedback:</h3>
                    <h2>What Our Clients Say About Us</h2>
                </div>
               

                <div className="slider-container">
                    <Slider {...settings}>
                        {quotes.map((q, index) => (
                            <div className="testimonBoxAnime flex px-4 gap-6" key={index}>

                            <div className="testimonBox" >
                                <div className="testimonBoxInnerDiv">
                                    <Image src={q.image1} alt="SvgTestimonCloud1" className="SvgTestimonCloud1" />
                                    <div className="absolute bottom-18 left-15 lg:bottom-20 lg:left-34 max-w-xs flex flex-col items-center text-center gap-3 lg:gap-6">
                                        <div className=" flex  justify-center gap-3 mb-3">
                                            <FaStar className="starTestimon" /><FaStar className="starTestimon" /><FaStar className="starTestimon" /><FaStar className="starTestimon" /><FaStar className="starTestimon" />
                                        </div>
                                        <p className="text-white max-w-sm text-sm lg:text-[1rem]"> {q.quote}</p>
                                    </div>
                                </div>

                                <div className="testiauthor flex items-center gap-4 mt-4 pl-16">
                                    <Image src={q.image} alt="TestimonialImg1" className="TestimonialImg1" />
                                    <h2 className="testimonNameH2">{q.author}</h2>
                                </div>
                            </div>
                            </div>
                        ))}
                    </Slider>
                </div>





              

            </section>
        </>
    )
}