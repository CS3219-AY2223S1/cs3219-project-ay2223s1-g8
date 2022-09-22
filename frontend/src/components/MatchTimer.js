import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
const socket = io.connect("http://localhost:5000");

function MatchTimer() {
  const [count, setCount] = useState(10);
  const [start, setStart] = useState(false);
  const [intervalId, setIntervalId] = useState();
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();

  socket.on("match found", (data) => { // matching-service need to change the event name that they are sending
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
    socket.emit("start match", { message: "finding a match", userId: "tester1" }); // matching service need to change the event name and request body if needed
    console.log("Start timer");
    setStart(true);
  };

  const cancelTimer = () => {
    clearInterval(intervalId);
    setCount(10);
    setStart(false);
  };

  return (
    <>
      <div className="timer-display">{count}</div>
      <div>
        <Button id="start" onClick={startTimer}>
          Find Match
        </Button>
        <Button id="cancel" onClick={cancelTimer}>
          Cancel
        </Button>
      </div>
    </>
  );
}

export default MatchTimer;
