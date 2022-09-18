import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import React, { useEffect } from "react";
import Timer from "./Timer";

function MatchingPage() {
  // const [counter, setCounter] = React.useState(30);
  // useEffect(() => {
  //     counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  //   }, [counter]);
  // return(
  //     <div className="App">
  //         <div>Countdown: {counter}</div>
  //     </div>
  // )
  return <Timer />;
}

export default MatchingPage;
