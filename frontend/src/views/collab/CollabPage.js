import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import LeaveRoomModal from "../../components/LeaveRoomModal";
import NavBar from "../../components/NavBar";
import QuestionCard from "../../components/QuestionCard";
import TextEditor from "../../components/TextEditor";
import "./CollabPage.scss";

function CollabPage() {
  const [showLeaveRoomModal, setShowLeaveRoomModal] = useState(false);

  return (
    <>
      <div className="Collab-container">
        <NavBar />
        <QuestionCard />
        <TextEditor />
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
