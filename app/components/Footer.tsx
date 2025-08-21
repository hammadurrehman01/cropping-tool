import React from "react";
import "@/app/styles/footer.css";
import Image from "next/image";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-upper">
                <span className="">© 2025</span>
                <Image src="/logo.svg" alt="logo" height={15} width={15} />
                Artwork Hub
            </div>
            <div className="footer-links">
                <a href="#">Cookies</a>
                <a href="#">Discord</a>
                <a href="#">Contact</a>
                <a href="#">About</a>
                <a href="#">Privacy</a>
                <select className="language-dropdown" >
                    <option value="en" hidden>Language</option>
                    <option value="en">English</option>
                </select>
            </div>
        </footer>
    );
};

export default Footer;