import { useRef, useEffect } from "react";
const io = require("socket.io-client");
import { useSelector } from "react-redux";
import { matchSelector } from "../../stores/match/match.slice";

function RoomPage() {
  const { matchId } = useSelector(matchSelector);
  console.log(matchId);
  var socket = io("http://localhost:9000", {
    query: { roomId: matchId },
  });
  // const l = console.log;
  const ref = useRef(null);

  useEffect(() => {
    const editor = ref.current;
    editor.addEventListener("keyup", () => {
      const text = editor.value;
      socket.emit("client to server", { message: text, roomId: matchId });
    });
    socket.on("server to client", (data) => {
      if (data["roomId"] === matchId) {
        editor.value = data["message"];
      }
    });
  });

  return <textarea rows="30" cols="50" ref={ref} placeholder="Type Your Text..."></textarea>;
}

export default RoomPage;
