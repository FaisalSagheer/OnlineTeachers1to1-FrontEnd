'use client'

import Image from "next/image";
import StarSvg1 from "../image/starsvg1.png"
import StarSvg2 from "../image/starsvg2.png"
import ThirdSecSvg1 from "../image/thirdSecSvg1.svg"
import ThirdSecSvg2 from "../image/thirdSecSvg2.svg"
import ThirdSecSvg3 from "../image/ThirdSecSvg3.svg"
import ThirdSecSvg4 from "../image/ThirdSecSvg4.svg"
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";



export default function SectionThree() {

//   gsap.registerPlugin(ScrollTrigger)

//   useGSAP(() => {

// let tl = gsap.timeline({
//   scrollTrigger:{
//     trigger:".secthreeTxt",
//     scroller:"body",
//     start:"top 80%",
//     end:"top 70%",
//     scrub: 1,
// }
// })

// tl.from(".secthreeTxt",{
//   y:100,
//   opacity:0,
//  duration:2,
// })

// tl.from(".starSvg1",{
//   x:-100,
//   opacity:0,
  
// })

// tl.from(".starSvg2",{
//   x:100,
//   opacity:0,
  
// })

// tl.from(".thirdSecAnime",{
//   y:100,
//   opacity:0,
// })

 
//     })



    return (
        <>
        
        <section className="thirdsection">
            <div className=" flex justify-center overflow-hidden items-center">
                <div className="starSvg1Div  ">
                    <Image src={StarSvg1} alt="StarSvg1" className="starSvg1" />
                </div>

                <div className="secthreeTxt flex flex-col items-center text-center">
                    <h2>Shaping Bright Futures</h2>
                   <h1>Knowledge That Empowers Success</h1>
                </div>

                <div className="starSvg2Div ">
                    <Image src={StarSvg2} alt="StarSvg2" className="starSvg2" />
                </div>
            </div>

<section className="thirdSecAnime mb-8  ">
    <div className="thirdSecSecond flex  px-36 py-20">
        <div className="thirdSecInnerDiv flex flex-col items-center text-center">
          <Image src={ThirdSecSvg1} width={900} alt="Third Sec Svg" className="thirdSecSvg1" />
          <h2>Provide Demos.</h2>
          <p>We provide three demos before confirming any tutor which allows parents to choose the best one for their child</p>
        </div>

        <div className="thirdSecInnerDiv flex flex-col items-center text-center">
          <Image src={ThirdSecSvg2} alt="Third Sec Svg" className="thirdSecSvg1" />
          <h2>Well Equiped Tutors.</h2>
          <p>Our teachers are well equipped with digital teaching material to make the lesson effective.</p>
        </div>

        <div className="thirdSecInnerDiv flex flex-col items-center text-center">
          <Image src={ThirdSecSvg3} alt="Third Sec Svg" className="thirdSecSvg1" />
          <h2>Clear And General Communication.</h2>
          <p>Online meeting will be arranged with parents to have clear and detailed talk.</p>
        </div>

        <div className="thirdSecInnerDiv thirdSecInnerDivlast flex flex-col items-center text-center">
          <Image src={ThirdSecSvg4} alt="Third Sec Svg" className="thirdSecSvg1" />
          <h2>Ongoing Assessments.</h2>
          <p>Teacher will assess child's learning on regular basis at the end of each lesson, using various tools.</p>
        </div>
    </div>
</section>



        </section>
        
        </>
 
 
);
}