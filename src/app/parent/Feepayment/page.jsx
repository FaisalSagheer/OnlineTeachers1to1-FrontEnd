import "@/app/login/loginStyle.css"
import "@/app/style.css";
import Image from "next/image";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import CloudImg from "@/app/image/cloudimg.png";
import FooterCloudImg from "@/app/image/Footer-cloud-img.png"
import FeeBanner from "./FeeBanner";
import FeePayment from "@/app/components/FeePayment";
export default function FeePaymentPage() {
    return (
        <div className="bg-[#fcf7ee]">
            <Header />

            <section className="py-4">
                <Image src={CloudImg} className="cloudImgabout mx-auto" alt="Cloud Image" />
            </section>

            <FeeBanner />
            <div className="flex justify-center mt-6">

                <FeePayment />

            </div>
            {/* Footer Cloud Image */}
            <div className="FooterCloudImgDiv mt-12 md:mt-28">
                <Image src={FooterCloudImg} alt="Footer Cloud" className="FooterCloudImg mx-auto" />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}