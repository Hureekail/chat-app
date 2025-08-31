import { CiFacebook } from "react-icons/ci"; 
import { CiTwitter } from "react-icons/ci"; 
import { SlSocialGoogle } from "react-icons/sl"; 
import { FaSignInAlt } from "react-icons/fa"; 
import { FaUserEdit } from "react-icons/fa"; 
import { useRef } from "react";
import { Link } from "react-router-dom"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";

const isMobile = window.innerWidth <= 640;

const Start = () => {
  if (isMobile) {
    return (
      <div className="flex justify-center items-end h-screen pb-16">
        <div className="w-full max-w-xs flex flex-col gap-6">
          <div className="">
          </div>

          <Link to="/login">
            <button className="w-full shadow-[inset_0_0_0_2px_#616467] text-black px-12 py-4 rounded-full tracking-widest uppercase font-bold bg-transparent hover:bg-gray-500 hover:text-white dark:text-neutral-200 transition duration-200">
              Login
            </button>
          </Link>
          <Link to="/register">
            <button className="w-full bg-gray-500 tracking-widest uppercase font-bold hover:bg-gray-700 text-white py-4 px-4 border-2 border-gray-500 rounded-full text-lg transition duration-200">
              Register
            </button>
          </Link>
          <div>
          </div>
          <h2 className="text-center">or sign in with:</h2>
          <div className="flex justify-center items-center gap-10">
            <SlSocialGoogle  className="w-10 h-10"/>
            <CiTwitter className="w-12 h-12" />
            <CiFacebook className="w-11 h-11" />
          </div>
        </div>
      </div>
    )
  }
  return (
      <div>
        <div className="flex justify-center items-center h-screenflex-row">   
          <Link to="/login" > 
            <TiltCard content={<><FaSignInAlt className="mx-auto text-4xl" /><span>login</span></>} />
          </Link>
          <Link to="/register">
            <TiltCard content={<><FaUserEdit className="mx-auto text-4xl" /><span>register</span></>} />
          </Link>
        </div>
        <div className="flex justify-center items-center">
          <SocialTiltCard content={
            <>
            <h1 className="text-center">or sign in with:</h1>
            <div className="flex justify-center items-center gap-10">
              <SlSocialGoogle  className="w-10 h-10"/>
              <CiTwitter className="w-12 h-12" />
             <CiFacebook className="w-11 h-11" />
            </div>
            </>
            }>
            
          </SocialTiltCard>
        </div>
      </div>
  );
  };


const TiltCard = ({content}) => {
  const ROTATION_RANGE = 30;
  const HALF_ROTATION_RANGE = 15;

  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-96 w-72"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-white shadow-lg"
      >
        <p
          style={{
            transform: "translateZ(50px)",
          }}
          className="text-center text-2xl font-bold"
        >
            {content}
        </p>
      </div>
    </motion.div>
  );
};

const SocialTiltCard = ({content}) => {
  const ROTATION_RANGE = 20;
  const HALF_ROTATION_RANGE = 10;

  const ref = useRef(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x);
  const ySpring = useSpring(y);

  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e) => {
    if (!ref.current) return [0, 0];

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
    const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;

    const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
    const rY = mouseX / width - HALF_ROTATION_RANGE;

    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        transform,
      }}
      className="relative h-35 w-145"
    >
      <div
        style={{
          transform: "translateZ(75px)",
          transformStyle: "preserve-3d",
        }}
        className="absolute inset-4 grid place-content-center rounded-xl bg-white shadow-lg"
      >
        <p
          style={{
            transform: "translateZ(50px)",
          }}
          className="text-center text-2xl font-bold"
        >
            {content}
        </p>
      </div>
    </motion.div>
  );
};

export default Start;