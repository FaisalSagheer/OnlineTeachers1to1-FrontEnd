import "./loginStyle.css";
import LoginForm from "../components/form";
import LoginBanner from "../components/loginBanner";
import Footer from "../components/footer";
import Image from "next/image";
import Header from "../components/header";
import CloudImg from "../image/cloudimg.png";
import FooterCloudImg from "../image/Footer-cloud-img.png";
export const metadata = {
    title: "Login | Teacher1to1",
    description: "Login to access your personalized 1-to-1 learning dashboard.",
};

export default function LoginPage() {
    return (
        <div className="flex flex-col bg-[#fcf7ee] text-gray-800">
            <Header />
            <section>
                <Image src={CloudImg} className="cloudImgabout" alt="Cloud Img" priority />
            </section>
            {/* Banner */}
            <LoginBanner />

            {/* Login Form Section */}
            <main className="flex flex-col items-center justify-center gap-10 px-4 py-4 md:py-20">
                <LoginForm />
            </main>
            <div className="FooterCloudImgDiv mt-20 md:mt-28">
                <Image src={FooterCloudImg} alt="Footer Cloud" className="FooterCloudImg mx-auto" priority />
            </div>
            <Footer />
        </div>
    );
}
