import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DifficultyPill from "../DifficultyPill";
import { getRandomQuestion } from "../../middleware/questionSvc";
import { matchSelector, setQid } from "../../stores/match/match.slice";

import PropTypes from "prop-types";
import "./styles.scss";

function QuestionCard({ containerId }) {
  const dispatch = useDispatch();
  const [retry, setRetry] = useState(false);
  const [question, setQuestion] = useState(null);
  const { matchId, difficulty } = useSelector(matchSelector);

  useEffect(() => {
    getRandomQuestion({ matchId, difficulty })
      .then((data) => {
        setQuestion(data);
        dispatch(setQid(data.qid));
      })
      .catch(() => setRetry(!retry));
  }, []);

  useEffect(() => {
    getRandomQuestion({ matchId, difficulty })
      .then((data) => {
        setQuestion(data);
        dispatch(setQid(data.qid));
      })
      .catch(() => setRetry(!retry));
  }, [retry]);

  if (!question) return null;

  return (
    <div className="overflow-auto Qn-card-container px-3 py-4" id={containerId}>
      <div className="Qn-card-body-container text-light">
        <div className="d-flex flex-row justify-content-between align-items-center mb-2">
          <h4 className="text-center m-0">{question.title}</h4>
          <DifficultyPill variant={question.difficulty} />
        </div>
        <p className="card-text">{question.content}</p>
      </div>
    </div>
  );
}

QuestionCard.propTypes = {
  containerId: PropTypes.string,
};

export default QuestionCard;
