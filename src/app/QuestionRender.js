// QuestionRenderer.js - Handles all question type rendering logic
"use client";

const VisualElement = ({ element }) => {
  if (element.element_type === "image") {
    return (
      <div className="my-4 border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center text-gray-500">
        <p className="font-semibold">[Image Placeholder: {element.alt_text}]</p>
        <p className="text-sm">URL: {element.image_url}</p>
      </div>
    );
  }
  if (element.element_type === "table") {
    return <TableRenderer data={element.table_data} />;
  }
  return null;
};

const TableRenderer = ({ data }) => {
  // Extract the two columns
  const listA = data[0];
  const listB = data[1];

  // Get the max number of items to ensure proper table structure
  const maxItems = Math.max(
    Object.keys(listA.column_items).length,
    Object.keys(listB.column_items).length
  );

  const listAEntries = Object.entries(listA.column_items);
  const listBEntries = Object.entries(listB.column_items);

  return (
    <div className="my-4 border border-gray-400 rounded-lg overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="border-r border-gray-400 px-4 py-3 text-left font-semibold text-gray-800">
              {listA.column_name}
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-800">
              {listB.column_name}
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: maxItems }, (_, index) => {
            const listAItem = listAEntries[index];
            const listBItem = listBEntries[index];

            return (
              <tr key={index} className="border-t border-gray-300">
                <td className="border-r border-gray-400 px-4 py-4 align-top">
                  {listAItem && (
                    <div className="flex items-start gap-2">
                      <span>{listAItem[0]}.</span>
                      <span>{listAItem[1]}</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-4 align-top">
                  {listBItem && (
                    <div className="flex items-center gap-2">
                      <span>{listBItem[0]}.</span>
                      <span>{listBItem[1]}</span>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const SubQuestion = ({ subQuestion }) => {
  return (
    <div className="ml-6 mt-4">
      <div className="flex items-start gap-2">
        <span className="font-medium">
          ({subQuestion.sub_question_identifier})
        </span>
        <p className="m-0 flex-1">{subQuestion.sub_question_text}</p>
      </div>
      {subQuestion.visual_elements &&
        subQuestion.visual_elements.map((el, i) => (
          <VisualElement key={i} element={el} />
        ))}
      {subQuestion.sub_questions && (
        <div className="ml-6">
          {subQuestion.sub_questions.map((nestedSubQ, i) => (
            <SubQuestion key={i} subQuestion={nestedSubQ} />
          ))}
        </div>
      )}
    </div>
  );
};

// Question type renderers - easily extensible for new subjects
const QuestionTypeRenderers = {
  multiple_choice: (question) => (
    <div>
      {question.sub_questions.map((subQ) => (
        <div key={subQ.sub_question_identifier} className="mt-4 ml-6">
          <div className="flex items-start gap-2">
            <span className="font-medium">{subQ.sub_question_identifier}.</span>
            <p className="m-0 flex-1 whitespace-pre-wrap">
              {subQ.sub_question_text}
            </p>
          </div>
          {subQ.visual_elements &&
            subQ.visual_elements.map((el, i) => (
              <VisualElement key={i} element={el} />
            ))}
          <div className="mt-2 flex flex-col gap-2 pl-4">
            {Object.entries(subQ.options).map(([key, value]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center gap-2 hover:bg-gray-50 p-1 rounded"
              >
                <input
                  type="radio"
                  name={`${question.question_number}-${subQ.sub_question_identifier}`}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span>
                  {key}. {value}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),

  matching: (question) => <TableRenderer data={question.columns} />,

  explanatory: (question) => (
    <div>
      {question.sub_questions.map((subQ, i) => (
        <SubQuestion key={i} subQuestion={subQ} />
      ))}
    </div>
  ),

  composite: (question) => (
    <div>
      {question.sub_questions.map((subQ, i) => (
        <SubQuestion key={i} subQuestion={subQ} />
      ))}
    </div>
  ),

  // Future subject-specific renderers can be added here
  // math_equation: (question) => <MathEquationRenderer question={question} />,
  // chemistry_formula: (question) => <ChemistryFormulaRenderer question={question} />,
  // physics_diagram: (question) => <PhysicsDiagramRenderer question={question} />,
};

const Question = ({ question, customRenderers = {} }) => {
  // Merge custom renderers with default ones (custom takes precedence)
  const allRenderers = { ...QuestionTypeRenderers, ...customRenderers };

  const renderQuestionBody = () => {
    const renderer = allRenderers[question.question_type];
    return renderer ? renderer(question) : null;
  };

  if (question.question_type === "composite") {
    // For composite questions, render question number inline with first sub-question
    return (
      <div className="mb-8">
        <div className="flex items-start gap-3">
          <span className="text-lg font-bold">{question.question_number}.</span>
          <div className="flex-1">
            {question.visual_elements &&
              question.visual_elements.map((el, i) => (
                <VisualElement key={i} element={el} />
              ))}
            {question.sub_questions.map((subQ, i) => (
              <div key={i} className={i === 0 ? "" : "mt-4"}>
                <SubQuestion subQuestion={subQ} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // For all other question types
  return (
    <div className="mb-8">
      <div className="flex items-start gap-3">
        <span className="text-lg font-bold">{question.question_number}.</span>
        <p className="mt-0.5 flex-1 text-base">{question.question_text}</p>
      </div>
      {question.visual_elements &&
        question.visual_elements.map((el, i) => (
          <VisualElement key={i} element={el} />
        ))}
      <div className="pl-8">{renderQuestionBody()}</div>
    </div>
  );
};

export {
  Question,
  VisualElement,
  TableRenderer,
  SubQuestion,
  QuestionTypeRenderers,
};
