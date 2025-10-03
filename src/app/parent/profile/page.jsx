import "@/app/style.css";
import "../parentStyle.css";
import { Card, CardContent } from "@/components/ui/card";
import ParentForm from "./edit-form";
import Image from "next/image";
import Footer from "@/app/components/footer";
import Header from "@/app/components/header";
import CloudImg from "@/app/image/cloudimg.png";
import ProfileBanner from "@/app/components/profileBanner";
import ParentProfile from "@/app/components/profile";
import FooterCloudImg from "@/app/image/Footer-cloud-img.png"
export default function ParentPage() {
  return (
    <div className="bg-[#fcf7ee]">
      <Header />
      
      <section className="py-4">
        <Image src={CloudImg} className="cloudImgabout mx-auto" alt="Cloud Image" />
      </section>
      
      <ProfileBanner />
      <div className="flex justify-center mt-6 item"> 
    <ParentProfile/>
      </div>
   {/* Footer Cloud Image */}
         <div className="FooterCloudImgDiv mt-20 md:mt-28">
           <Image src={FooterCloudImg} alt="Footer Cloud" className="FooterCloudImg mx-auto" />
         </div>
   
         {/* Footer */}
         <Footer />
    </div>
  );
}