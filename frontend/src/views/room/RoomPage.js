import { useRef, useEffect } from "react";
const io = require("socket.io-client");

function RoomPage() {
  var socket = io("http://localhost:9000", {
    query: { roomId: "room-1" },
  });
  // const l = console.log;
  const ref = useRef(null);

  useEffect(() => {
    const editor = ref.current;
    editor.addEventListener("keyup", () => {
      const text = editor.value;
      socket.emit("to server", { message: text, roomId: "room-1" });
    });
    socket.on("to client", (data) => {
      editor.value = data["message"];
    });
  });

  return <textarea rows="30" cols="50" ref={ref} placeholder="Type Your Text..."></textarea>;
}

export default RoomPage;
