import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "./MatchTimer.css";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../stores/user";
import { addMatchId, setDifficulty, clearState } from "../stores/match/match.slice";
import { QUESTION_DIFFICULTY } from "../utils/constants";
import PropTypes from "prop-types";

function MatchTimer(props) {
  const socket = props.sock;
  const [count, setCount] = useState(10);
  const [start, setStart] = useState(false);
  const [intervalId, setIntervalId] = useState();
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const [level, setLevel] = useState(QUESTION_DIFFICULTY.EASY);
  const [show, setShow] = useState(false);
  const dispatch = useDispatch();
  const { userId } = useSelector(userSelector);

  const showPopUp = () => {
    setShow(true);
  };
  const closePopUp = () => {
    setShow(false);
  };

  socket.on("match found", (data) => {
    // matching-service need to change the event name that they are sending
    dispatch(addMatchId(data["roomId"]));
    setStatus(true);
  });

  socket.on("waiting match", (data) => {
    console.log("waiting match", data);
  });

  socket.on("match cancelled", (data) => {
    console.log("match cancelled", data);
  });

  useEffect(() => {
    if (status) {
      navigate("/collab2");
    }
    if (start) {
      if (count >= 0) {
        const timer = setInterval(() => setCount(count - 1), 1000);
        setIntervalId(timer);
      } else {
        cancelTimer();
      }
    }
    return () => clearInterval(intervalId);
  }, [start, count]);

  const startTimer = () => {
    socket.emit("find match", {
      message: "finding a match",
      userId: userId,
      difficulty: level,
    }); // matching service need to change the event name and request body if needed
    dispatch(clearState());
    dispatch(setDifficulty(level));
    setStart(true);
  };

  const stopMatch = () => {
    showPopUp();
  };

  const cancelTimer = () => {
    clearInterval(intervalId);
    setCount(10);
    setStart(false);
    socket.emit("cancel match", { userId });
    closePopUp();
  };

  const handleLevel = (level) => {
    setLevel(level);
  };

  return (
    <div className="page">
      <Modal show={show} onHide={closePopUp} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Match Search</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel the match search?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closePopUp}>
            Cancel
          </Button>
          <Button vairant="primary" onClick={cancelTimer}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <h1>Difficulty Level: {level}</h1>
      <div className="filter-box">
        <Button
          className="filter-option-easy"
          onClick={() => handleLevel(QUESTION_DIFFICULTY.EASY)}
        >
          Easy
        </Button>
        <Button
          className="filter-option-medium"
          onClick={() => handleLevel(QUESTION_DIFFICULTY.MEDIUM)}
        >
          Medium
        </Button>
        <Button
          className="filter-option-hard"
          onClick={() => handleLevel(QUESTION_DIFFICULTY.HARD)}
        >
          Hard
        </Button>
      </div>
      <div className="timer">
        <div className="timer-header">Time left in queue:</div>
        <div className="timer-display">{count}</div>
      </div>
      <div className="button-box">
        <Button className="start-button" id="start" onClick={startTimer}>
          Find Match
        </Button>
        <Button className="cancel-button" id="cancel" onClick={stopMatch}>
          Cancel Match
        </Button>
      </div>
    </div>
  );
}

MatchTimer.propTypes = {
  sock: PropTypes.object,
};

export default MatchTimer;
