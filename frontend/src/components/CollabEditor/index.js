import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { useEffect, useRef } from "react";
import Quill from "quill";
import QuillCursors from "quill-cursors";
import { QuillBinding } from "y-quill";
import { useSelector } from "react-redux";
import { matchSelector } from "../../stores/match/match.slice";

const Delta = Quill.import("delta");

Quill.register("modules/cursors", QuillCursors);
import "./styles.scss";

function CollabEditor() {
  const reff = useRef(null);
  const { matchId } = useSelector(matchSelector);

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
                    color: false,
                    background: false,
                    bold: false,
                    strike: false,
                    underline: false,
                  }),
                ),
            ],
          ],
        },
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

export default CollabEditor;
