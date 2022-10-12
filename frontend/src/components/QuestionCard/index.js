import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRandomQuestion } from "../../middleware/questionSvc";
import { matchSelector } from "../../stores/match/match.slice";

import PropTypes from "prop-types";
import "./styles.scss";

function QuestionCard({ containerId }) {
  const [question, setQuestion] = useState(null);
  const { matchId, difficulty } = useSelector(matchSelector);

  useEffect(() => {
    getRandomQuestion({ matchId, difficulty }).then((data) => {
      setQuestion(data);
    });
  }, []);

  if (!question) return null;

  return (
    <div className="card overflow-auto Qn-card-container" id={containerId}>
      <div className="card-body Qn-card-body-container">
        <h5 className="card-title text-center">{question.title}</h5>
        <p className="card-text">{question.content}</p>
      </div>
    </div>
  );
}

QuestionCard.propTypes = {
  containerId: PropTypes.string,
};

export default QuestionCard;
