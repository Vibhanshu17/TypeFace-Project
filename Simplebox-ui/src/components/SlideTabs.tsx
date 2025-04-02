import { AuthContext } from "@/Auth/AuthContext";
import { motion } from "framer-motion";
import { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface TabProps {
    children: React.ReactNode;
    setPosition: React.Dispatch<
      React.SetStateAction<{ left: number; width: number; opacity: number }>
    >;
    route: string;
  }
  
  interface CursorProps {
    position: { left: number; width: number; opacity: number };
  }
  
  interface SlideTabsProps {
    menu: Map<string, string>;
  }
  
const Tab = ({ children, setPosition, route }: TabProps) => {
  const ref = useRef<HTMLLIElement>(null);
  const navigate = useNavigate();
  const {setUserName, setUserId, setIsAuthenticated} = useContext(AuthContext)!;
  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (ref.current) {
          const { width } = ref.current.getBoundingClientRect();
          setPosition({
            left: ref.current.offsetLeft,
            width: width,
            opacity: 1,
          });
        }
      }}
      className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase
     text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
     onClick={() => {
        if(route === "/login") {
            localStorage.clear();
            setUserName("");
            setUserId("");
            setIsAuthenticated(false);
        }
        navigate(route);
    }}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }: CursorProps) => {
  return <motion.li animate={position} className="absolute z-0 h-7 rounded-full bg-black md:h-12" /> ;
};

function SlideTabs({ menu }: SlideTabsProps) {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });

  return (
    <ul
      onMouseLeave={() => setPosition((prev) => ({ ...prev, opacity: 0 }))}
      className="relative my-1 w-fit flex border-2 border-black rounded-full bg-white p-1"
    >
      {Array.from(menu.entries()).map(([label, route], index) => (
        <Tab key={index} setPosition={setPosition} route={route}>{label}</Tab>
      ))}
      <Cursor position={position} />
    </ul>
  );
}

export default SlideTabs;
