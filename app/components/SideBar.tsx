import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

interface Props {
  exportImage: () => void;
}

const SideBar = ({ exportImage }: Props) => {
  return (
    <div className="w-[40%]">
      <div className="text-right">
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl">Level</span>
          <div className="border-2 border-red-400 text-white px-1.5 py-1 rounded-full text-sm font-bold">
            10
          </div>
        </div>
        <div className="flex items-center space-x-2 mb-4 bg-black/25 py-2 px-3">
          <Image src="/logo.svg" alt="logo" height={50} width={50} />
          <div>
            <div className="font-semibold text-sm">Artwork Hub</div>
            <div className="text-sm text-slate-400 text-left">500 XP</div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="border-slate-600 bg-black text-gray-500 rounded-xs">
            Settings
          </Button>
          <Button
            onClick={exportImage}
            className="bg-cyan-950 hover:bg-cyan-700 rounded-xs text-cyan-300"
          >
            Export
          </Button>
        </div>
      </div>
      <div className="bg-black/25 p-6 mt-12">
        <div className="space-y-4">
          <Button className="w-full bg-cyan-950 hover:bg-cyan-700 text-cyan-300">
            Donate
          </Button>

          <Card className="bg-black text-gray-500 p-2 rounded-sm">
            <h3 className="text-center">Profile Backgrounds</h3>
          </Card>

          <Card className="bg-black text-gray-500 p-2 rounded-sm">
            <h3 className="text-center font-light ">Upload Codes</h3>
          </Card>

          <Card className="bg-black text-gray-500 p-2 rounded-sm">
            <h3 className="text-center">Changelog</h3>
          </Card>

          {/* Promotional Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center ">
            <h3 className="font-bold text-2xl whitespace-wrap mb-2">
              BEST STEAM AND DISCORD DESIGN
            </h3>
            <div className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
