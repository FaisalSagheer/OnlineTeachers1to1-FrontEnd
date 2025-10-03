"use client";
import "./style.css";
import Image from "next/image";
import HeroSection from "./components/hero-section";
import CloudImg from "./image/cloudimg.png";
import Header from "./components/header";
import FooterCloudImg from "./image/Footer-cloud-img.png";
import Footer from "./components/footer";
import AboutSection1 from "./components/about1";
import SectionThree from "./components/section3";
import SectionFour from "./components/section4";
import SectionFive from "./components/section5";
import dynamic from "next/dynamic";
import Head from "next/head";
import About7 from "./aboutComponents/about7";
import SubjectCarousal  from "./components/subjectSection";
import SEO from "./components/seo";
export default function Home() {
    return (
        <>
            <div className="bg-[#fcf7ee] text-gray-800">
                <Header />

                <section className="py-4">
                    <Image
                        src={CloudImg || "/placeholder.svg"}
                        className="mx-auto"
                        alt="Cloud Img"
                        priority
                    />
                </section>

                <main className="flex flex-col gap-20 px-4 md:gap-28 md:px-20">
                    <section id="hero">
                        <HeroSection />
                    </section>

                    <section id="about">
                        <AboutSection1 />
                    </section>

                    <section id="subjectscarousal">
                        <SubjectCarousal />
                    </section>

                    <section id="features">
                        <SectionThree />
                    </section>

                    <section id="benefits">
                        <SectionFour />
                    </section>
                    <section id="testimonials">
                        <About7 />
                    </section>
                    <section id="why-us">
                        <SectionFive />
                    </section>
                </main>

                <div className="FooterCloudImgDiv mt-20 md:mt-28">
                    <Image
                        src={FooterCloudImg || "/placeholder.svg"}
                        alt="Footer Cloud"
                        className="FooterCloudImg mx-auto"
                        priority
                    />
                </div>

                <Footer />
            </div>
        </>
    );
}
