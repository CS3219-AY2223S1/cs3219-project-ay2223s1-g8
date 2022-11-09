import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Modal from "react-bootstrap/Modal";
import CircularProgressBar from "./CircularProgressBar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../stores/user";
import { addMatchId, setDifficulty, clearState } from "../stores/match/match.slice";
import { QUESTION_DIFFICULTY } from "../utils/constants";
import PropTypes from "prop-types";
import "./MatchTimer.scss";
import NavBar from "./NavBar";

function MatchTimer(props) {
  const socket = props.sock;
  const [count, setCount] = useState(30);
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
      navigate("/collab");
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
    setCount(30);
    setStart(false);
    socket.emit("cancel match", { userId });
    closePopUp();
  };

  const handleLevel = (level) => {
    setLevel(level);
  };

  return (
    <>
      <NavBar isMatching={start} />
      <div className="h-content w-100 bg-whitesmoke py-5 d-flex flex-column align-items-center justify-content-evenly">
        <Modal show={show} onHide={closePopUp} centered backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Match Search</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to cancel the match search?</Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={closePopUp}>
              Cancel
            </Button>
            <Button variant="danger" onClick={cancelTimer}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="d-flex flex-row align-items-center p-2">
          <h3 className="m-0">Select Difficulty Level:</h3>

          <ButtonGroup size="lg" className="ms-3">
            <Button
              variant={level === QUESTION_DIFFICULTY.EASY ? "primary" : "outline-primary"}
              onClick={() => handleLevel(QUESTION_DIFFICULTY.EASY)}
              disabled={start}
            >
              Easy
            </Button>
            <Button
              variant={level === QUESTION_DIFFICULTY.MEDIUM ? "primary" : "outline-primary"}
              onClick={() => handleLevel(QUESTION_DIFFICULTY.MEDIUM)}
              disabled={start}
            >
              Medium
            </Button>
            <Button
              variant={level === QUESTION_DIFFICULTY.HARD ? "primary" : "outline-primary"}
              onClick={() => handleLevel(QUESTION_DIFFICULTY.HARD)}
              disabled={start}
            >
              Hard
            </Button>
          </ButtonGroup>
        </div>

        <CircularProgressBar count={count} start={start} />

        <div className="button-box d-grid gap-2 m-2">
          {!start ? (
            <Button className="start-button" size="lg" id="start" onClick={startTimer}>
              Find Match
            </Button>
          ) : (
            <Button className="cancel-button" size="lg" id="cancel" onClick={stopMatch}>
              Cancel Match
            </Button>
          )}
        </div>
      </div>
    </>
  );
}

MatchTimer.propTypes = {
  sock: PropTypes.object,
};

export default MatchTimer;
