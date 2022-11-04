import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useRef } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { QuillBinding } from "y-quill";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearState, matchSelector } from "../../stores/match/match.slice";
import { socketSelector } from "../../stores/socket/socket.slice";
import { userSelector } from "../../stores/user/user.slice";
import { addAttempt } from "../../middleware/historySvc";
// import configs from "../../utils/configs";

// const config = configs[process.env.NODE_ENV];

const colors = ["#eb7434", "#348ceb", "#7a34eb", "#eb3499"];

const Delta = Quill.import("delta");

Quill.register("modules/cursors", QuillCursors);
import "./styles.scss";

function getRandomColor() {
  const index = Math.floor(Math.random() * 4);
  return colors[index];
}

function CollabEditor() {
  const reff = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { matchId, isLeaving, qid } = useSelector(matchSelector);
  const { userId, username } = useSelector(userSelector);
  const { socket } = useSelector(socketSelector);

  useEffect(() => {
    const quill = new Quill(reff.current, {
      modules: {
        cursors: true,
        toolbar: false,
        // to remove text formatting when pasting in the editor
        clipboard: {
          matchers: [
            [
              Node.ELEMENT_NODE,
              (node, delta) =>
                delta.compose(
                  new Delta().retain(delta.length(), {
                    bold: false,
                    italic: false,
                    underline: false,
                  }),
                ),
            ],
          ],
        },
        history: {
          // Local undo shouldn't undo changes from remote users
          userOnly: true,
        },
      },
      formats: ["bold", "italic", "underline"],
      placeholder: "Start collaborating...",
      theme: "snow", // 'bubble' is also great
    });

    // A Yjs document holds the shared data
    const ydoc = new Y.Doc();
    // const provider = new WebsocketProvider("wss://demos.yjs.dev", matchId, ydoc);
    const provider = new WebsocketProvider("ws://localhost:8006", matchId, ydoc);
    const awareness = provider.awareness;
    const color = getRandomColor();
    awareness.setLocalStateField("user", {
      name: username,
      color: color,
    });

    // Define a shared text type on the document
    const ytext = ydoc.getText("quill");

    // "Bind" the quill editor to a Yjs text type.
    const binding = new QuillBinding(ytext, quill, awareness);
    binding;
  }, [reff]);

  useEffect(() => {
    if (isLeaving) {
      const content = reff.current.children[0].innerText;
      const attemptData = { uid: userId, qid, content };
      addAttempt(attemptData).then(() => {
        socket.emit("leave room by button", { socketId: socket.id });
        dispatch(clearState());
        navigate("/match");
      });
    }
  }, [isLeaving]);

  return <div ref={reff} />;
}

export default CollabEditor;
