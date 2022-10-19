import NavBar from "../components/NavBar";
import MatchTimer from "../components/MatchTimer";
import io from "socket.io-client";
import configs from "../utils/configs";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../stores/user";
import { clearState, setSocket } from "../stores/socket/socket.slice";

const config = configs[process.env.NODE_ENV];

function MatchingPage() {
  const dispatch = useDispatch();
  dispatch(clearState());
  const socket = io.connect(config.MATCH_SVC_BASE_URL, {
    path: "/matching-api",
  });
  socket.on("connect_error", (data) => {
    console.log("Matching socket connection error:", data);
    socket.disconnect();
  });
  // console.log(socket);
  const { userId } = useSelector(userSelector);
  dispatch(setSocket({ userId: userId, socket: socket }));

  return (
    <>
      <NavBar />
      <MatchTimer sock={socket} />
    </>
  );
}

export default MatchingPage;
