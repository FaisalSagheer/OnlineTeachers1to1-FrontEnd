"use client"
import "../style.css"
import "./aboutStyle.css"
import Image from "next/image"
import Header from "../components/header"
import Footer from "../components/footer"
import AboutSection1 from "../components/about1"
import About2 from "../aboutComponents/about2"
import About3 from "../aboutComponents/about3"
import About4 from "../aboutComponents/about4"
import BannerSecAbout from "../aboutComponents/bannerAbout"
import CloudImg from "../image/cloudimg.png"
import FooterCloudImg from "../image/Footer-cloud-img.png"
import About6 from "../aboutComponents/about6"
import About7 from "../aboutComponents/about7"
export default function About() {
    return (
        <div className="bg-[#fcf7ee]">
            <Header />
            <section>
                <Image src={CloudImg} className="cloudImgabout" alt="Cloud Img" />
            </section>
            <BannerSecAbout />
            <AboutSection1 />
            <About2 />
            <About3 />
            <About6 />
            <div className="FooterCloudImgDiv">
                <Image src={FooterCloudImg} alt="FooterCloudImg" className="FooterCloudImg" />
            </div>
            <Footer />
        </div>
    )
}