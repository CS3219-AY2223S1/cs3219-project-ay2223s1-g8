import NavBar from "../components/NavBar";
import MatchTimer from "../components/MatchTimer";
import io from "socket.io-client";

function MatchingPage() {
  console.log("MatchPage");
  const socket = io.connect("http://localhost:8001");
  socket.on("connect_error", (data) => {
    console.log(data);
    socket.disconnect();
  });

  return (
    <>
      <NavBar />
      <MatchTimer sock={socket} />
    </>
  );
}

export default MatchingPage;
