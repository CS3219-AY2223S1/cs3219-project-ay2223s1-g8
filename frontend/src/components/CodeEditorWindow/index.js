import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Editor from "@monaco-editor/react";
import LanguagesDropdown from "../LanguagesDropdown";
import ThemeDropdown from "../ThemeDropdown";

import PropTypes from "prop-types";
import "./styles.scss";

import { useSelector } from "react-redux";
import { matchSelector } from "../../stores/match/match.slice";

const io = require("socket.io-client");
const socket = io("https://collab-server-cs3219.herokuapp.com/");

const CodeEditorWindow = ({
  onChange,
  language,
  code,
  theme,
  handleLanguageChange,
  handleThemeChange,
}) => {
  const [value, setValue] = useState(code || "");
  const [room, setRoom] = useState("empty");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
    socket.emit("client to server", { message: value, roomId: room });
  };

  const { matchId } = useSelector(matchSelector);
  console.log(matchId);

  if (room === "empty") {
    setRoom("Room 1");
    // setRoom(matchId);
    socket.emit("join room", { roomId: "Room 1" });
  }

  socket.on("server to client", (data) => {
    // console.log(data);
    const incomingRoomId = data["roomId"];
    const incomingCode = data["message"];
    if (room === incomingRoomId) {
      setValue(incomingCode);
    }
  });

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl TextEditor-container">
      <div className="editor-header-container">
        <div className="editor-options-container">
          <div className="me-4 py-2 editor-dropdown-container">
            <b>Language:</b>
            <LanguagesDropdown handleLanguageChange={handleLanguageChange} language={language} />
          </div>
          <div className="py-2 editor-dropdown-container">
            <b>Theme:</b>
            <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
          </div>
        </div>
        <div className="user-pills-container py-2">
          <Badge pill className="user-pill me-2">
            user-1
          </Badge>
          <Badge pill className="user-pill">
            user-2
          </Badge>
        </div>
      </div>
      <Editor
        className="p-1"
        height="60vh"
        width={`100%`}
        language={language?.value || "javascript"}
        value={value}
        theme={theme.value}
        defaultValue="// this is a comment"
        onChange={handleEditorChange}
      />
    </div>
  );
};

CodeEditorWindow.propTypes = {
  onChange: PropTypes.func,
  code: PropTypes.string,
  language: PropTypes.object,
  theme: PropTypes.object,
  handleLanguageChange: PropTypes.func,
  handleThemeChange: PropTypes.func,
};

export default CodeEditorWindow;
