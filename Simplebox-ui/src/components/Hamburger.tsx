import { useState } from "react";
import { motion, MotionConfig, AnimatePresence } from "framer-motion";
import SlideTabs from "./SlideTabs";

function Hamburger() {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const menuMap = new Map([
    ["Home", "/"],
    ["Logout", "/login"]
  ]);

  return (
    <div className="flex justify-end h-17 relative bg-gradient-to-tr from-cyan-700 to-blue-950">
        <div className="absolute left-0 z-10 block cursor-pointer px-3 py-1.5 text-2xl uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base">
          <h1>Simplebox</h1>
        </div>
      <AnimatePresence>
        {hamburgerOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SlideTabs menu={menuMap} />
          </motion.div>
        )}
      </AnimatePresence>
      <MotionConfig transition={{ duration: 0.5, ease: "easeInOut" }}>
        <motion.button
          onHoverStart={() => setHamburgerOpen((prev) => !prev)}
          onClick={() => setHamburgerOpen((prev) => !prev)}
          initial={false}
          animate={hamburgerOpen ? "open" : "closed"}
          className="relative h-20 w-20 rounded-full bg-white/0
       transition-colors hover:bg-white/20"
        >
          <motion.span
            style={{ left: "50%", top: "35%", x: "-50%", y: "-50%" }}
            variants={{
              open: {
                rotate: ["0deg", "0deg", "45deg"],
                top: ["35%", "50%", "50%"],
              },
              closed: {
                rotate: ["45deg", "0deg", "0deg"],
                top: ["50%", "50%", "35%"],
              },
            }}
            className="absolute h-1 w-10 bg-white"
          ></motion.span>
          <motion.span
            style={{ left: "50%", top: "50%", x: "-50%", y: "-50%" }}
            variants={{
              open: {
                rotate: ["0deg", "0deg", "-45deg"],
              },
              closed: {
                rotate: ["-45deg", "0deg", "0deg"],
              },
            }}
            className="absolute h-1 w-10 bg-white"
          ></motion.span>
          <motion.span
            style={{
              left: "calc(50%+10px)", // right: "0%", x: "-100%"
              bottom: "35%",
              x: "-50%",
              y: "+50%",
            }} // left: "calc(50% + 10px)"
            variants={{
              open: {
                rotate: ["0deg", "0deg", "-45deg"],
                bottom: ["35%", "50%", "50%"],
                left: "50%",
              },
              closed: {
                rotate: ["-45deg", "0deg", "0deg"],
                bottom: ["50%", "50%", "35%"],
                left: "calc(50% + 10px)",
              },
            }}
            className="absolute h-1 w-5 bg-white"
          ></motion.span>
        </motion.button>
      </MotionConfig>
    </div>
  );
}

export default Hamburger;
