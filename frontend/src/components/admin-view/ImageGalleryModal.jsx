// components/admin-view/ImageGalleryModal.jsx
import React from "react";
import {
  XIcon,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ImageGalleryModal({
  images,
  isOpen,
  onClose,
  initialIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [zoom, setZoom] = React.useState(1);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const [startPosition, setStartPosition] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
    // Reset zoom and position when image changes
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentIndex(index);
  };

  // Zoom functions
  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 1));
  };

  const resetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse event handlers for panning
  const handleMouseDown = (e) => {
    if (zoom <= 1) return;

    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || zoom <= 1) return;

    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;

    // Calculate bounds to prevent dragging beyond image edges
    const container = document.querySelector(".image-container");
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const maxX = ((zoom - 1) * containerRect.width) / 2;
      const maxY = ((zoom - 1) * containerRect.height) / 2;

      setPosition({
        x: Math.max(Math.min(newX, maxX), -maxX),
        y: Math.max(Math.min(newY, maxY), -maxY),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile
  const handleTouchStart = (e) => {
    if (zoom <= 1) return;

    setIsDragging(true);
    const touch = e.touches[0];
    setStartPosition({
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || zoom <= 1) return;

    const touch = e.touches[0];
    const newX = touch.clientX - startPosition.x;
    const newY = touch.clientY - startPosition.y;

    // Calculate bounds
    const container = document.querySelector(".image-container");
    if (container) {
      const containerRect = container.getBoundingClientRect();
      const maxX = ((zoom - 1) * containerRect.width) / 2;
      const maxY = ((zoom - 1) * containerRect.height) / 2;

      setPosition({
        x: Math.max(Math.min(newX, maxX), -maxX),
        y: Math.max(Math.min(newY, maxY), -maxY),
      });
    }
  };

  // Handle keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (event) => {
      if (!isOpen) return;

      switch (event.key) {
        case "ArrowLeft":
          goToPrev();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "Escape":
          onClose();
          break;
        case "+":
        case "=":
          event.preventDefault();
          zoomIn();
          break;
        case "-":
          event.preventDefault();
          zoomOut();
          break;
        case "0":
          event.preventDefault();
          resetZoom();
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  // Reset dragging when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setIsDragging(false);
    }
  }, [isOpen]);

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-4xl w-full max-h-[90vh] flex flex-col p-0 bg-white border shadow-xl [&>button]:hidden"
      >
        {/* Header */}
        <DialogHeader className="flex flex-row items-center justify-between p-4 border-b">
          <DialogTitle className="text-gray-900 text-lg font-semibold">
            Product Images ({currentIndex + 1} of {images.length})
          </DialogTitle>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={zoomOut}
                disabled={zoom <= 1}
                className="h-8 w-8 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                title="Zoom Out ( - )"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>

              <span className="text-sm text-gray-600 min-w-[40px] text-center">
                {Math.round(zoom * 100)}%
              </span>

              <Button
                variant="ghost"
                size="icon"
                onClick={zoomIn}
                disabled={zoom >= 3}
                className="h-8 w-8 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                title="Zoom In ( + )"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={resetZoom}
                disabled={zoom === 1}
                className="h-8 w-8 text-gray-600 hover:text-gray-900 disabled:opacity-30"
                title="Reset Zoom ( 0 )"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            >
              <XIcon className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        {/* Main Image Container */}
        <div className="flex-1 relative flex items-center justify-center p-6 bg-gray-50 overflow-hidden">
          {/* Previous Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 border shadow-lg z-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          )}

          {/* Image Container with Zoom */}
          <div
            className="image-container flex items-center justify-center w-full h-96 bg-white rounded-lg border shadow-sm overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            <img
              src={images[currentIndex]}
              alt={`Product image ${currentIndex + 1}`}
              className="max-h-full max-w-full object-contain transition-transform duration-200"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                cursor:
                  zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
              }}
            />
          </div>

          {/* Next Button */}
          {images.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 border shadow-lg z-20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}

          {/* Zoom Level Indicator */}
          {zoom > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm px-3 py-1 rounded-full z-10">
              {Math.round(zoom * 100)}% • Drag to pan
            </div>
          )}
        </div>

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="p-4 border-t bg-white">
            <div className="flex gap-3 justify-center overflow-x-auto py-2">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`flex-shrink-0 w-14 h-14 border-2 rounded-md overflow-hidden transition-all duration-200 ${
                    index === currentIndex
                      ? "border-blue-500 border-2 shadow-md"
                      : "border-gray-300 hover:border-gray-400 hover:shadow-sm"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Dots for Mobile */}
        {images.length > 1 && (
          <div className="flex justify-center gap-2 pb-4 sm:hidden">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-blue-500 w-4"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
