import { useRef } from "react";
import "./CollabPageV2.css";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import * as monaco from "monaco-editor";

function CollabPageV2() {
  const ref = useRef(null);

  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider("wss://localhost:8081", "room-1", ydoc);
  const ytext = ydoc.getText("monaco");

  const editor = monaco.editor.create(ref, {
    value: "",
    language: "javascript",
    theme: "vs-dark",
  });

  const monacoBinding = new MonacoBinding(
    ytext,
    editor.getModel(),
    new Set([editor]),
    provider.awareness,
  );
  monacoBinding;

  return <div className="Editor" ref={ref}></div>;
}

export default CollabPageV2;
