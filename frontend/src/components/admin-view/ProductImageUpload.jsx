// components/admin-view/ProductImageUpload.jsx

import React, { useEffect, useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";

export default function ProductImageUpload({
  imageFiles,
  setImageFiles,
  uploadedImageUrls,
  setUploadedImageUrls,
  setImageLoadingState,
  imageLoadingState,
}) {
  const inputRef = useRef(null);

  // 📂 Handles file selection from the system file picker
  function handleImageFileChange(event) {
    const selectedFiles = Array.from(event.target.files);
    setImageFiles((prev) => [...prev, ...selectedFiles]);
  }

  // 🚫 Prevents default drag-over browser behavior
  function handleDragOver(event) {
    event.preventDefault();
  }

  // 📥 Handles file drop action
  function handleDrop(event) {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setImageFiles((prev) => [...prev, ...droppedFiles]);
  }

  // ❌ Removes a single image by index
  function handleRemoveImage(index) {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImageLoadingState((prev) => prev.filter((_, i) => i !== index));
  }

  function handleClearAll() {
    setImageFiles([]);
    setUploadedImageUrls([]);
    setImageLoadingState([]);
  }

  // ☁️ Upload images to Cloudinary via backend
  async function uploadImagesToCloudinary(newFiles) {
    // Initialize loading state for new files
    const loadingArray = [...imageLoadingState];
    newFiles.forEach((file) => {
      const index = imageFiles.indexOf(file);
      loadingArray[index] = true;
    });
    setImageLoadingState([...loadingArray]);

    // Upload all files concurrently
    const uploadPromises = newFiles.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          "http://localhost:3000/api/admin/products/upload-image",
          { method: "POST", body: formData }
        );
        const data = await response.json();
        if (data.success && data.result?.secure_url) {
          return { file, url: data.result.secure_url };
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
      return null;
    });

    const results = await Promise.all(uploadPromises);

    // Update uploaded URLs
    const newUploadedUrls = results
      .filter((res) => res !== null)
      .map((res) => res.url);

    setUploadedImageUrls((prev) => [...prev, ...newUploadedUrls]);

    // Reset loading state for uploaded files
    const newLoadingArray = [...imageLoadingState];
    newFiles.forEach((file) => {
      const index = imageFiles.indexOf(file);
      newLoadingArray[index] = false;
    });
    setImageLoadingState(newLoadingArray);
  }

  // 🧠 Auto-upload when images are added
  useEffect(() => {
    if (imageFiles.length > 0) {
      // Initialize loading state for any new files
      const newLoadingState = [...imageLoadingState];
      while (newLoadingState.length < imageFiles.length) {
        newLoadingState.push(false);
      }
      setImageLoadingState(newLoadingState);

      // Upload only files that do not have an uploaded URL yet and are not existing images
      const newFiles = imageFiles
        .filter((file) => !file.isExisting)
        .slice(uploadedImageUrls.length);
      if (newFiles.length > 0) {
        uploadImagesToCloudinary(newFiles);
      }
    }
  }, [imageFiles]);

  // Get only NEW files (not existing ones)
  const newFiles = imageFiles.filter((file) => !file.isExisting);

  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      {/* Section Header */}
      <Label className="text-base font-semibold text-gray-800 mb-3 block">
        Product Images
      </Label>

      {/* Upload Zone */}
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

        {/* No images selected yet */}
        {uploadedImageUrls.length === 0 && newFiles.length === 0 ? (
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
          // Image previews - ONLY SHOW ONCE
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Show ALL images from uploadedImageUrls (this includes both existing and newly uploaded) */}
            {uploadedImageUrls.map((url, index) => {
              const correspondingFile = imageFiles[index];
              const isLoading = imageLoadingState[index];

              return (
                <div
                  key={`image-${index}`}
                  className="relative group rounded-lg border bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                >
                  {isLoading ? (
                    <Skeleton className="w-full h-40 rounded-md bg-gray-200" />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100 w-full h-40">
                      <img
                        src={url}
                        alt={`product-${index}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-gray-700 transition"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <div className="p-2 text-xs text-gray-600 truncate text-center">
                    {correspondingFile?.isExisting
                      ? "Existing Image"
                      : `Image ${index + 1}`}
                  </div>
                </div>
              );
            })}

            {/* Show loading skeletons for NEW files that haven't been uploaded yet */}
            {newFiles.map((file, index) => {
              // Only show files that haven't been uploaded yet (no URL)
              const fileIndex = imageFiles.indexOf(file);
              const isLoading = imageLoadingState[fileIndex];

              // If this file already has a URL in uploadedImageUrls, skip it (it's shown above)
              if (uploadedImageUrls[fileIndex]) return null;

              return (
                <div
                  key={`loading-${fileIndex}`}
                  className="relative group rounded-lg border bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                >
                  {isLoading ? (
                    <Skeleton className="w-full h-40 rounded-md bg-gray-200" />
                  ) : (
                    <div className="flex items-center justify-center bg-gray-100 w-full h-40">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${fileIndex}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-gray-700 transition"
                    onClick={() => handleRemoveImage(fileIndex)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <div className="p-2 text-xs text-gray-600 truncate text-center">
                    Uploading...
                  </div>
                </div>
              );
            })}

            {/* Add more button */}
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

        {(uploadedImageUrls.length > 0 || newFiles.length > 0) && (
          <div className="flex justify-center mt-2 gap-2">
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Footer — image count */}
      {/* {(uploadedImageUrls.length > 0 || newFiles.length > 0) && (
        <p className="text-sm text-gray-500 mt-3 text-center">
          {uploadedImageUrls.length + newFiles.length} image
          {uploadedImageUrls.length + newFiles.length > 1 ? "s" : ""} selected
        </p>
      )} */}

      {/* Uploaded URLs (for debugging, optional) */}
      {uploadedImageUrls.length > 0 && (
        <div className="mt-4 text-xs text-green-600 text-center">
          ✅ {uploadedImageUrls.length} image
          {uploadedImageUrls.length > 1 ? "s" : ""} ready
        </div>
      )}
    </div>
  );
}
