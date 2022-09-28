import { useEffect, useState } from "react";
import Button from "react-bootstrap/esm/Button";
import CodeEditorWindow from "../../components/CodeEditorWindow";
import LeaveRoomModal from "../../components/LeaveRoomModal";
import NavBar from "../../components/NavBar";
import QuestionCard from "../../components/QuestionCard";

import { languageOptions } from "../../utils/codeEditorUtils/languageOptions";
import { defineTheme } from "../../utils/codeEditorUtils/defineTheme";

import "./CollabPage.scss";

const javascriptDefault = `/**
* Language: Javascript
*/

console.log('Hello World!');
`;

function CollabPage() {
  const [showLeaveRoomModal, setShowLeaveRoomModal] = useState(false);
  const [code, setCode] = useState(javascriptDefault);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);

  const onChange = (action, data) => {
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleLanguageChange = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  const handleThemeChange = (selectedTheme) => {
    if (["light", "vs-dark"].includes(selectedTheme.value)) {
      setTheme(selectedTheme);
    } else {
      defineTheme(selectedTheme.value).then(() => setTheme(selectedTheme));
    }
  };

  useEffect(() => {
    defineTheme("oceanic-next").then(() =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" }),
    );
  }, []);

  return (
    <>
      <div className="Collab-container">
        <NavBar />
        <QuestionCard />
        <CodeEditorWindow
          code={code}
          onChange={onChange}
          language={language}
          theme={theme}
          handleLanguageChange={handleLanguageChange}
          handleThemeChange={handleThemeChange}
        />
        <div className="Collab-actions-container p-3">
          <Button
            className="btn-leave-room"
            variant="outline-danger"
            onClick={() => setShowLeaveRoomModal(true)}
          >
            Leave Room
          </Button>
        </div>
      </div>
      <LeaveRoomModal handleClose={() => setShowLeaveRoomModal(false)} show={showLeaveRoomModal} />
    </>
  );
}

export default CollabPage;
