// "use client"; // This component uses client-side hooks (useState, etc.)

// import { useState, useEffect } from "react";
// import { Play, Download, X } from "lucide-react";

// const GoogleDriveVideoPlayer = ({
//   driveLink,
//   width = "100%",
//   height = "400px",
// }) => {
//   const [videoUrl, setVideoUrl] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Extract file ID from Google Drive link
//   const extractFileId = (link) => {
//     if (!link) return null;

//     // Handle different Google Drive URL formats
//     const patterns = [
//       /\/file\/d\/([a-zA-Z0-9-_]+)/, // Standard sharing link
//       /id=([a-zA-Z0-9-_]+)/, // Old format with id parameter
//       /\/d\/([a-zA-Z0-9-_]+)/, // Short format
//     ];

//     for (const pattern of patterns) {
//       const match = link.match(pattern);
//       if (match) {
//         return match[1];
//       }
//     }

//     return null;
//   };

//   // Convert Google Drive link to direct streaming URL
//   const getStreamingUrl = (fileId) => {
//     // Use the preview URL which works better for video streaming
//     return `https://drive.google.com/file/d/${fileId}/preview`;
//   };

//   useEffect(() => {
//     if (!driveLink) {
//       setError("No Google Drive link provided");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const fileId = extractFileId(driveLink);

//     if (!fileId) {
//       setError("Invalid Google Drive link format");
//       setLoading(false);
//       return;
//     }

//     const streamUrl = getStreamingUrl(fileId);
//     setVideoUrl(streamUrl);
//     setLoading(false);
//   }, [driveLink]);

//   const handleVideoError = () => {
//     setError(
//       "Failed to load video. Make sure the file is public and is a valid video format."
//     );
//   };

//   const handleVideoLoad = () => {
//     setError("");
//   };

//   if (loading) {
//     return (
//       <div
//         className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
//         style={{ width, height }}
//       >
//         <div className="flex items-center space-x-3">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
//           <p className="text-gray-600">Loading video...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className="flex items-center justify-center bg-red-50 border border-red-300 rounded-lg text-red-600 p-5 text-center"
//         style={{ width, height }}
//       >
//         <div>
//           <p className="font-semibold mb-2">Error: {error}</p>
//           <small className="text-sm text-red-500">
//             Make sure your Google Drive file is:
//             <br />• Set to "Anyone with the link can view"
//             <br />• A valid video format (MP4, WebM, etc.)
//           </small>
//         </div>
//       </div>
//     );
//   }

//   // Only render iframe if we have a valid videoUrl
//   if (!videoUrl) {
//     return (
//       <div
//         className="flex items-center justify-center bg-gray-100 border border-gray-300 rounded-lg"
//         style={{ width, height }}
//       >
//         <p className="text-gray-600">Initializing video player...</p>
//       </div>
//     );
//   }

//   return (
//     <div style={{ width, height }} className="relative">
//       <iframe
//         src={videoUrl}
//         width="100%"
//         height="100%"
//         frameBorder="0"
//         allowFullScreen
//         className="rounded-lg shadow-lg"
//         title="Google Drive Video Player"
//         onError={handleVideoError}
//         onLoad={handleVideoLoad}
//       />
//     </div>
//   );
// };

// const VideoPlayerUI = () => {
//   const [showPlayer, setShowPlayer] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);

//   const driveLink =
//     "https://drive.google.com/file/d/1NTEj5zp5eP11kH7oicZsAbNi_9gIAdeP/view";

//   const handleWatchClick = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setShowPlayer(true);
//       setIsAnimating(false);
//     }, 300);
//   };

//   const handleClosePlayer = () => {
//     setIsAnimating(true);
//     setTimeout(() => {
//       setShowPlayer(false);
//       setIsAnimating(false);
//     }, 300);
//   };

//   const handleDownloadClick = () => {
//     // Placeholder for download logic
//     alert("Download functionality will be implemented next!");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       {!showPlayer ? (
//         // Main UI with buttons
//         <div
//           className={`text-center transition-all duration-500 transform ${
//             isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
//           }`}
//         >
//           <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl max-w-md mx-auto">
//             {/* Video thumbnail/preview area */}
//             <div className="mb-8">
//               <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
//                 <Play className="w-12 h-12 text-white" />
//               </div>
//               <h1 className="text-3xl font-bold text-white mb-3">
//                 Video Player
//               </h1>
//               <p className="text-gray-300 text-lg">
//                 Choose an action to continue
//               </p>
//             </div>

//             {/* Action buttons */}
//             <div className="space-y-4">
//               <button
//                 onClick={handleWatchClick}
//                 disabled={isAnimating}
//                 className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Play className="w-5 h-5" />
//                 <span className="text-lg">Watch Now</span>
//               </button>

//               <button
//                 onClick={handleDownloadClick}
//                 className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3"
//               >
//                 <Download className="w-5 h-5" />
//                 <span className="text-lg">Download</span>
//               </button>
//             </div>

//             {/* Decorative elements */}
//             <div className="mt-8 flex justify-center space-x-2">
//               <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//               <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse delay-100"></div>
//               <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse delay-200"></div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         // Video player view
//         <div
//           className={`w-full max-w-4xl transition-all duration-500 transform ${
//             isAnimating ? "scale-95 opacity-0" : "scale-100 opacity-100"
//           }`}
//         >
//           <div className="bg-black/20 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
//             {/* Header with close button */}
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-2xl font-bold text-white">Now Playing</h2>
//               <button
//                 onClick={handleClosePlayer}
//                 className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2 rounded-lg transition-all duration-200 border border-red-500/30"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Video player */}
//             <div className="rounded-xl overflow-hidden shadow-2xl">
//               <GoogleDriveVideoPlayer
//                 driveLink={driveLink}
//                 width="100%"
//                 height="500px"
//               />
//             </div>

//             {/* Control buttons below player */}
//             <div className="mt-6 flex justify-center space-x-4">
//               <button
//                 onClick={handleDownloadClick}
//                 className="bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 px-6 py-3 rounded-lg transition-all duration-200 border border-green-500/30 flex items-center space-x-2"
//               >
//                 <Download className="w-4 h-4" />
//                 <span>Download Video</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default VideoPlayerUI;
