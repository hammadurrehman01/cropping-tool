"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Download, Maximize2, Star, X, Upload, Square, Columns2, Columns3, ChevronDown, Columns4 } from "lucide-react"
import Navbar from "./components/Navbar"
import SideBar from "./components/SideBar"

type CropMode = "whole" | "split2" | "split5"

export default function CroppingTool() {
  const [imageUrl, setImageUrl] = useState(
    "https://cdn.fastly.steamstatic.com/steamcommunity/public/images/items/730/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEObwgfEh_nvjlWhNzZCveCDfIBj98xqodQ2CZknz5-OOqhNQhkZzvFDa0DyLJSgMC0UXHd5sJcWdak8L5ILw2-vQXGL7l5ZdxOGvCGX_qCUg/360fx360f",
  )
  const [currentImage, setCurrentImage] = useState<string>("/bg-image-default.jpg")
  const [cropMode, setCropMode] = useState<CropMode>("whole")
  const [canvasHeight, setCanvasHeight] = useState(400)
  const [isDragging, setIsDragging] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load image when URL changes
  useEffect(() => {
    if (imageUrl) {
      setCurrentImage(imageUrl)
    }
  }, [imageUrl])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCurrentImage(result)
        setImageUrl(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const drawImageOnCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !currentImage) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvasHeight

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw image to fill canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Draw crop lines based on mode
      if (cropMode === "split2") {
        const splitPoint = canvas.width * 0.85
        ctx.strokeStyle = "#00ffff"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(splitPoint, 0)
        ctx.lineTo(splitPoint, canvas.height)
        ctx.stroke()
      } else if (cropMode === "split5") {
        ctx.strokeStyle = "#00ffff"
        ctx.lineWidth = 2
        const sectionWidth = canvas.width / 5
        for (let i = 1; i < 5; i++) {
          ctx.beginPath()
          ctx.moveTo(sectionWidth * i, 0)
          ctx.lineTo(sectionWidth * i, canvas.height)
          ctx.stroke()
        }
      }
    }
    img.src = currentImage
  }, [currentImage, cropMode, canvasHeight])

  useEffect(() => {
    drawImageOnCanvas()
  }, [drawImageOnCanvas])

  const exportImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (cropMode === "whole") {
      // Export whole image
      const link = document.createElement("a")
      link.download = "cropped-image.png"
      link.href = canvas.toDataURL()
      link.click()
    } else if (cropMode === "split2") {
      // Export two parts
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const splitPoint = canvas.width * 0.85

      // Left part (85%)
      const leftCanvas = document.createElement("canvas")
      leftCanvas.width = splitPoint
      leftCanvas.height = canvas.height
      const leftCtx = leftCanvas.getContext("2d")
      if (leftCtx) {
        leftCtx.drawImage(canvas, 0, 0, splitPoint, canvas.height, 0, 0, splitPoint, canvas.height)
        const leftLink = document.createElement("a")
        leftLink.download = "cropped-left.png"
        leftLink.href = leftCanvas.toDataURL()
        leftLink.click()
      }

      // Right part (15%)
      const rightCanvas = document.createElement("canvas")
      rightCanvas.width = canvas.width - splitPoint
      rightCanvas.height = canvas.height
      const rightCtx = rightCanvas.getContext("2d")
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
          canvas.height,
        )
        setTimeout(() => {
          const rightLink = document.createElement("a")
          rightLink.download = "cropped-right.png"
          rightLink.href = rightCanvas.toDataURL()
          rightLink.click()
        }, 100)
      }
    } else if (cropMode === "split5") {
      // Export five equal parts
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const sectionWidth = canvas.width / 5

      for (let i = 0; i < 5; i++) {
        const partCanvas = document.createElement("canvas")
        partCanvas.width = sectionWidth
        partCanvas.height = canvas.height
        const partCtx = partCanvas.getContext("2d")
        if (partCtx) {
          partCtx.drawImage(canvas, sectionWidth * i, 0, sectionWidth, canvas.height, 0, 0, sectionWidth, canvas.height)
          setTimeout(() => {
            const partLink = document.createElement("a")
            partLink.download = `cropped-part-${i + 1}.png`
            partLink.href = partCanvas.toDataURL()
            partLink.click()
          }, i * 100)
        }
      }
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true)
    }
  }

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          const newHeight = Math.max(200, Math.min(800, e.clientY - rect.top))
          setCanvasHeight(newHeight)
        }
      }
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  return (
    <div className="min-h-screen text-white">
      {/* Navigation */}
      <Navbar />

      <div className="w-[85%] mx-auto flex gap-3 mt-10 bg-gradient-to-b from-[#001820] to-[#181818ca] px-6">
        <div>
          <div className="flex items-center gap-9 ">
            <div className="border-2 border-cyan-500 w-[164px] h-[164px] flex items-center justify-center mb-6">
              <img
                src={currentImage ?? "/bg-image-default.jpg"}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-thin text-2xl mb-2">Background Cropper</h1>
              <p className="text-primary text-sm mb-4">Ver. 1.1</p>
              <p className="text-slate-300 mb-6">Paste your background link or upload your background below.</p>

              <div className="flex items-center space-x-2 mb-4">
                <Input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://cdn.fastly.steamstatic.com/steamcommunity/public/image"
                  className="flex-1 bg-slate-700 border-slate-600 text-white"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="icon"
                  className="border-slate-600 hover:bg-slate-700"
                >
                  <Upload className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => setCropMode("whole")}
                  variant={cropMode === "whole" ? "default" : "outline"}
                  size="icon"
                  className="border-slate-600"
                >
                  <Square className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setCropMode("split2")}
                  variant={cropMode === "split2" ? "default" : "outline"}
                  size="icon"
                  className="border-slate-600"
                >
                  <Columns2 className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => setCropMode("split5")}
                  variant={cropMode === "split5" ? "default" : "outline"}
                  size="icon"
                  className="border-slate-600"
                >
                  <Columns4 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-slate-800 rounded-lg p-4 relative">
              {/* Canvas Controls */}
              <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
                <Button
                  onClick={exportImage}
                  variant="outline"
                  size="icon"
                  className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <Star className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" className="bg-slate-700 border-slate-600 hover:bg-slate-600">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Canvas */}
              <canvas
                ref={canvasRef}
                className="w-full border border-slate-600 rounded cursor-pointer"
                style={{ height: `${canvasHeight}px` }}
              />

              {/* Resize Handle */}
              <div
                className="absolute bottom-0 left-0 right-0 h-2 cursor-ns-resize bg-slate-600 hover:bg-slate-500 rounded-b"
                onMouseDown={handleMouseDown}
              />
            </div>
          </div>
        </div>

        <SideBar exportImage={exportImage} />
      </div>
    </div>
  )
}
