// "use client";

// import "@/app/styles/index.css";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Columns2,
//   Columns4,
//   Download,
//   Maximize2,
//   Square,
//   Star,
//   Upload,
//   X,
// } from "lucide-react";
// import { useCallback, useEffect, useRef, useState } from "react";
// import Navbar from "./components/Navbar";
// import SideBar from "./components/SideBar";
// import Footer from "./components/Footer";

// type CropMode = "whole" | "split2" | "split5";

// export default function CroppingTool() {
//   const [imageUrl, setImageUrl] = useState("");
//   const [currentImage, setCurrentImage] = useState<string>(
//     "/bg-image-default.jpg"
//   );
//   const [cropMode, setCropMode] = useState<CropMode>("whole");
//   const [canvasHeight, setCanvasHeight] = useState(700);
//   const [isDragging, setIsDragging] = useState(false);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Load image when URL changes
//   useEffect(() => {
//     if (imageUrl) {
//       setCurrentImage(imageUrl);
//     }
//   }, [imageUrl]);

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const result = e.target?.result as string;
//         setCurrentImage(result);
//         setImageUrl(result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const drawImageOnCanvas = useCallback(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const img = new Image();
//     img.crossOrigin = "anonymous";
//     img.src = imageUrl || currentImage;

//     img.onload = () => {
//       canvas.width = canvas.offsetWidth;
//       canvas.height = canvasHeight;

//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       const imgRatio = img.width / img.height;
//       const canvasRatio = canvas.width / canvas.height;

//       let drawWidth, drawHeight, offsetX, offsetY;

//       drawHeight = canvas.height;
//       drawWidth = imgRatio * drawHeight;
//       offsetX = (canvas.width - drawWidth) / 2;
//       offsetY = 0;

//       ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

//       ctx.strokeStyle = "#000000e5";
//       ctx.lineWidth = 6;

//       if (cropMode === "split2") {
//         const splitPoint = canvas.width * 0.85;
//         ctx.beginPath();
//         ctx.moveTo(splitPoint, 0);
//         ctx.lineTo(splitPoint, canvas.height);
//         ctx.stroke();
//       } else if (cropMode === "split5") {
//         const sectionWidth = canvas.width / 5;
//         for (let i = 1; i < 5; i++) {
//           ctx.beginPath();
//           ctx.moveTo(sectionWidth * i, 0);
//           ctx.lineTo(sectionWidth * i, canvas.height);
//           ctx.stroke();
//         }
//       }
//     };
//   }, [cropMode, canvasHeight, currentImage, imageUrl]);

//   useEffect(() => {
//     drawImageOnCanvas();
//   }, [drawImageOnCanvas]);

//   const exportImage = () => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     if (cropMode === "whole") {
//       const link = document.createElement("a");
//       link.download = "cropped-image.png";
//       link.href = canvas.toDataURL();
//       link.click();
//     } else if (cropMode === "split2") {
//       const splitPoint = canvas.width * 0.85;
//       const leftCanvas = document.createElement("canvas");
//       leftCanvas.width = splitPoint;
//       leftCanvas.height = canvas.height;
//       const leftCtx = leftCanvas.getContext("2d");
//       if (leftCtx) {
//         leftCtx.drawImage(
//           canvas,
//           0,
//           0,
//           splitPoint,
//           canvas.height,
//           0,
//           0,
//           splitPoint,
//           canvas.height
//         );
//         const leftLink = document.createElement("a");
//         leftLink.download = "cropped-left.png";
//         leftLink.href = leftCanvas.toDataURL();
//         leftLink.click();
//       }
//       const rightCanvas = document.createElement("canvas");
//       rightCanvas.width = canvas.width - splitPoint;
//       rightCanvas.height = canvas.height;
//       const rightCtx = rightCanvas.getContext("2d");
//       if (rightCtx) {
//         rightCtx.drawImage(
//           canvas,
//           splitPoint,
//           0,
//           canvas.width - splitPoint,
//           canvas.height,
//           0,
//           0,
//           canvas.width - splitPoint,
//           canvas.height
//         );
//         setTimeout(() => {
//           const rightLink = document.createElement("a");
//           rightLink.download = "cropped-right.png";
//           rightLink.href = rightCanvas.toDataURL();
//           rightLink.click();
//         }, 100);
//       }
//     } else if (cropMode === "split5") {
//       const sectionWidth = canvas.width / 5;
//       for (let i = 0; i < 5; i++) {
//         const partCanvas = document.createElement("canvas");
//         partCanvas.width = sectionWidth;
//         partCanvas.height = canvas.height;
//         const partCtx = partCanvas.getContext("2d");
//         if (partCtx) {
//           partCtx.drawImage(
//             canvas,
//             sectionWidth * i,
//             0,
//             sectionWidth,
//             canvas.height,
//             0,
//             0,
//             sectionWidth,
//             canvas.height
//           );
//           setTimeout(() => {
//             const partLink = document.createElement("a");
//             partLink.download = `cropped-part-${i + 1}.png`;
//             partLink.href = partCanvas.toDataURL();
//             partLink.click();
//           }, i * 100);
//         }
//       }
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget) {
//       setIsDragging(true);
//     }
//   };

//   const handleMouseMove = useCallback(
//     (e: MouseEvent) => {
//       if (isDragging) {
//         const rect = canvasRef.current?.getBoundingClientRect();
//         if (rect) {
//           const newHeight = Math.max(200, Math.min(800, e.clientY - rect.top));
//           setCanvasHeight(newHeight);
//         }
//       }
//     },
//     [isDragging]
//   );

//   const handleMouseUp = useCallback(() => {
//     setIsDragging(false);
//   }, []);

//   useEffect(() => {
//     if (isDragging) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//       };
//     }
//   }, [isDragging, handleMouseMove, handleMouseUp]);

//   return (
//     <>
//       <div
//         className="main_div"
//         style={{
//           backgroundImage: `url(${currentImage || "/bg-image-default.jpg"})`,
//           backgroundAttachment: "fixed",
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <Navbar />
//         <div className="wrapper_div">
//           <div style={{ width: "70%" }}>
//             <div className="upper_div">
//               <div
//                 className="preview_image"
//                 style={{
//                   backgroundImage: `url(${
//                     currentImage || "/bg-image-default.jpg"
//                   })`,
//                   backgroundSize: "cover",
//                   backgroundPosition: "center",
//                   backgroundAttachment: "fixed",
//                 }}
//               />
//               <div style={{ flex: "1" }}>
//                 <h1 className="main_heading">Background Cropper</h1>
//                 <p className="sub_heading">Ver. 1.1</p>
//                 <p className="input_heading">
//                   Paste your background link or upload your background below.
//                 </p>
//                 <div className="input_div">
//                   <Input
//                     type="text"
//                     value={imageUrl}
//                     onChange={(e) => setImageUrl(e.target.value)}
//                     placeholder="Enter image URL"
//                     className="input"
//                   />
//                   <Button
//                     onClick={() => fileInputRef.current?.click()}
//                     variant="outline"
//                     size="icon"
//                     className="upload_btn"
//                   >
//                     <Upload className="upload_icon" />
//                   </Button>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleFileUpload}
//                     style={{ display: "none" }}
//                   />
//                 </div>
//                 <div className="splitting_btn_div">
//                   <Button
//                     onClick={() => setCropMode("whole")}
//                     variant={"outline"}
//                     size="icon"
//                     className="splitting_btn"
//                   >
//                     <Square className="splitting_icon" />
//                   </Button>
//                   <Button
//                     onClick={() => setCropMode("split2")}
//                     variant={"outline"}
//                     size="icon"
//                     className="splitting_btn"
//                   >
//                     <Columns2 className="splitting_icon" />
//                   </Button>
//                   <Button
//                     onClick={() => setCropMode("split5")}
//                     variant={"outline"}
//                     size="icon"
//                     className="splitting_btn"
//                   >
//                     <Columns4 className="splitting_icon" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//             <div className="canvas_outer_div">
//               <div className="canvas_wrapper">
//                 <div className="canvas-control-btn-div">
//                   <Download
//                     onClick={exportImage}
//                     className="canvas-control-icons"
//                   />
//                   <Maximize2 className="canvas-control-icons" />
//                   <Star className="canvas-control-icons" />
//                   <X className="canvas-control-icons" />
//                 </div>
//                 <div
//                   className="canvas-container"
//                   style={{
//                     height: `${canvasHeight}px` /* Dynamic height */,
//                     background: "transparent",
//                   }}
//                 >
//                   <canvas
//                     // ref={canvasRef}
//                     className="canvas"
//                     style={{
//                       width: "100%",
//                       height: "100%",
//                       backgroundImage: `url(${
//                         currentImage || "/bg-image-default.jpg"
//                       })`,
//                       backgroundSize: "cover",
//                       backgroundPosition: "center",
//                       backgroundAttachment: "fixed",
//                       // display: "block",
//                       // background: "transparent",
//                     }}
//                   />
//                 </div>
//                 <div className="resize_handler" onMouseDown={handleMouseDown} />
//               </div>
//             </div>
//           </div>
//           <div style={{ width: "30%" }}>
//             <SideBar exportImage={exportImage} />
//           </div>
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// }

"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  Upload,
  Square,
  Columns2,
  Columns4,
  Download,
  Maximize2,
  Star,
  X,
} from "lucide-react";
import "@/app/styles/index.css";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Footer from "./components/Footer";

export default function BackgroundCropperApp() {
  const [currentImage, setCurrentImage] = useState<string>(
    "/bg-image-default.jpg"
  );
  const [imageUrl, setImageUrl] = useState<string>("");
  const [cropMode, setCropMode] = useState<"whole" | "split2" | "split5">(
    "whole"
  );
  const [canvasHeight, setCanvasHeight] = useState<number>(400);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageUrl.trim()) {
      const urlPattern =
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      if (
        urlPattern.test(imageUrl.trim()) ||
        imageUrl.startsWith("data:image/")
      ) {
        setCurrentImage(imageUrl.trim());
      }
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

  const drawCropLines = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvasHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
  }, [cropMode, canvasHeight]);

  useEffect(() => {
    drawCropLines();
  }, [drawCropLines]);

  const exportImage = () => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");
    if (!exportCtx) return;

    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl || currentImage;

    img.onload = () => {
      const rect = container.getBoundingClientRect();
      const imgRatio = img.width / img.height;
      const containerRatio = window.innerWidth / window.innerHeight;

      let bgWidth, bgHeight, bgX, bgY;

      if (imgRatio > containerRatio) {
        bgHeight = window.innerHeight;
        bgWidth = bgHeight * imgRatio;
        bgX = (window.innerWidth - bgWidth) / 2;
        bgY = 0;
      } else {
        bgWidth = window.innerWidth;
        bgHeight = bgWidth / imgRatio;
        bgX = 0;
        bgY = (window.innerHeight - bgHeight) / 2;
      }

      const sourceX = (rect.left - bgX) * (img.width / bgWidth);
      const sourceY = (rect.top - bgY) * (img.height / bgHeight);
      const sourceWidth = rect.width * (img.width / bgWidth);
      const sourceHeight = rect.height * (img.height / bgHeight);

      if (cropMode === "split2") {
        const splitPoint = exportCanvas.width * 0.85;

        // Export first part
        const canvas1 = document.createElement("canvas");
        const ctx1 = canvas1.getContext("2d");
        if (ctx1) {
          canvas1.width = splitPoint;
          canvas1.height = exportCanvas.height;

          ctx1.drawImage(
            img,
            Math.max(0, sourceX),
            Math.max(0, sourceY),
            Math.min(
              img.width - Math.max(0, sourceX),
              sourceWidth * (splitPoint / exportCanvas.width)
            ),
            Math.min(img.height - Math.max(0, sourceY), sourceHeight),
            0,
            0,
            canvas1.width,
            canvas1.height
          );

          const link1 = document.createElement("a");
          link1.download = "cropped-image-part-1.png";
          link1.href = canvas1.toDataURL();
          link1.click();
        }

        // Export second part
        const canvas2 = document.createElement("canvas");
        const ctx2 = canvas2.getContext("2d");
        if (ctx2) {
          canvas2.width = exportCanvas.width - splitPoint;
          canvas2.height = exportCanvas.height;

          const rightSourceX =
            sourceX + sourceWidth * (splitPoint / exportCanvas.width);
          const rightSourceWidth =
            sourceWidth *
            ((exportCanvas.width - splitPoint) / exportCanvas.width);

          ctx2.drawImage(
            img,
            Math.max(0, rightSourceX),
            Math.max(0, sourceY),
            Math.min(img.width - Math.max(0, rightSourceX), rightSourceWidth),
            Math.min(img.height - Math.max(0, sourceY), sourceHeight),
            0,
            0,
            canvas2.width,
            canvas2.height
          );

          const link2 = document.createElement("a");
          link2.download = "cropped-image-part-2.png";
          link2.href = canvas2.toDataURL();
          link2.click();
        }
      } else if (cropMode === "split5") {
        const sectionWidth = exportCanvas.width / 5;

        for (let i = 0; i < 5; i++) {
          const partCanvas = document.createElement("canvas");
          const partCtx = partCanvas.getContext("2d");
          if (partCtx) {
            partCanvas.width = sectionWidth;
            partCanvas.height = exportCanvas.height;

            const partSourceX = sourceX + sourceWidth * (i / 5);
            const partSourceWidth = sourceWidth / 5;

            partCtx.drawImage(
              img,
              Math.max(0, partSourceX),
              Math.max(0, sourceY),
              Math.min(img.width - Math.max(0, partSourceX), partSourceWidth),
              Math.min(img.height - Math.max(0, sourceY), sourceHeight),
              0,
              0,
              partCanvas.width,
              partCanvas.height
            );

            const partLink = document.createElement("a");
            partLink.download = `cropped-image-part-${i + 1}.png`;
            partLink.href = partCanvas.toDataURL();
            partLink.click();
          }
        }
      } else {
        exportCtx.drawImage(
          img,
          Math.max(0, sourceX),
          Math.max(0, sourceY),
          Math.min(img.width - Math.max(0, sourceX), sourceWidth),
          Math.min(img.height - Math.max(0, sourceY), sourceHeight),
          0,
          0,
          exportCanvas.width,
          exportCanvas.height
        );

        const link = document.createElement("a");
        link.download = "cropped-image.png";
        link.href = exportCanvas.toDataURL();
        link.click();
      }
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const startY = e.clientY;
    const startHeight = canvasHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(200, Math.min(800, startHeight + deltaY));
      setCanvasHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      className="main_div"
      style={{
        backgroundImage: `url(${currentImage || "/abstract-pattern.png"})`,
      }}
    >
      <Navbar />
      <div className="wrapper_div">
        <div style={{ width: "70%" }}>
          <div className="upper_div">
            <div
              className="preview_image"
              style={{
                backgroundImage: `url(${
                  currentImage || "/abstract-pattern.png"
                })`,
                backgroundAttachment: "fixed",
              }}
            />
            <div style={{ flex: 1 }}>
              <h1 className="main_heading">Background Cropper</h1>
              <p className="sub_heading">Ver. 1.1</p>
              <p className="input_heading">
                Paste your background link or upload your background below.
              </p>

              <div className="input_div">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="input"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="upload_btn"
                >
                  <Upload className="upload_icon" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
              </div>

              <div className="splitting_btn_div">
                <button
                  onClick={() => setCropMode("whole")}
                  className="splitting_btn"
                  style={{
                    backgroundColor: cropMode === "whole" ? "#333" : "#080808",
                  }}
                >
                  <Square className="splitting_icon" />
                </button>
                <button
                  onClick={() => setCropMode("split2")}
                  className="splitting_btn"
                  style={{
                    backgroundColor: cropMode === "split2" ? "#333" : "#080808",
                  }}
                >
                  <Columns2 className="splitting_icon" />
                </button>
                <button
                  onClick={() => setCropMode("split5")}
                  className="splitting_btn"
                  style={{
                    backgroundColor: cropMode === "split5" ? "#333" : "#080808",
                  }}
                >
                  <Columns4 className="splitting_icon" />
                </button>
              </div>
            </div>
          </div>

          <div className="canvas_outer_div">
            <div
              style={{
                color: "white",
                marginBottom: "0.5rem",
                fontSize: "1.1rem",
              }}
            >
              My Workshop Showcase
            </div>
            <div className="canvas_wrapper">
              <div
                ref={canvasContainerRef}
                style={{
                  height: `${canvasHeight}px`,
                  position: "relative",
                  backgroundImage: `url(${
                    currentImage || "/abstract-pattern.png"
                  })`,
                  backgroundAttachment: "fixed",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "20px",
                    color: "white",
                    fontSize: "1.2rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                ></div>

                <canvas
                  ref={canvasRef}
                  className="canvas"
                  style={{ background: "transparent" }}
                />

                <div className="canvas-control-btn-div">
                  <Download
                    className="canvas-control-icons"
                    onClick={exportImage}
                  />
                  <Maximize2 className="canvas-control-icons" />
                  <Star className="canvas-control-icons" />
                  <X className="canvas-control-icons" />
                </div>
                <div className="resize_handler" onMouseDown={handleMouseDown} />
              </div>
            </div>
          </div>
        </div>
        <div style={{ width: "30%" }}>
          <SideBar exportImage={exportImage} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
