import { useState } from "react";
import Badge from "react-bootstrap/Badge";
import Editor from "@monaco-editor/react";
import LanguagesDropdown from "../LanguagesDropdown";
import ThemeDropdown from "../ThemeDropdown";

import PropTypes from "prop-types";
import "./styles.scss";

const CodeEditorWindow = ({
  onChange,
  language,
  code,
  theme,
  handleLanguageChange,
  handleThemeChange,
}) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value) => {
    setValue(value);
    onChange("code", value);
  };

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
