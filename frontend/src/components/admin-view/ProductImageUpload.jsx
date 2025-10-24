import React, { useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";

// ProductImageUpload Component
// ---------------------------------
// Handles multiple product image uploads with:
//  - Drag & drop support
//  - File browsing
//  - Live image previews
//  - Remove functionality

export default function ProductImageUpload({
  imageFiles,
  setImageFiles,
  uploadedImageUrls,
  setUploadedImageUrls,
}) {
  const inputRef = useRef(null);

  //  Handles file selection from system dialog
  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    setImageFiles((prev) => [...prev, ...selectedFiles]);
  }

  //  Prevents default browser behavior when dragging files over the area
  function handleDragOver(event) {
    event.preventDefault();
  }

  //  Handles file drop and adds them to the upload list
  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setImageFiles((prev) => [...prev, ...droppedFiles]);
  }

  //  Removes a specific image from the list by index
  function handleRemoveImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      {/* Section Label */}
      <Label className="text-base font-semibold text-gray-800 mb-3 block">
        Product Images
      </Label>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="relative border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors duration-200 p-6"
      >
        {/* Hidden file input */}
        <Input
          id="image-upload"
          type="file"
          className="hidden"
          multiple
          ref={inputRef}
          onChange={handleImageFileChange}
        />

        {/* When no images are uploaded yet */}
        {imageFiles.length === 0 ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center cursor-pointer h-44"
          >
            <UploadCloudIcon className="w-12 h-12 text-gray-400 mb-3" />
            <span className="text-sm text-gray-500 font-medium text-center">
              Drag & drop product images here or{" "}
              <span className="text-blue-600 underline">browse</span>
            </span>
          </Label>
        ) : (
          /* When images are uploaded, display previews */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {imageFiles.map((file, index) => (
              <div
                key={index}
                className="relative group rounded-lg border bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
              >
                {/* Image Preview with fixed width/height */}
                <div className="flex items-center justify-center bg-gray-100 w-full h-40">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-40 rounded-md"
                  />
                </div>

                {/* Remove Image Button (shows on hover) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-gray-700 transition"
                  onClick={() => handleRemoveImage(index)}
                >
                  <XIcon className="w-4 h-4" />
                </Button>

                {/* File name */}
                <div className="p-2 text-xs text-gray-600 truncate text-center">
                  {file.name}
                </div>
              </div>
            ))}

            {/* Add More Image Tile */}
            <Label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-40 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition"
            >
              <UploadCloudIcon className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-medium">
                Add more
              </span>
            </Label>
          </div>
        )}
      </div>

      {/* Footer text showing image count */}
      {imageFiles.length > 0 && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          {imageFiles.length} image{imageFiles.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
