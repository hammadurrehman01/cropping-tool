import { ChevronDown } from "lucide-react";
import Image from "next/image";
import "@/app/styles/navbar.css";

const Navbar = () => {
  return (
    <nav className="main_nav">
      <div className="sub_nav">
        <div className="left_div">
          <div className="logo">
            <Image src="/logo.svg" alt="logo" height={24} width={24} />
          </div>
          <div className="nav_items">
            <span className="home">Home</span>
            <div className="tools">
              <span>Tools</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="more">
              <span>More</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="right_div">Order Best Steam and Discord Design</div>
      </div>
    </nav>
  );
};

export default Navbar;
