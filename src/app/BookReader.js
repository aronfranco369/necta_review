"use client";
import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Menu,
  X,
  Home,
  ArrowUp,
  FileText,
} from "lucide-react";
import { getExercisesForPage, ExercisesDisplay } from "./exerciseParser";

export default function CivicsTextbookReader() {
  const [bookData, setBookData] = useState(null);
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // UPDATED: Default path to match your structure
  const [contentPath, setContentPath] = useState("books/civics/form one");
  const [currentPage, setCurrentPage] = useState(0);
  const [viewMode, setViewMode] = useState("loader");
  const [scrolling, setScrolling] = useState(false);

  const loadBookData = async () => {
    if (!contentPath.trim()) {
      setError("Please enter a valid content path");
      return;
    }
    setLoading(true);
    setError(null);
    const bookJsonPath = `/${contentPath}/book.json`;
    try {
      const response = await fetch(bookJsonPath);
      if (!response.ok) {
        throw new Error(
          `Failed to load book.json: ${response.status} ${response.statusText}`
        );
      }
      const data = await response.json();
      setBookData(data);
      setCurrentPage(0);
    } catch (error) {
      console.error("Failed to load book data:", error);
      setError(error.message || "Failed to load book data");
      setBookData(null);
    } finally {
      setLoading(false);
    }
  };

  const loadExerciseData = async () => {
    if (!contentPath.trim()) return;
    const exerciseJsonPath = `/${contentPath}/exercises.json`;
    try {
      const response = await fetch(exerciseJsonPath);
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`No exercise file found at: ${exerciseJsonPath}`);
          setExerciseData(null);
        } else {
          throw new Error(
            `Failed to load exercises.json: ${response.status} ${response.statusText}`
          );
        }
        return;
      }
      const data = await response.json();
      setExerciseData(data);
    } catch (error) {
      console.error("Failed to load exercise data:", error);
      setExerciseData(null);
    }
  };

  const loadContent = async () => {
    setLoading(true);
    // Use a temporary variable to ensure the correct path is used for all fetches
    const currentPath = contentPath;
    const bookPromise = loadBookData(currentPath);
    const exercisePromise = loadExerciseData(currentPath);
    await Promise.all([bookPromise, exercisePromise]);

    // Check bookData from state after fetch completes
    if (bookData) {
      setViewMode("reader");
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      loadContent();
    }
  };

  const getAllPages = () => {
    if (!bookData?.chapters) return [];
    return bookData.chapters.flatMap((chapter) => chapter.pages);
  };

  const allPages = getAllPages();
  const totalPages = allPages.length;

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      scrollToTop();
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      scrollToTop();
    }
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
    setViewMode("reader");
    scrollToTop();
  };

  const scrollToTop = () => {
    setScrolling(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setScrolling(false), 500);
  };

  const formatContent = (content) => {
    if (!content) return [];

    const blockRegex = /(\[FIGURE.*?\]|\[TABLE.*?\])/g;
    const figureRegex = /\[FIGURE\s+([\d.]+):\s*(.*?)\]/;

    const paragraphs = content.split("\n").filter((p) => p.trim());

    const elements = [];
    paragraphs.forEach((paragraph, pIndex) => {
      const parts = paragraph.split(blockRegex);

      parts.forEach((part, partIndex) => {
        if (!part.trim()) return;

        const figureMatch = part.match(figureRegex);

        if (figureMatch) {
          const figureNumber = figureMatch[1];
          const caption = figureMatch[2];
          // --- THIS IS THE FIX: Removed "/images" from the path ---
          const imageSrc = `/${contentPath}/${figureNumber}.webp`;

          elements.push(
            <figure
              key={`figure-${pIndex}-${partIndex}`}
              className="my-6 p-4 border rounded-lg shadow-sm bg-gray-50 text-center"
            >
              <img
                src={imageSrc}
                alt={caption || `Figure ${figureNumber}`}
                className="max-w-full h-auto mx-auto rounded-md mb-3"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const errorText = e.currentTarget.nextSibling;
                  if (errorText)
                    errorText.innerHTML +=
                      '<br/><span class="text-red-500 text-xs">(Image not found at ' +
                      imageSrc +
                      ")</span>";
                }}
              />
              <figcaption className="text-sm italic text-gray-600">
                <strong>Figure {figureNumber}:</strong> {caption}
              </figcaption>
            </figure>
          );
        } else if (part.startsWith("[TABLE")) {
          elements.push(
            <div
              key={`table-${pIndex}-${partIndex}`}
              className="my-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-lg italic text-gray-700 shadow-sm"
            >
              {part}
            </div>
          );
        } else {
          let formattedText = part
            .replace(
              /\*\*(.*?)\*\*/g,
              '<strong class="font-semibold text-gray-900">$1</strong>'
            )
            .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');

          elements.push(
            <p
              key={`text-${pIndex}-${partIndex}`}
              className="mb-4 text-justify leading-relaxed text-gray-800"
              dangerouslySetInnerHTML={{ __html: formattedText }}
            />
          );
        }
      });
    });

    return elements;
  };

  const getCurrentChapter = () => {
    if (!bookData?.chapters || !allPages[currentPage]) return null;
    const currentPageData = allPages[currentPage];
    return bookData.chapters.find((chapter) =>
      chapter.pages.some(
        (page) => page.page_number === currentPageData.page_number
      )
    );
  };

  const currentChapter = getCurrentChapter();
  const currentPageData = allPages[currentPage];

  const currentExercises =
    exerciseData && currentPageData
      ? getExercisesForPage(exerciseData, currentPageData.page_number)
      : [];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (viewMode !== "reader") return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevPage();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, viewMode, totalPages]);

  if (viewMode === "loader" || !bookData) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-4">
        <div className="mx-auto max-w-3xl pt-12">
          <div className="text-center mb-8">
            <BookOpen className="mx-auto h-20 w-20 text-amber-600 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Digital Textbook Reader
            </h1>
            <p className="text-lg text-gray-600">
              Enter the path to your textbook content to begin.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            <div className="mb-6">
              <label
                htmlFor="content-path"
                className="block text-lg font-semibold text-gray-700 mb-3"
              >
                📚 Textbook Content Path:
              </label>
              <div className="flex gap-3">
                <input
                  id="content-path"
                  type="text"
                  value={contentPath}
                  onChange={(e) => setContentPath(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="e.g., books/civics/form one"
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-3 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">
                    <strong>Error:</strong> {error}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={loadContent}
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-lg rounded-lg hover:from-amber-700 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {loading ? "Loading Content..." : "📖 Start Reading"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (viewMode === "toc") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="bg-white shadow-lg border-b border-gray-200">
          <div className="mx-auto max-w-5xl px-6 py-5 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              Table of Contents
            </h1>
            <button
              onClick={() => setViewMode("reader")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <X className="h-4 w-4" />
              Close
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-5xl p-6">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
              {bookData.subject} - Form {bookData.level}
            </h2>

            <div className="space-y-6">
              {bookData.chapters.map((chapter, chapterIndex) => (
                <div
                  key={`chapter-${chapter.chapter_number}`}
                  className="border-b border-gray-100 pb-6"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 text-blue-800">
                    Chapter {chapter.chapter_number}: {chapter.chapter_title}
                  </h3>
                  <div className="ml-6 space-y-2">
                    {chapter.pages.map((page, pageIndex) => {
                      const globalPageIndex =
                        bookData.chapters
                          .slice(0, chapterIndex)
                          .reduce((sum, ch) => sum + ch.pages.length, 0) +
                        pageIndex;

                      return (
                        <button
                          key={`page-${chapter.chapter_number}-${page.page_number}-${pageIndex}`}
                          onClick={() => goToPage(globalPageIndex)}
                          className="block w-full text-left px-4 py-3 rounded-lg hover:bg-blue-50 transition-colors border border-gray-100"
                        >
                          <span className="text-sm font-medium text-blue-600 mr-3">
                            Page {page.page_number}
                          </span>
                          <span className="text-gray-800">{page.subtopic}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-20">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode("loader")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home className="h-5 w-5" />
              Home
            </button>
            <button
              onClick={() => setViewMode("toc")}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="h-5 w-5" />
              Contents
            </button>
          </div>

          <div className="text-center">
            <h1 className="text-xl font-bold text-gray-900">
              {bookData.subject} - Form {bookData.level}
            </h1>
            <p className="text-sm text-gray-600">
              Page {currentPageData?.page_number} of{" "}
              {allPages[allPages.length - 1]?.page_number}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 0}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="px-3 py-1 text-sm bg-amber-100 text-amber-800 rounded-full font-medium">
              {currentPage + 1} / {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages - 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl p-6">
        <div className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-8 md:p-12 min-h-[70vh]">
            {currentChapter && (
              <div className="mb-8 border-b border-gray-100 pb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Chapter {currentChapter.chapter_number}:{" "}
                  {currentChapter.chapter_title}
                </h2>
                <h3 className="text-xl text-amber-600 font-semibold">
                  {currentPageData?.subtopic}
                </h3>
              </div>
            )}

            {currentPageData?.content && (
              <div className="prose prose-lg max-w-none mb-8">
                {formatContent(currentPageData.content)}
              </div>
            )}

            <ExercisesDisplay exercises={currentExercises} />
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 px-8 py-6">
            <div className="flex items-center justify-between">
              <button
                onClick={goToPrevPage}
                disabled={currentPage === 0}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 rounded-lg transition-colors font-medium"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Page
              </button>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Use arrow keys or spacebar to navigate</span>
                {scrolling && (
                  <div className="flex items-center gap-1">
                    <ArrowUp className="h-4 w-4 animate-bounce" />
                    Scrolling to top
                  </div>
                )}
              </div>

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages - 1}
                className="flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-lg transition-colors font-medium"
              >
                Next Page
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 bg-amber-600 hover:bg-amber-700 text-white rounded-full shadow-lg transition-colors z-10"
      >
        <ArrowUp className="h-5 w-5" />
      </button>
    </main>
  );
}
