// "use client";
// import { useState } from "react";
// import { fetchExamFromSupabase } from "./SupabaseClient";
// // --- Helper Components ---

// const VisualElement = ({ element }) => {
//   if (element.element_type === "image") {
//     return (
//       <div className="my-4 border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
//         <p className="font-semibold">[Image Placeholder: {element.alt_text}]</p>
//         <p className="text-sm">URL: {element.image_url}</p>
//       </div>
//     );
//   }
//   if (element.element_type === "table") {
//     return <TableRenderer data={element.table_data} />;
//   }
//   return null;
// };

// const TableRenderer = ({ data }) => {
//   const listA = data[0];
//   const listB = data[1];
//   const listAEntries = Object.entries(listA.column_items);
//   const listBEntries = Object.entries(listB.column_items);
//   const maxItems = Math.max(listAEntries.length, listBEntries.length);

//   return (
//     <div className="my-4 overflow-hidden rounded-lg border border-gray-400">
//       <table className="w-full">
//         <thead>
//           <tr className="bg-gray-50">
//             <th className="border-r border-gray-400 px-4 py-3 text-left font-semibold text-gray-800">
//               {listA.column_name}
//             </th>
//             <th className="px-4 py-3 text-left font-semibold text-gray-800">
//               {listB.column_name}
//             </th>
//           </tr>
//         </thead>
//         <tbody>
//           {Array.from({ length: maxItems }, (_, index) => {
//             const listAItem = listAEntries[index];
//             const listBItem = listBEntries[index];
//             return (
//               <tr key={index} className="border-t border-gray-300">
//                 <td className="border-r border-gray-400 px-4 py-4 align-top">
//                   {listAItem && (
//                     <div className="flex items-start gap-2">
//                       <span>{listAItem[0]}.</span>
//                       <span>{listAItem[1]}</span>
//                     </div>
//                   )}
//                 </td>
//                 <td className="px-4 py-4 align-top">
//                   {listBItem && (
//                     <div className="flex items-center gap-2">
//                       <span>{listBItem[0]}.</span>
//                       <span>{listBItem[1]}</span>
//                     </div>
//                   )}
//                 </td>
//               </tr>
//             );
//           })}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// // NEW: A dedicated component for rendering multiple-choice options.
// // This makes the logic reusable.
// const MultipleChoiceOptions = ({ options, name }) => (
//   <div className="mt-3 flex flex-col gap-2 pl-4">
//     {Object.entries(options).map(([key, value]) => (
//       <label
//         key={key}
//         className="flex cursor-pointer items-center gap-3 rounded p-1 hover:bg-gray-50"
//       >
//         <input
//           type="radio"
//           name={name}
//           className="h-4 w-4 shrink-0 text-indigo-600 focus:ring-indigo-500"
//         />
//         <span>
//           <span>{key}.</span> {value}
//         </span>
//       </label>
//     ))}
//   </div>
// );

// // MODIFIED: The SubQuestion component is now "smart".
// // It can render simple text, OR it can render multiple-choice options if it finds them.
// const SubQuestion = ({ subQuestion, questionNumber }) => {
//   // A unique name for radio button groups to ensure they work correctly.
//   const radioGroupName = `${questionNumber}-${subQuestion.sub_question_identifier}`;

//   return (
//     <div className="mt-4">
//       <div className="flex items-start gap-2">
//         <span className="font-medium">
//           {subQuestion.sub_question_identifier
//             ? `(${subQuestion.sub_question_identifier})`
//             : ""}
//         </span>
//         <p className="m-0 flex-1 whitespace-pre-wrap">
//           {subQuestion.sub_question_text}
//         </p>
//       </div>

//       {subQuestion.visual_elements &&
//         subQuestion.visual_elements.map((el, i) => (
//           <VisualElement key={i} element={el} />
//         ))}

//       {/* THIS IS THE KEY CHANGE: Check if options exist and render them */}
//       {subQuestion.options && (
//         <MultipleChoiceOptions
//           options={subQuestion.options}
//           name={radioGroupName}
//         />
//       )}

//       {/* This handles deeply nested sub-questions (e.g., 1(a)(i)) */}
//       {subQuestion.sub_questions && (
//         <div className="ml-6">
//           {subQuestion.sub_questions.map((nestedSubQ, i) => (
//             <SubQuestion
//               key={i}
//               subQuestion={nestedSubQ}
//               questionNumber={questionNumber}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// // --- The Main Question Component ---

// const Question = ({ question }) => {
//   const renderQuestionBody = () => {
//     switch (question.question_type) {
//       // MODIFIED: multiple_choice, explanatory, and composite now all rely on the smart SubQuestion component.
//       case "multiple_choice":
//       case "explanatory":
//       case "composite":
//         return (
//           <div>
//             {question.sub_questions.map((subQ, i) => (
//               <SubQuestion
//                 key={i}
//                 subQuestion={subQ}
//                 questionNumber={question.question_number}
//               />
//             ))}
//           </div>
//         );

//       case "matching":
//         return <TableRenderer data={question.columns} />;

//       default: // This will catch 'normal' questions which have no body.
//         return null;
//     }
//   };

//   // The layout for composite questions is slightly different (no main question_text).
//   if (question.question_type === "composite") {
//     return (
//       <div className="mb-8">
//         <div className="flex items-start gap-3">
//           <span className="text-lg font-bold">{question.question_number}.</span>
//           <div className="flex-1">
//             {question.visual_elements &&
//               question.visual_elements.map((el, i) => (
//                 <VisualElement key={i} element={el} />
//               ))}
//             {/* The body is rendered directly inside */}
//             {renderQuestionBody()}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Layout for all other question types
//   return (
//     <div className="mb-8">
//       <div className="flex items-start gap-3">
//         <span className="text-lg font-bold">{question.question_number}.</span>
//         <p className="mt-0.5 flex-1 whitespace-pre-wrap text-base">
//           {question.question_text}
//         </p>
//       </div>
//       {question.visual_elements &&
//         question.visual_elements.map((el, i) => (
//           <VisualElement key={i} element={el} />
//         ))}
//       <div className="pl-8">{renderQuestionBody()}</div>
//     </div>
//   );
// };

// // --- The Main Page Component (No changes needed here) ---
// export default function ExamViewerPage() {
//   const [examData, setExamData] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [examPath, setExamPath] = useState("civics/2000.json");

//   const loadExamData = async () => {
//     if (!examPath.trim()) {
//       setError("Please enter a valid file path");
//       return;
//     }
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await fetchExamFromSupabase(examPath);
//       setExamData(data);
//     } catch (error) {
//       console.error("Failed to load exam data:", error);
//       setError(error.message || "Failed to load exam data");
//       setExamData(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       loadExamData();
//     }
//   };

//   return (
//     <main className="mx-auto max-w-4xl p-4 font-sans md:p-8">
//       <div className="mb-8 rounded-lg bg-gray-100 p-4">
//         <label
//           htmlFor="exam-path"
//           className="mb-2 block text-lg font-medium text-gray-700"
//         >
//           Enter Exam File Path:
//         </label>
//         <div className="flex gap-2">
//           <input
//             id="exam-path"
//             type="text"
//             value={examPath}
//             onChange={(e) => setExamPath(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="e.g., civics/2000.json or history/2001.json"
//             className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
//           />
//           <button
//             onClick={loadExamData}
//             disabled={loading}
//             className="rounded-md bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400"
//           >
//             {loading ? "Loading..." : "Load Exam"}
//           </button>
//         </div>
//         {error && (
//           <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
//             <strong>Error:</strong> {error}
//           </div>
//         )}
//       </div>

//       {loading && (
//         <div className="flex items-center justify-center py-12">
//           <div className="text-center">
//             <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-600"></div>
//             <div className="text-xl font-semibold text-gray-600">
//               Loading exam data...
//             </div>
//           </div>
//         </div>
//       )}

//       {examData && !loading && (
//         <div id="exam-content">
//           <h1 className="mb-8 border-b-2 border-gray-300 pb-4 text-center text-4xl font-bold">
//             Examination Paper - {examPath.replace(".json", "")}
//           </h1>
//           {examData.sections.map((section, index) => (
//             <section
//               key={index}
//               className="mb-12 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
//             >
//               <h2 className="mb-2 text-center text-2xl font-bold text-gray-800">
//                 {section.section_name} ({section.marks} marks)
//               </h2>
//               <p className="mb-6 text-center font-semibold italic text-gray-600">
//                 {section.instructions}
//               </p>
//               <div className="space-y-8">
//                 {section.questions.map((q) => (
//                   <Question key={q.question_number} question={q} />
//                 ))}
//               </div>
//             </section>
//           ))}
//         </div>
//       )}
//     </main>
//   );
// }
