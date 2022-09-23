import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./MatchTimer.css";
const socket = io.connect("http://localhost:5000");

function MatchTimer() {
  const [count, setCount] = useState(10);
  const [start, setStart] = useState(false);
  const [intervalId, setIntervalId] = useState();
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  const [filters, setFilters] = useState("any");

  socket.on("match found", (data) => {
    // matching-service need to change the event name that they are sending
    console.log(data);
    setStatus(true);
  });

  useEffect(() => {
    if (status) {
      navigate("/room-1");
    }
    if (start) {
      const timer = setInterval(() => setCount(count - 1), 1000);
      setIntervalId(timer);
    }
    return () => clearInterval(intervalId);
  }, [start, count]);

  const startTimer = () => {
    socket.emit("start match", {
      message: "finding a match",
      userId: "tester1",
      difficulty: filters,
    }); // matching service need to change the event name and request body if needed
    console.log("Start timer");
    setStart(true);
  };

  const cancelTimer = () => {
    clearInterval(intervalId);
    setCount(10);
    setStart(false);
  };

  const filterOptionClick = (level) => {
    setFilters(level);
    console.log(level);
  };

  return (
    <div className="page">
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
        <Button className="cancel-button" id="cancel" onClick={cancelTimer}>
          Cancel Match
        </Button>
      </div>
    </div>
  );
}

export default MatchTimer;
