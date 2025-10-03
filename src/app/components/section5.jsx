'use client'
import Image from "next/image";
import BtnArrow from "../image/btnarrow.svg"
import CloudImg from "../image/cloudimg2.png"
import Thunder from "../image/Thunder.png"
import StudyCap from "../image/study-cap.png"
import DrawStar from "../image/draw-star.png"
import Star3d from "../image/3d-star.png"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import "../style.css";
import Link from "next/link";


export default function SectionFive() {

//    gsap.registerPlugin(ScrollTrigger);

// useGSAP(() => {
//     // A single timeline for the initial batch of animations
//     gsap.timeline({
//         scrollTrigger: {
//             trigger: ".thunder",
//             scroller: "body",
//             start: "top 90%",
//             end: "top 80%",
//             scrub: 1,
//         }
//     })
//     .from(".thunder, .star3d, .drawStar, .star3d2, .star3d3, .studyCap", {
//         y: 300,
//         opacity: 0,
//         stagger: 0.2, // Adds a slight delay between each element animating in
//     });

//     // Independent, repeating animations for specific elements
//     gsap.to(".studyCap, .drawStar", {
//         rotate: 20,
//         duration: 2,
//         repeat: -1,
//         yoyo: true,
//         ease: "power1.inOut", // Adds a smoother easing effect
//     });

//     // A timeline for the text and button animations
//     gsap.timeline({
//         scrollTrigger: {
//             trigger: ".fifthSectxtDiv",
//             scroller: "body",
//             start: "top 70%",
//             end: "top 60%",
//             scrub: 1,
//         }
//     })
//     .from(".fifthSectxtDiv h2, .fifthSectxtDiv h1, .fifthSectxtDiv p, .fiveSecbtv", {
//         y: 100,
//         opacity: 0,
//         stagger: 0.2, // Animates each element in sequence
//     });

// }, []); // It's a good practice to include the dependency array



    return (
        <>
            <section className="FifthSection">

                <Image src={Thunder} alt="Thunder" className="thunder" />
                <Image src={StudyCap} alt="Study Cap" className="studyCap" />
                <Image src={DrawStar} alt="Draw Star" className="drawStar" />
                <Image src={Star3d} alt="Star 3d" className="star3d" />
                <Image src={Star3d} alt="Star 3d" className="star3d2" />
                <Image src={Star3d} alt="Star 3d" className="star3d3" />

                <div className="fifthSecDiv ">
                    <div className="fifthSectxtDiv ">
                        <h2>Explore & Achieve </h2>
                        <h1>Turning play into progress and concepts into confidence.</h1>
                        <Link href="/login">
                        <button className="fiveSecbtv flex items-center gap-2">GET STARTED
                        <Image className="btnArrow" src={BtnArrow} alt="Btn Arrow" /> 
                        </button>

                        </Link>

                    </div>
                </div>



            </section>
        </>

    );
}