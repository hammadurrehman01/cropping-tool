import { ChevronDown } from "lucide-react";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-slate-800 border-b border-slate-700 px-4 py-3 fixed top-0 w-full z-[99999]">
      <div className="flex items-center gap-3">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="logo" height={30} width={30} />
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <span className="text-cyan-400 cursor-pointer">Home</span>
            <div className="flex items-center space-x-1 cursor-pointer">
              <span>Tools</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <div className="flex items-center space-x-1 cursor-pointer">
              <span>More</span>
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
        <div className="text-cyan-400 font-bold text-lg">
          Order Best Steam and Discord Design
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
