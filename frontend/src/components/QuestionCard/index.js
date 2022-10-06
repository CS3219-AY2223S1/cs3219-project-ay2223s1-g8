import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRandomQuestion } from "../../middleware/questionSvc";
import { matchSelector } from "../../stores/match/match.slice";
import "./styles.scss";

function QuestionCard() {
  const [question, setQuestion] = useState(null);
  const { matchId, difficulty } = useSelector(matchSelector);

  useEffect(() => {
    getRandomQuestion({ matchId, difficulty }).then((data) => {
      setQuestion(data);
    });
  }, []);

  if (!question) return null;

  return (
    <div className="card Qn-card-container">
      <div className="card-body Qn-card-body-container">
        <h5 className="card-title text-center">{question.title}</h5>
        <p className="card-text">{question.content}</p>
      </div>
    </div>
  );
}

export default QuestionCard;
