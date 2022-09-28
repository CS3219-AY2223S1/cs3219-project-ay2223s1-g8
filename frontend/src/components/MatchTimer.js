import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import "./MatchTimer.css";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

function MatchTimer(props) {
  const socket = props.sock;
  const [count, setCount] = useState(10);
  const [start, setStart] = useState(false);
  const [intervalId, setIntervalId] = useState();
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState("any");
  const [show, setShow] = useState(false);

  const showPopUp = () => {
    setShow(true);
  };
  const closePopUp = () => {
    setShow(false);
  };

  socket.on("match found", (data) => {
    // matching-service need to change the event name that they are sending
    console.log(data);
    setStatus(true);
  });

  socket.on("waiting match", (data) => {
    console.log(data);
  });

  socket.on("match cancelled", (data) => {
    console.log(data);
  });

  useEffect(() => {
    if (status) {
      navigate("/room-1");
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
      userId: "tester1",
      difficulty: filters,
    }); // matching service need to change the event name and request body if needed
    console.log("Start timer");
    setStart(true);
  };

  const stopMatch = () => {
    showPopUp();
  };

  const cancelTimer = () => {
    clearInterval(intervalId);
    setCount(10);
    setStart(false);
    socket.emit("cancel match", { userId: "tester1" });
    closePopUp();
  };

  const filterOptionClick = (level) => {
    setFilters(level);
    console.log(level);
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
      <h1>Difficulty Level: {filters}</h1>
      <div className="filter-box">
        <Button className="filter-option-easy" onClick={() => filterOptionClick("easy")}>
          Easy
        </Button>
        <Button className="filter-option-medium" onClick={() => filterOptionClick("medium")}>
          Medium
        </Button>
        <Button className="filter-option-hard" onClick={() => filterOptionClick("hard")}>
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
