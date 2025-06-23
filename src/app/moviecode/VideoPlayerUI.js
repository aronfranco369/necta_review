// "use client";

// import { useState } from "react";
// import { Play, Download } from "lucide-react";
// import VideoWatcher from "./VideoWatcher";
// import { downloadGoogleDriveFile } from "./DownloadManager";

// const VideoPlayerUI = ({ driveLink }) => {
//   const [showPlayer, setShowPlayer] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [isDownloading, setIsDownloading] = useState(false);

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

//   const handleDownloadClick = async () => {
//     if (!driveLink) {
//       alert("No video link provided");
//       return;
//     }

//     setIsDownloading(true);
//     try {
//       await downloadGoogleDriveFile(driveLink);
//     } catch (error) {
//       console.error("Download failed:", error);
//       alert(
//         "Download failed. Please try again or check if the file is publicly accessible."
//       );
//     } finally {
//       setIsDownloading(false);
//     }
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
//                 disabled={isDownloading}
//                 className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 <Download className="w-5 h-5" />
//                 <span className="text-lg">
//                   {isDownloading ? "Downloading..." : "Download"}
//                 </span>
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
//         <VideoWatcher
//           driveLink={driveLink}
//           onClose={handleClosePlayer}
//           onDownload={handleDownloadClick}
//           isAnimating={isAnimating}
//           isDownloading={isDownloading}
//         />
//       )}
//     </div>
//   );
// };

// export default VideoPlayerUI;
