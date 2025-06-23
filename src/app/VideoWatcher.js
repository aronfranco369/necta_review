"use client";

import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";

const GoogleDriveVideoPlayer = ({
  driveLink,
  width = "100%",
  height = "400px",
}) => {
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Extract file ID from Google Drive link
  const extractFileId = (link) => {
    if (!link) return null;

    // Handle different Google Drive URL formats
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9-_]+)/, // Standard sharing link
      /id=([a-zA-Z0-9-_]+)/, // Old format with id parameter
      /\/d\/([a-zA-Z0-9-_]+)/, // Short format
    ];

    for (const pattern of patterns) {
      const match = link.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  };

  // Convert Google Drive link to direct streaming URL
  const getStreamingUrl = (fileId) => {
    // Use the preview URL which works better for video streaming
    return `https://drive.google.com/file/d/${fileId}/preview`;
  };

  useEffect(() => {
    if (!driveLink) {
      setError("No Google Drive link provided");
      return;
    }

    setLoading(true);
    setError("");

    const fileId = extractFileId(driveLink);

    if (!fileId) {
      setError("Invalid Google Drive link format");
      setLoading(false);
      return;
    }

    const streamUrl = getStreamingUrl(fileId);
    setVideoUrl(streamUrl);
    setLoading(false);
  }, [driveLink]);

  const handleVideoError = () => {
    setError(
      "Failed to load video. Make sure the file is public and is a valid video format."
    );
  };

  const handleVideoLoad = () => {
    setError("");
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
        style={{ width, height }}
      >
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center bg-red-50 border border-red-300 rounded-lg text-red-600 p-5 text-center"
        style={{ width, height }}
      >
        <div>
          <p className="font-semibold mb-2">Error: {error}</p>
          <small className="text-sm text-red-500">
            Make sure your Google Drive file is:
            <br />• Set to "Anyone with the link can view"
            <br />• A valid video format (MP4, WebM, etc.)
          </small>
        </div>
      </div>
    );
  }

  // Only render iframe if we have a valid videoUrl
  if (!videoUrl) {
    return (
      <div
        className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
        style={{ width, height }}
      >
        <p className="text-gray-600">Initializing video player...</p>
      </div>
    );
  }

  return (
    <div style={{ width, height }} className="relative">
      <iframe
        src={videoUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
        className="rounded-lg shadow-lg"
        title="Google Drive Video Player"
        onError={handleVideoError}
        onLoad={handleVideoLoad}
      />
    </div>
  );
};

const VideoWatcher = ({
  driveLink,
  onClose,
  onDownload,
  isAnimating,
  isDownloading,
}) => {
  return (
    <div
      className={`w-full max-w-4xl transition-all duration-500 transform ${
        isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
      }`}
    >
      <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Now Playing</h2>
          <button
            onClick={onClose}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2 rounded-lg transition-all duration-200 border border-red-500/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video player */}
        <div className="rounded-xl overflow-hidden shadow-2xl">
          <GoogleDriveVideoPlayer
            driveLink={driveLink}
            width="100%"
            height="500px"
          />
        </div>

        {/* Control buttons below player */}
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 px-6 py-3 rounded-lg transition-all duration-200 border border-green-500/30 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? "Downloading..." : "Download Video"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoWatcher;
