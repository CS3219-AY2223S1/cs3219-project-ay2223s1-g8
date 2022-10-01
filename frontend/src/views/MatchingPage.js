import NavBar from "../components/NavBar";
import MatchTimer from "../components/MatchTimer";
import io from "socket.io-client";
import { MATCH_SVC_BASE_URL } from "../utils/configs";

function MatchingPage() {
  console.log("MatchPage");
  const socket = io.connect(MATCH_SVC_BASE_URL);
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
