import "../aboutUs/aboutStyle.css";
import "../style.css";
import "./LMScourses.css";

import Image from "next/image";
import Footer from "../components/footer";
import Header from "../components/header";
import CloudImg from "../image/cloudimg.png";
import FooterCloudImg from "../image/Footer-cloud-img.png";
import BannerSectionLMScourses from "../LMScomponent/lmsBannerSection";

export default function CoursesLayout({ children }) {
    return (
        <>
            <Header />

            <section>
                <Image src={CloudImg} className="cloudImgabout" alt="Cloud Img" />
            </section>

            <BannerSectionLMScourses />

            {children}


            <div className="FooterCloudImgDiv">
                <Image src={FooterCloudImg} alt="FooterCloudImg" className="lmscloud" />
            </div>

            <Footer />
        </>
    );
}
