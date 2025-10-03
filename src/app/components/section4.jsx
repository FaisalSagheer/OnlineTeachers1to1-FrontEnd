'use client'
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

export default function SectionFour() {

    // gsap.registerPlugin(ScrollTrigger)
    // useGSAP(() => { ... })

    return (
        <>
            <section className="FourthSection">
                <div className="fouthSectxtDiv flex flex-col items-center text-center">
                    <h2>A FEATURE-RICH LMS</h2>
                    <h1>We're teaching many students in more than 5 countries</h1>
                </div>
                <div className="fourSecAnime px-36 pt-20 pb-36 gap-8 flex justify-center flex-wrap">
                    <div className="SponcerImgDiv ">
                        <Image src="/image/countries/pakistan.jpg" className="sponcer1" alt="Pakistan" width={150} height={200} />
                    </div>
                    <div className="SponcerImgDiv ">
                        <Image src="/image/countries/oman.png" className="sponcer2" alt="Oman" width={150} height={200} />
                    </div>
                    <div className="SponcerImgDiv ">
                        <Image src="/image/countries/uae.png" className="sponcer3" alt="UAE" width={150} height={200} />
                    </div>
                    <div className="SponcerImgDiv ">
                        <Image src="/image/countries/saudi-arabia.png" className="sponcer4" alt="Saudi Arabia" width={150} height={200} />
                    </div>
                    <div className="SponcerImgDiv ">
                        <Image src="/image/countries/qatar.png" className="sponcer5" alt="Qatar" width={150} height={200} />
                    </div>
                </div>
            </section>
        </>
    );
}
