"use client";
import Image from "next/image";
import HomeIcon3 from "../image/home-icon-3.png";
import HomeIcon2 from "../image/home-icon-2.png";
import HomeIcon1 from "../image/home-icon-1.png";
import TextImage1 from "../image/textimage1.png";
import TextImage2 from "../image/textimage2.png";
import TextImage3 from "../image/textimage3.png";
import SvgStarIcon from "../image/svgStaricon.svg";
import SpringArrowSvg from "../image/springArrowSvg.svg";
import BtnArrow from "../image/btnarrow.svg";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

const ourValues = [
    {
        title: "Personalization",
        text: "Every learner is unique. We design lessons around individual strengths, challenges, and goals to ensure real progress.",
    },
    {
        title: "Integrity",
        text: "Honesty, fairness, and respect shape every interaction, building a culture of trust between tutors, students, and parents.",
    },
    {
        title: "Excellence",
        text: "Our tutors are passionate professionals committed to delivering top-quality education with measurable results.",
    },
    {
        title: "Innovation",
        text: "We use technology and creative teaching methods to make learning dynamic, engaging, and future-ready.",
    },
];

export default function SectionSeven() {
    gsap.registerPlugin(ScrollTrigger);

    useGSAP(() => {
        gsap.from(".sevenSecfirstdiv h2", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".sevenSecfirstdiv",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });
        gsap.from(".sevenSecfirstdiv h1", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".sevenSecfirstdiv",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".SevenDivBox", {
            x: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".SevenDivBox",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".SevenDivBox .TextImage1", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".SevenDivBox",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".SevenDivBox1", {
            x: -300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".SevenDivBox1",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".SevenDivBox1 .TextImage2", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".SevenDivBox1",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".SevenDivBox2", {
            x: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".SevenDivBox2",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".SevenDivBox3", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".SevenDivBox3",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".SevenDivBox3 .TextImage3", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".SevenDivBox3",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".SevenDivBox2 .TextImage3", {
            y: 300,
            opacity: 0,
            scrollTrigger: {
                trigger: ".SevenDivBox2",
                scroller: "body",
                start: "top 80%",
                end: "top 70%",
                scrub: 1,
            },
        });

        gsap.from(".svgStarIcon", {
            y: -10,
            repeat: -1,
            duration: 2,
            yoyo: 1,
        });
    });

    return (
        <>
            <section className="SevenSection px-32 pt-20">
                <Image
                    src={SpringArrowSvg}
                    alt="Spring Arrow Svg"
                    className="springArrowSvg SevenExtraAnmie"
                />
                <Image
                    src={SvgStarIcon}
                    alt="SvgStarIcon"
                    className="svgStarIcon SevenExtraAnmie"
                />
                <svg className="starSvg12 SevenExtraAnmie" x="0px" y="0px" viewBox="0 0 212 210">
                    {" "}
                    <path d="M162.3,190.5c-11.1-25.6-22.1-51.2-33.2-76.8c18.6,8.7,37.2,17.4,55.8,26.1c10.2,4.8,18.3-10.5,8.1-15.3 c-16.5-7.7-33-15.4-49.4-23.1c18.1-4.9,36.1-9.9,54.2-14.8c10.9-3,5.3-19.3-5.6-16.3c-21.3,5.8-42.7,11.7-64,17.5 c9.8-16.2,20-32.1,30.7-47.8c6.3-9.2-9.4-17-15.7-7.9c-10.3,15-20.1,30.3-29.5,45.8C104.4,56.7,95.2,35.3,86,14 c-4.4-10.1-21.1-4.8-16.7,5.5C77.9,39.2,86.4,59,94.9,78.8C73.7,68.9,52.6,59,31.4,49.1c-10.2-4.8-18.3,10.5-8.1,15.3 c23.5,11,46.9,21.9,70.4,32.9c-26.5,7.2-53,14.5-79.5,21.7c-10.9,3-5.3,19.3,5.6,16.3c24.1-6.6,48.1-13.2,72.2-19.7 C82,134,72.5,152.8,63.6,171.8c-4.7,10.1,11,17.9,15.7,7.9c9.9-21.3,20.6-42.3,32.1-62.9c11.4,26.4,22.8,52.8,34.2,79.2 C149.9,206.1,166.7,200.8,162.3,190.5L162.3,190.5z"></path>
                </svg>

                <div className="sevenSecfirstdiv text-center">
                    <h2>Why We're Different</h2>
                    <h1>What Makes Our Teaching Unique</h1>
                </div>

                <div className="SevenOurMissionMainDivs flex flex-col gap-16 px-32 py-32">
                    {/* mission */}
                    <div className="SevenDivBox">
                        <div>
                            <div className="sevenDivHeading flex">
                                <h2>Our Mission</h2>
                                <Image src={HomeIcon3} alt="Home Icon 3" className="homeIcon3" />
                            </div>
                            <div className="sevenDivpara flex flex-wrap pt-6">
                                <p>
                                    Online Teachers 1-to-1 empowers students through personalized,
                                    one-on-one tutoring tailored to their unique learning style,
                                    pace, and goals. Our educators don't just teach — they mentor,
                                    inspire confidence, and nurture critical thinking. By creating a
                                    supportive and engaging virtual classroom, we help students not
                                    only achieve academic success but also develop a lifelong love
                                    of learning.{" "}
                                </p>
                            </div>
                        </div>
                        <div className="sevenDivImg">
                            <Image src={TextImage3} alt="Text Image 1" className="TextImage1" />
                        </div>
                    </div>

                    <div className="SevenDivBox1 flex flex-col items-center gap-8 p-4 md:flex-row">
                        {/* Left Side: Image */}
                        {/* 2. Added width classes for responsive control. */}
                        <div className="sevenDivImg w-full md:w-1/2">
                            <Image
                                src={TextImage1}
                                alt="Our Key Values"
                                className="TextImage2 h-auto w-full rounded-lg" // Added classes for better image scaling
                            />
                        </div>

                        {/* Right Side: Text Content */}
                        <div className="w-full md:w-1/2">
                            <div className="sevenDivHeading flex items-center">
                                <h2>Our Key Values</h2>
                                <Image
                                    src={HomeIcon2}
                                    alt="Key Values Icon"
                                    className="homeIcon3 ml-2" // Added margin for spacing
                                />
                            </div>
                            {/* 3. The inner values grid now uses utility classes instead of inline styles. */}
                            <div className="sevenDivpara -mx-2 flex flex-wrap pt-6">
                                {ourValues.map((value) => (
                                    <div key={value.title} className="mb-4 w-full px-2 sm:w-1/2">
                                        <h3>
                                            <strong>{value.title}</strong>
                                        </h3>
                                        <p>{value.text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* vision */}
                    <div className="SevenDivBox2">
                        <div>
                            <div className="sevenDivHeading flex">
                                <h2>Our Vision</h2>
                                <Image src={HomeIcon1} alt="Home Icon 3" className="homeIcon3" />
                            </div>
                            <div className="sevenDivpara flex flex-wrap pt-6">
                                <p>
                                    We envision a world where quality education is accessible to
                                    every learner, regardless of location or background. By
                                    combining personalized teaching with innovative technology, we
                                    break down barriers and open pathways to opportunity. Our vision
                                    is to cultivate confidence, curiosity, and critical thinking —
                                    skills that empower students to thrive in a fast-changing,
                                    globalized world.
                                </p>
                            </div>
                        </div>
                        <div className="sevenDivImg">
                            <Image src={TextImage2} alt="Text Image 1" className="TextImage3" />
                        </div>
                    </div>

                    {/* goals */}
                    <div className="SevenDivBox3">
                        <div className="sevenDivImg">
                            <Image src={TextImage2} alt="Text Image 1" className="TextImage3" />
                        </div>
                        <div>
                            <div className="sevenDivHeading flex">
                                <h2>Our Goals</h2>
                                <Image src={HomeIcon1} alt="Home Icon 3" className="homeIcon3" />
                            </div>
                            <div className="sevenDivpara flex flex-wrap pt-6">
                                <p>
                                    We aim to deliver tailored one-to-one learning experiences that
                                    unlock each student's potential. We make high-quality education
                                    affordable and accessible worldwide. We support academic growth
                                    and confidence with consistent feedback and mentorship. We
                                    uphold integrity and excellence so both parents and students can
                                    trust the process.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
