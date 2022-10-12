import NavBar from "../components/NavBar";
import MatchTimer from "../components/MatchTimer";
import io from "socket.io-client";
import configs from "../utils/configs";
import { useSelector } from "react-redux";
import { userSelector } from "../stores/user";

const config = configs[process.env.NODE_ENV];

function MatchingPage() {
  console.log("MatchPage");
  const { userId } = useSelector(userSelector);
  const socket = io.connect(config.MATCH_SVC_BASE_URL, {
    path: "/matching-api",
    query: `userId=${userId}`,
  });
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
