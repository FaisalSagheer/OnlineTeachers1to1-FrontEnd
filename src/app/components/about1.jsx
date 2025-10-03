"use client";

import Link from "next/link";
import "../style.css";
import Image from "next/image";
import AboutSvg1 from "../image/aboutsvg1.png";
import AboutSvg2 from "../image/aboutsvg2.png";
import AboutSvg3 from "../image/aboutsvg3.png";
import AboutSvg4 from "../image/aboutsvg4.png";
import AboutSvg5 from "../image/aboutsvg5.png";
import AboutSvg6 from "../image/aboutsvg6.png";
import AboutImg1 from "../image/about5.jpg";
import AboutImg2 from "../image/about4.jpg";
import AboutImg3 from "../image/about3.jpg";
import AboutImg4 from "../image/about2.jpg";
import BtnArrow from "../image/btnarrow.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

export default function AboutSection1() {
    gsap.registerPlugin(ScrollTrigger);

    useGSAP(() => {
        gsap.from(".aboutAnime1", {
            x: -800,
            opacity: 0,
            scrollTrigger: {
                trigger: ".aboutAnime1",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".aboutAnime2", {
            x: 800,
            opacity: 0,
            scrollTrigger: {
                trigger: ".aboutAnime2",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });
    });

    const pathname = usePathname();
    let IsAbout;
    if (pathname !== "/aboutUs") {
        IsAbout = true;
    }

    return (
        <>
            <section className="aboutSection flex flex-wrap">
                <div className="aboutAnime1 w-1/2 pt-2 pl-4">
                    <div className="aboutContentDiv">
                        <h2 className="">ABOUT US</h2>
                        <h1>Discover, Engage, Develop, and Enjoy!</h1>
                        <p>
                            Online Teachers 1-to-1 is a personalized tutoring platform that connects
                            students with expert educators for truly individual learning. We
                            specialize in core subjects like English, Math, and Science, but our
                            approach goes beyond textbooks—every session is tailored to the
                            learner's pace, style, and goals. Designed for students of all ages, our
                            platform offers flexible scheduling across time zones, making it easy to
                            fit learning into busy routines. Through live video lessons, interactive
                            digital tools, and real-time feedback, we create a safe, engaging space
                            where students not only improve academically but also grow in
                            confidence. Our team of experienced male and female educators ensures
                            that each student receives focused, one-on-one guidance with regular
                            assessments and progress tracking. Parents stay informed, and learners
                            stay motivated. Getting started is simple—enroll directly through our
                            website or social platforms. Plus, every new student can book a free
                            trial session to experience the difference before committing.
                        </p>
                    </div>
                    <div className="aboutSvgContent mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-1 gap-y-8">
                            <div className="aboutContentBox flex items-center gap-4 text-left">
                                <Image src={AboutSvg1} alt="AboutSvg1" className="aboutsvg1" />
                                <h3>Child Friendly Environment</h3>
                            </div>

                            <div className="aboutContentBox flex items-center gap-4 text-left">
                                <Image src={AboutSvg2} alt="AboutSvg2" className="aboutsvg2" />
                                <h3>Real-Time Learning</h3>
                            </div>

                            <div className="aboutContentBox flex items-center gap-4 text-left">
                                <Image src={AboutSvg3} alt="AboutSvg3" className="aboutsvg3" />
                                <h3>Strong Digital Infrastructure</h3>
                            </div>

                            <div className="flex items-center gap-4 text-left">
                                <Image src={AboutSvg6} alt="AboutSvg4" className="aboutsvg4" />
                                <h3>Continuous Assessment</h3>
                            </div>

                        <div className="aboutContentBox flex items-center gap-4 text-left">
                            <Image src={AboutSvg5} alt="AboutSvg4" className="aboutsvg5" />
                            <h3>Expert Educators</h3>
                        </div>

                        <div className="aboutContentBox flex items-center gap-4 text-left">
                            <Image src={AboutSvg4} alt="AboutSvg4" className="aboutsvg6" />
                            <h3>Flexible & Accessible </h3>
                        </div>
                    </div>

                    {IsAbout ? (
                        <div className="aboutusbtvDiv flex flex-wrap">
                            <Link href="/aboutUs">
                                {" "}
                                <button className="aboutbtn flex items-center gap-2">
                                    MORE ABOUT US
                                    <Image
                                        className="aboutbtnArrow"
                                        src={BtnArrow}
                                        alt="Btn Arrow"
                                    />{" "}
                                </button>
                            </Link>
                        </div>
                    ) : (
                        ""
                    )}
                </div>

                <div className="aboutAnime2 w-1/2 pr-3 grid gap-2">
                    <div className="flex justify-end gap-3">
                        <Image src={AboutImg2} alt="About Img1" className="aboutImg2" />
                        <Image className="aboutvideo1" src={AboutImg4} alt="ABOUTIMG4" />
                    </div>
                    <div className="mt-6 flex justify-end gap-3">
                        <Image className="aboutvideo1" src={AboutImg1} alt="ABOUTIMG3" />
                        <Image src={AboutImg3} alt="About Img1" className="aboutImg1" />
                    </div>
                </div>
            </section>
        </>
    );
}
