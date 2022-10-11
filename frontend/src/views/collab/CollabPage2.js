import CollabEditorBox from "../../components/CollabEditor/CollabEditorBox";
import NavBar from "../../components/NavBar";
import QuestionCard from "../../components/QuestionCard";
import "./CollabPage2.scss";
import ChatWindow from "../../components/ChatWindow";

function CollabPage2() {
  return (
    <div>
      <NavBar />
      <QuestionCard />
      <div>
        <CollabEditorBox />
      </div>
      <ChatWindow />
    </div>
  );
}

export default CollabPage2;
