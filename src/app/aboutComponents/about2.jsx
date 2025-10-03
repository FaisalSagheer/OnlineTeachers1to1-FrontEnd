import Image from "next/image";
import TopMask from "../image/top-mask.svg"
import BottomMask from "../image/bottom-mask.svg"


export default function About2() {
    return (
        <>
            <section className="SecTwoabput ">
                <Image src={TopMask} alt="TopMask" className="TopMask" />
                <div className=" flex justify-center gap-5 items-center flex-wrap p-4">
                    <div className="counterInnerDiv counterInnerDiv1  text-center">
                        <h2>200+</h2>
                        <h3>Students Graduated</h3>
                    </div>

                    <div className="counterInnerDiv text-center">
                        <h2>289+</h2>
                        <h3>Academic Programs</h3>
                    </div>

                    <div className="counterInnerDiv text-center">
                        <h2>85+</h2>
                        <h3>Global Awards</h3>
                    </div>

                    <div className="counterInnerDiv text-center">
                        <h2>65+</h2>
                        <h3>Teachers</h3>
                    </div>

                </div>
                <Image src={BottomMask} alt="BottomMask" className="BottomMask" />
                
            </section>
        </>
    );
}
