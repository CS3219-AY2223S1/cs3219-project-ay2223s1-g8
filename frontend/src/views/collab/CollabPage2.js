import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import NavBar from "../../components/NavBar";
import QuestionCard from "../../components/QuestionCard";
import ChatWindow from "../../components/ChatWindow";
import CollabEditor from "../../components/CollabEditor";
import LeaveRoomModal from "../../components/LeaveRoomModal";

import "./CollabPage2.scss";

function CollabPage2() {
  const [showLeaveRoomModal, setShowLeaveRoomModal] = useState(false);

  return (
    <>
      <div className="Collab2-container">
        <NavBar />
        <div className="Collab2-content-div">
          <div className="Collab2-left-div">
            <QuestionCard containerId="Collab2-qn-card-container" />
            <ChatWindow />
          </div>

          <div className="Collab2-right-div">
            <CollabEditor />
          </div>
        </div>
        <div className="Collab2-footer-div px-3 py-2">
          <Button
            className="btn-leave-room btn-sm"
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

export default CollabPage2;
