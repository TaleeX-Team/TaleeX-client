import  React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { FileText, Upload, X } from "lucide-react"


export function FileUpload({ value, onChange, accept = "*" }) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef(null)

    const handleDragOver = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onChange(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onChange(e.target.files[0])
        }
    }

    const handleRemoveFile = () => {
        onChange(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + " bytes"
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
        else return (bytes / 1048576).toFixed(1) + " MB"
    }

    return (
        <div className="w-full">
            {!value ? (
                <div
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragging ? "border-primary bg-primary/5" : "border-input"
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="flex flex-col items-center justify-center gap-2">
                        <Upload className="h-10 w-10 text-muted-foreground" />
                        <div className="flex flex-col items-center">
                            <p className="text-sm font-medium">Drag and drop your file here or click to browse</p>
                            <p className="text-xs text-muted-foreground mt-1">Supports PDF, DOC, DOCX, JPG, PNG</p>
                        </div>
                        <Button type="button" variant="secondary" size="sm" className="mt-2">
                            Select File
                        </Button>
                    </div>
                    <input ref={fileInputRef} type="file" className="hidden" accept={accept} onChange={handleFileChange} />
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-md">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-[200px]">{value.name}</span>
                            <span className="text-xs text-muted-foreground">{formatFileSize(value.size)}</span>
                        </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Remove file</span>
                    </Button>
                </div>
            )}
        </div>
    )
}
