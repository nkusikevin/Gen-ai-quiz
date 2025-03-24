"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload } from "lucide-react"

interface FileUploaderProps {
  onFileUpload: (file: File) => void
}

export function FileUploader({ onFileUpload }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        onFileUpload(file)
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 bg-primary/10 rounded-full">
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">Upload PDF Document</h3>
          <p className="text-sm text-muted-foreground mt-1">Drag and drop your PDF file here, or click to browse</p>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
        <Button variant="outline" onClick={handleButtonClick} className="gap-2">
          <Upload className="h-4 w-4" />
          Browse Files
        </Button>
      </div>
    </div>
  )
}

