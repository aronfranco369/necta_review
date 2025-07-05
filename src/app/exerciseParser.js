// exerciseParser.js
import { FileText } from "lucide-react";

/**
 * Get exercises for a specific page number
 * @param {Object} exerciseData - The loaded exercise data
 * @param {number} pageNumber - The page number to get exercises for
 * @returns {Array} Array of exercises for the page
 */
export const getExercisesForPage = (exerciseData, pageNumber) => {
  if (!exerciseData?.topics || !pageNumber) return [];

  const exercises = [];

  exerciseData.topics.forEach((topic) => {
    topic.sections.forEach((section) => {
      if (section.page_number === pageNumber) {
        exercises.push({ ...section, topic_name: topic.topic_name });
      }
    });
  });

  return exercises;
};

/**
 * Format text with line breaks
 * @param {string} text - Text to format
 * @returns {JSX.Element} Formatted text with line breaks
 */
const formatTextWithLineBreaks = (text) => {
  return text.split("\n").map((line, index, array) => (
    <span key={index}>
      {line}
      {index < array.length - 1 && <br />}
    </span>
  ));
};

/**
 * Render exercise questions with proper formatting
 * @param {Object} questions - The questions object
 * @returns {Array} Array of React elements
 */
export const renderExerciseQuestions = (questions) => {
  return Object.entries(questions).map(([key, value]) => {
    if (typeof value === "string") {
      return (
        <div key={key} className="mb-4">
          <span className="font-medium text-gray-700 mr-2">{key}.</span>
          <span className="text-gray-800">
            {formatTextWithLineBreaks(value)}
          </span>
        </div>
      );
    } else if (value.instruction && value.column_a && value.column_b) {
      // Matching question
      return (
        <div key={key} className="mb-6">
          <div className="font-medium text-gray-700 mb-3">
            {key}. {formatTextWithLineBreaks(value.instruction)}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Column A</h5>
              {value.column_a.map((item, idx) => (
                <div key={idx} className="mb-2 text-gray-700">
                  {idx + 1}. {formatTextWithLineBreaks(item)}
                </div>
              ))}
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">Column B</h5>
              {value.column_b.map((item, idx) => (
                <div key={idx} className="mb-2 text-gray-700">
                  {String.fromCharCode(65 + idx)}.{" "}
                  {formatTextWithLineBreaks(item)}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
    return null;
  });
};

/**
 * Render exercises component
 * @param {Array} exercises - Array of exercises to render
 * @returns {JSX.Element} The exercises component
 */
export const ExercisesDisplay = ({ exercises }) => {
  if (!exercises || exercises.length === 0) return null;

  return (
    <div className="mt-8 space-y-6">
      {exercises.map((exercise, idx) => (
        <div
          key={`exercise-${exercise.page_number}-${idx}`}
          className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-yellow-600" />
            <h4 className="text-lg font-semibold text-yellow-800">
              {exercise.title}
            </h4>
            <span className="text-sm text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
              {exercise.type}
            </span>
          </div>
          <div className="text-yellow-700">
            {renderExerciseQuestions(exercise.questions)}
          </div>
        </div>
      ))}
    </div>
  );
};
