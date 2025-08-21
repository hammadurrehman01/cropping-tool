import { Button } from "@/components/ui/button";
import Image from "next/image";
import "@/app/styles/sidebar.css";

interface Props {
  exportImage: () => void;
}

const SideBar = ({ exportImage }: Props) => {
  return (
    <div className="outer_div">
      <div className="upper_div">
        <div className="top_heading">
          <span className="level_heading">Level</span>
          <div className="level">10</div>
        </div>
        <div className="artwork-hub_div">
          <Image src="/logo.svg" alt="logo" height={50} width={50} />
          <div>
            <div className="artwork-hub_heading">Artwork Hub</div>
            <div className="artwork-hub_subheading">500 XP</div>
          </div>
        </div>
        <div className="action-btn_div">
          <Button className="settings-btn">Settings</Button>
          <Button onClick={exportImage} className="export-btn">
            Export
          </Button>
        </div>
      </div>
      <div className="option-btn_outer">
        <div className="">
          <Button className="donate-btn">Donate</Button>

          <Button className="profile-btn">Profile Backgrounds</Button>

          <Button className="upload-codes-btn">Upload Codes</Button>

          <Button className="custom-button">Changelog</Button>
          {/* Promotional Banner */}
          <div className="promotional-banner">
            <h3 className="promotional-banner-heading">
              BEST STEAM AND DISCORD DESIGN
            </h3>
            <div className="promotional-banner-btn-outer">
              <div className="promotional-banner-btn-inner"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
