import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import NavBar from "../../components/NavBar";
import QuestionCard from "../../components/QuestionCard";
import ChatWindow from "../../components/ChatWindow";
import CollabEditor from "../../components/CollabEditor";
import LeaveRoomModal from "../../components/LeaveRoomModal";
import NotifyUserLeftModal from "../../components/NotifyUserLeftModal";
import { socketSelector } from "../../stores/socket/socket.slice";
import { useSelector } from "react-redux";
import { matchSelector } from "../../stores/match/match.slice";
import axios from "axios";
import configs from "../../utils/configs";
const config = configs[process.env.NODE_ENV];

import "./CollabPage2.scss";

function CollabPage2() {
  const [showLeaveRoomModal, setShowLeaveRoomModal] = useState(false);
  const [showUserLeftModal, setShowUserLeftModal] = useState(false);

  const { socket } = useSelector(socketSelector);
  const { matchId } = useSelector(matchSelector);

  socket.on("other user left room", () => {
    setShowUserLeftModal(true);
  });

  socket.on("last user left room", () => {
    axios.delete(config.QUESTION_SVC_BASE_URL + "/question-api/assigned-question", {
      data: {
        matchId: matchId,
      },
    });
  });

  return (
    <>
      <div className="Collab2-container">
        <NavBar isCollabPage />
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

      <LeaveRoomModal show={showLeaveRoomModal} handleClose={() => setShowLeaveRoomModal(false)} />
      <NotifyUserLeftModal
        handleClose={() => setShowUserLeftModal(false)}
        show={showUserLeftModal}
      />
    </>
  );
}

export default CollabPage2;
