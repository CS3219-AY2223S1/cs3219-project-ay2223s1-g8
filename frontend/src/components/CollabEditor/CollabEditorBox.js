import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useRef } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { QuillBinding } from "y-quill";
import "./CollabEditorBox.css";
import { useSelector } from "react-redux";
import { matchSelector } from "../../stores/match/match.slice";
Quill.register("modules/cursors", QuillCursors);

function CollabEditorBox() {
  const reff = useRef(null);
  const { matchId } = useSelector(matchSelector);

  useEffect(() => {
    const quill = new Quill(reff.current, {
      modules: {
        cursors: true,
      },
      placeholder: "Start collaborating...",
      theme: "snow", // 'bubble' is also great
    });

    // A Yjs document holds the shared data
    const ydoc = new Y.Doc();
    console.log(matchId);
    const provider = new WebsocketProvider("wss://demos.yjs.dev", matchId, ydoc);

    // Define a shared text type on the document
    const ytext = ydoc.getText("quill");

    // "Bind" the quill editor to a Yjs text type.
    const binding = new QuillBinding(ytext, quill, provider.awareness);
    binding;
  }, [reff]);

  return <div ref={reff} />;
}

export default CollabEditorBox;
