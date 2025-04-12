import React, { useState, useRef } from "react";
import { uploadImageToCloudflare } from "../../utils/cloudflareImageUpload";
import "./ImageUploader.css";

interface ImageUploaderProps {
  onImageUrlChange: (url: string) => void;
  currentImageUrl: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUrlChange,
  currentImageUrl,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(10); // Start progress

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 300);

      // Upload the image to Cloudflare
      const imageUrl = await uploadImageToCloudflare(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Pass the image URL to the parent component
      onImageUrlChange(imageUrl);

      // Success message in console for debugging
      console.log("Image uploaded successfully to Cloudflare:", imageUrl);
    } catch (error: any) {
      console.error("Error details:", error);
      setUploadError(
        error.message ||
          "Failed to upload image to Cloudflare. Please try again or contact support."
      );
    } finally {
      setIsUploading(false);

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="image-uploader">
      <div className="image-upload-container">
        <div className="image-preview-area" onClick={triggerFileInput}>
          {currentImageUrl ? (
            <img
              src={currentImageUrl}
              alt="Template Preview"
              className="image-preview"
            />
          ) : (
            <div className="upload-placeholder">
              <div className="upload-icon">📷</div>
              <span>Click to upload image</span>
            </div>
          )}

          {isUploading && (
            <div className="upload-overlay">
              <div className="progress-container">
                <div
                  className="progress-bar"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <div className="progress-text">
                Uploading to Cloudflare... {uploadProgress}%
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept="image/*"
          className="file-input"
        />

        <div className="upload-actions">
          <button
            type="button"
            className="upload-button"
            onClick={triggerFileInput}
            disabled={isUploading}
          >
            {currentImageUrl ? "Change Image" : "Upload Image"}
          </button>

          {currentImageUrl && (
            <button
              type="button"
              className="remove-button"
              onClick={() => onImageUrlChange("")}
              disabled={isUploading}
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {uploadError && <div className="upload-error-message">{uploadError}</div>}

      <p className="upload-help-text">
        Images are uploaded directly to Cloudflare • Supported formats: JPG,
        PNG, GIF • Max size: 5MB
      </p>
    </div>
  );
};

export default ImageUploader;
