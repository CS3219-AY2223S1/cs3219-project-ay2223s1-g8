import NavBar from "../components/NavBar";
import MatchTimer from "../components/MatchTimer";
import io from "socket.io-client";
import configs from "../utils/configs";

const config = configs[process.env.NODE_ENV];

function MatchingPage() {
  const socket = io.connect(config.MATCH_SVC_BASE_URL, {
    path: "/matching-api",
  });
  socket.on("connect_error", (data) => {
    console.log("Matching socket connection error:", data);
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
