"use client";

import "@/app/styles/index.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Columns2,
  Columns4,
  Download,
  Maximize2,
  Square,
  Star,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";

type CropMode = "whole" | "split2" | "split5";

export default function CroppingTool() {
  const [imageUrl, setImageUrl] = useState("");
  const [currentImage, setCurrentImage] = useState<string>(
    "/bg-image-default.jpg"
  );
  const [cropMode, setCropMode] = useState<CropMode>("whole");
  const [canvasHeight, setCanvasHeight] = useState(700);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load image when URL changes
  useEffect(() => {
    if (imageUrl) {
      setCurrentImage(imageUrl);
    }
  }, [imageUrl]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCurrentImage(result);
        setImageUrl(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const drawImageOnCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl || currentImage;

    img.onload = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvasHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const imgRatio = img.width / img.height;
      const canvasRatio = canvas.width / canvas.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      drawHeight = canvas.height;
      drawWidth = imgRatio * drawHeight;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      ctx.strokeStyle = "#000000e5";
      ctx.lineWidth = 6;

      if (cropMode === "split2") {
        const splitPoint = canvas.width * 0.85;
        ctx.beginPath();
        ctx.moveTo(splitPoint, 0);
        ctx.lineTo(splitPoint, canvas.height);
        ctx.stroke();
      } else if (cropMode === "split5") {
        const sectionWidth = canvas.width / 5;
        for (let i = 1; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(sectionWidth * i, 0);
          ctx.lineTo(sectionWidth * i, canvas.height);
          ctx.stroke();
        }
      }
    };
  }, [cropMode, canvasHeight, currentImage, imageUrl]);

  useEffect(() => {
    drawImageOnCanvas();
  }, [drawImageOnCanvas]);

  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (cropMode === "whole") {
      const link = document.createElement("a");
      link.download = "cropped-image.png";
      link.href = canvas.toDataURL();
      link.click();
    } else if (cropMode === "split2") {
      const splitPoint = canvas.width * 0.85;
      const leftCanvas = document.createElement("canvas");
      leftCanvas.width = splitPoint;
      leftCanvas.height = canvas.height;
      const leftCtx = leftCanvas.getContext("2d");
      if (leftCtx) {
        leftCtx.drawImage(
          canvas,
          0,
          0,
          splitPoint,
          canvas.height,
          0,
          0,
          splitPoint,
          canvas.height
        );
        const leftLink = document.createElement("a");
        leftLink.download = "cropped-left.png";
        leftLink.href = leftCanvas.toDataURL();
        leftLink.click();
      }
      const rightCanvas = document.createElement("canvas");
      rightCanvas.width = canvas.width - splitPoint;
      rightCanvas.height = canvas.height;
      const rightCtx = rightCanvas.getContext("2d");
      if (rightCtx) {
        rightCtx.drawImage(
          canvas,
          splitPoint,
          0,
          canvas.width - splitPoint,
          canvas.height,
          0,
          0,
          canvas.width - splitPoint,
          canvas.height
        );
        setTimeout(() => {
          const rightLink = document.createElement("a");
          rightLink.download = "cropped-right.png";
          rightLink.href = rightCanvas.toDataURL();
          rightLink.click();
        }, 100);
      }
    } else if (cropMode === "split5") {
      const sectionWidth = canvas.width / 5;
      for (let i = 0; i < 5; i++) {
        const partCanvas = document.createElement("canvas");
        partCanvas.width = sectionWidth;
        partCanvas.height = canvas.height;
        const partCtx = partCanvas.getContext("2d");
        if (partCtx) {
          partCtx.drawImage(
            canvas,
            sectionWidth * i,
            0,
            sectionWidth,
            canvas.height,
            0,
            0,
            sectionWidth,
            canvas.height
          );
          setTimeout(() => {
            const partLink = document.createElement("a");
            partLink.download = `cropped-part-${i + 1}.png`;
            partLink.href = partCanvas.toDataURL();
            partLink.click();
          }, i * 100);
        }
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          const newHeight = Math.max(200, Math.min(800, e.clientY - rect.top));
          setCanvasHeight(newHeight);
        }
      }
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <>
      <div
        className="main_div"
        style={{
          backgroundImage: `url(${currentImage || "/bg-image-default.jpg"})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Navbar />
        <div className="wrapper_div">
          <div style={{ width: "70%" }}>
            <div className="upper_div">
              <div
                className="preview_image"
                style={{
                  backgroundImage: `url(${currentImage || "/bg-image-default.jpg"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundAttachment: "fixed",
                }}
              />
              <div style={{ flex: "1" }}>
                <h1 className="main_heading">Background Cropper</h1>
                <p className="sub_heading">Ver. 1.1</p>
                <p className="input_heading">
                  Paste your background link or upload your background below.
                </p>
                <div className="input_div">
                  <Input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Enter image URL"
                    className="input"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="icon"
                    className="upload_btn"
                  >
                    <Upload className="upload_icon" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </div>
                <div className="splitting_btn_div">
                  <Button
                    onClick={() => setCropMode("whole")}
                    variant={"outline"}
                    size="icon"
                    className="splitting_btn"
                  >
                    <Square className="splitting_icon" />
                  </Button>
                  <Button
                    onClick={() => setCropMode("split2")}
                    variant={"outline"}
                    size="icon"
                    className="splitting_btn"
                  >
                    <Columns2 className="splitting_icon" />
                  </Button>
                  <Button
                    onClick={() => setCropMode("split5")}
                    variant={"outline"}
                    size="icon"
                    className="splitting_btn"
                  >
                    <Columns4 className="splitting_icon" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="canvas_outer_div">
              <div className="canvas_wrapper">
                <div className="canvas-control-btn-div">
                  <Download onClick={exportImage} className="canvas-control-icons" />
                  <Maximize2 className="canvas-control-icons" />
                  <Star className="canvas-control-icons" />
                  <X className="canvas-control-icons" />
                </div>
                <div
                  className="canvas-container"
                  style={{
                    height: `${canvasHeight}px`, /* Dynamic height */
                    background: "transparent",
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="canvas"
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "block",
                      background: "transparent",
                    }}
                  />
                </div>
                <div className="resize_handler" onMouseDown={handleMouseDown} />
              </div>
            </div>
          </div>
          <div style={{ width: "30%" }}>
            <SideBar exportImage={exportImage} />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 