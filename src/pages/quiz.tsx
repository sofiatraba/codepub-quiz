import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {BASE_URL} from "../constants";
import {Option, Question} from "../components";

export const Quiz = () => {
  const {id} = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [correctOptionId, setCorrectOptionId] = useState("");

  useEffect(() => {
    const getQuiz = async () => {
      const response = await fetch(`${BASE_URL}/quiz/${id}`).then((response) =>
          response.json()
      );
      console.log(response)
      console.log(response.Item.questions)
      setQuestions(response.Item.questions);
    };
    getQuiz();

  }, []);
  const onSelectOption = async (questionId: string, optionId: string) => {
    setSelectedOptionId(optionId);
    const response = await fetch(
        `${BASE_URL}/quiz/${id}/question/${questionId}`
    ).then((response) => response.json());
    console.log(response.Items[0].questions[0].correctOption)
    setCorrectOptionId(response.Items[0].questions[0].correctOption);
  };

  const selectedQuestion = questions[selectedQuestionIndex];

  if (!selectedQuestion) {
    return <></>;
  }

  const next = () => {
    if (selectedQuestionIndex < questions.length - 1) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
      setSelectedOptionId("");
      setCorrectOptionId("");
    }
  };

  return (
      <div className="p-4 w-full md:w-96 m-auto">
        <Question
            key={selectedQuestion.id}
            id={selectedQuestion.id}
            label={selectedQuestion.label}
            selectedOption={selectedOptionId}
            onSelectOption={onSelectOption}
            correctOption={correctOptionId}
        >
          {selectedQuestion.options.map((option) => {
            return (
                <Option key={option.id} id={option.id}>
                  {option.label}
                </Option>
            );
          })}
        </Question>
        {selectedQuestionIndex < questions.length - 1 && (
            <button onClick={next} disabled={!selectedOptionId}>
              Next
            </button>
        )}
      </div>
  );


};
