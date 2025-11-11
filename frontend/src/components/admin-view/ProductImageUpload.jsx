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

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ Dynamic backend URL

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
  async function uploadImagesToCloudinary(filesToUpload) {
    if (filesToUpload.length === 0) return;

    // Create loading states for the files to upload
    const filesWithIndex = filesToUpload.map((file) => ({
      file,
      index: imageFiles.indexOf(file),
    }));

    // Set loading state to true for these files
    const newLoadingState = [...imageLoadingState];
    filesWithIndex.forEach(({ index }) => {
      if (index !== -1) {
        newLoadingState[index] = true;
      }
    });
    setImageLoadingState(newLoadingState);

    // Upload all files concurrently
    const uploadPromises = filesWithIndex.map(async ({ file, index }) => {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/admin/products/upload-image`,
          { method: "POST", body: formData }
        );
        const data = await response.json();
        if (data.success && data.result?.secure_url) {
          return { index, url: data.result.secure_url };
        }
      } catch (err) {
        console.error("Error uploading image:", err);
      }
      return { index, url: null };
    });

    const results = await Promise.all(uploadPromises);

    // Update uploaded URLs with the correct positions
    const successfulUploads = results.filter((res) => res.url !== null);

    // Create a new array for uploaded URLs to maintain order
    const updatedUrls = [...uploadedImageUrls];
    successfulUploads.forEach(({ index, url }) => {
      // Insert the new URL at the correct position
      if (index < updatedUrls.length) {
        updatedUrls[index] = url;
      } else {
        updatedUrls.push(url);
      }
    });

    setUploadedImageUrls(updatedUrls);

    // Reset loading state for uploaded files
    const finalLoadingState = [...imageLoadingState];
    filesWithIndex.forEach(({ index }) => {
      if (index !== -1) {
        finalLoadingState[index] = false;
      }
    });
    setImageLoadingState(finalLoadingState);
  }

  // 🧠 Auto-upload when images are added - FIXED LOGIC
  useEffect(() => {
    if (imageFiles.length > 0) {
      // Initialize loading state for any new files
      const newLoadingState = [...imageLoadingState];
      while (newLoadingState.length < imageFiles.length) {
        newLoadingState.push(false);
      }
      setImageLoadingState(newLoadingState);

      // Find files that need to be uploaded:
      // 1. Not existing images
      // 2. Don't have a corresponding URL in uploadedImageUrls yet
      const filesToUpload = imageFiles.filter((file, index) => {
        // Skip existing images
        if (file.isExisting) return false;

        // Skip files that already have URLs
        // Check if this file position has a URL in uploadedImageUrls
        if (index < uploadedImageUrls.length && uploadedImageUrls[index]) {
          return false;
        }

        return true;
      });

      if (filesToUpload.length > 0) {
        uploadImagesToCloudinary(filesToUpload);
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
          // Image previews
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Show ALL images from uploadedImageUrls */}
            {imageFiles.map((file, index) => {
              const url = uploadedImageUrls[index];
              const isLoading = imageLoadingState[index];

              // If no URL and not loading, and it's a new file, show file preview
              if (!url && !isLoading && !file.isExisting) {
                return (
                  <div
                    key={`file-${index}`}
                    className="relative group rounded-lg border bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                  >
                    <div className="flex items-center justify-center bg-gray-100 w-full h-40">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${index}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-gray-700 transition"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                    <div className="p-2 text-xs text-gray-600 truncate text-center">
                      Ready to upload
                    </div>
                  </div>
                );
              }

              // Show uploaded or loading images
              return (
                <div
                  key={`image-${index}`}
                  className="relative group rounded-lg border bg-white shadow-sm hover:shadow-md transition duration-200 overflow-hidden"
                >
                  {isLoading ? (
                    <Skeleton className="w-full h-40 rounded-md bg-gray-200" />
                  ) : url ? (
                    <div className="flex items-center justify-center bg-gray-100 w-full h-40">
                      <img
                        src={url}
                        alt={`product-${index}`}
                        className="object-cover w-full h-full rounded-md"
                      />
                    </div>
                  ) : null}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-white/80 hover:bg-white text-gray-700 transition"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                  <div className="p-2 text-xs text-gray-600 truncate text-center">
                    {file.isExisting
                      ? "Existing Image"
                      : isLoading
                      ? "Uploading..."
                      : url
                      ? `Image ${index + 1}`
                      : "Ready to upload"}
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

        {imageFiles.length > 0 && (
          <div className="flex justify-center mt-2 gap-2">
            <Button variant="outline" size="sm" onClick={handleClearAll}>
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Upload status */}
      {uploadedImageUrls.length > 0 && (
        <div className="mt-4 text-xs text-green-600 text-center">
          ✅ {uploadedImageUrls.filter((url) => url).length} image
          {uploadedImageUrls.filter((url) => url).length > 1 ? "s" : ""} ready
        </div>
      )}
    </div>
  );
}
