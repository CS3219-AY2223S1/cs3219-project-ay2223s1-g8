import React, { useEffect, useState } from "react";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import "./Editor.css";
import RandomColor from "randomcolor";
import Editor from "@monaco-editor/react";

function CodeEditor() {
  const [EditorRef, setEditorRef] = useState(null);
  const [code, setCode] = useState("");

  // const handleEditorDidMount = (editor) => {
  //   console.log("Setting editor");
  //   setEditorRef(editor);
  // };

  useEffect(() => {
    console.log("Code: " + code);
    if (EditorRef) {
      const ydoc = new Y.Doc(); //create a ydoc

      let provider = null;
      try {
        provider = new WebsocketProvider("Any Room Name", ydoc);

        const yText = ydoc.getText("monaco");

        const yUndoManager = new Y.UndoManager(yText);

        const awareness = provider.awareness; //awareness is what makes other user aware about your actions

        const color = RandomColor(); //Provied any random color to be used for each user

        awareness.setLocalStateField("user", {
          name: "Users Name",
          color: color,
        });

        const getBinding = new MonacoBinding(yText, EditorRef, awareness, {
          yUndoManager,
        });
        getBinding;
      } catch (err) {
        alert("error in collaborating try refreshing or come back later !");
      }
      return () => {
        if (provider) {
          provider.disconnect(); //We destroy doc we created and disconnect
          ydoc.destroy(); //the provider to stop propagting changes if user leaves editor
        }
      };
    }
  }, [EditorRef]);

  return (
    <div
      style={{
        display: "flex",
        height: "100%",
        width: "100%",
        fontSize: "20px",
        overflowY: "auto",
      }}
    >
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        onChange={(value) => setCode(value)}
        value={code}
        editorDidMount={(editor) => {
          setEditorRef(editor);
          editor.setSize("100vw", "100%");
        }}
      />
      {/* <Editor
        onChange={(editor, data, value) => {
          setCode(value);
        }}
        autoScroll
        options={{
          mode: "javascript", // this is for c++,  you can visit https://github.com/atharmohammad/Code-N-Collab/blob/master/src/Function/languageMapper.js  for other language types
          theme: "monokai",
          lineWrapping: true,
          smartIndent: true,
          lineNumbers: true,
          foldGutter: true,
          tabSize: 2,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          autoCloseTags: true,
          matchBrackets: true,
          autoCloseBrackets: true,
          extraKeys: {
            "Ctrl-Space": "autocomplete",
          },
        }}
        editorDidMount={(editor) => {
          handleEditorDidMount(editor);
          editor.setSize("100vw", "100%");
        }}
      /> */}
    </div>
  );
}

export default CodeEditor;
