import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/esm/Button";
import NavBar from "../../components/NavBar";
import QuestionCard from "../../components/QuestionCard";
import ChatWindow from "../../components/ChatWindow";
import CollabEditor from "../../components/CollabEditor";
import LeaveRoomModal from "../../components/LeaveRoomModal";
import NotifyUserLeftModal from "../../components/NotifyUserLeftModal";
import { socketSelector } from "../../stores/socket/socket.slice";
import { clearState, matchSelector } from "../../stores/match/match.slice";
import { deleteAssignedQuestion } from "../../middleware/questionSvc";
// import { clearCommState, setCommSocket } from "../../stores/socket/commSocket.slice";
// import io from "socket.io-client";
// import configs from "../../utils/configs";

import "./CollabPage.scss";

function CollabPage() {
  const dispatch = useDispatch();
  // dispatch(clearCommState());

  // const config = configs[process.env.NODE_ENV];

  // const commSocket = io.connect(config.COMMUNICATION_SVC_BASE_URL, {
  //   path: "/communication-api",
  //   closeOnBeforeunload: false,
  // });

  // commSocket.on("connect_error", (data) => {
  //   console.log("Matching socket connection error:", data);
  //   commSocket.disconnect();
  // });
  // dispatch(setCommSocket({ commSocket: commSocket }));

  const [showLeaveRoomModal, setShowLeaveRoomModal] = useState(false);
  const [showUserLeftModal, setShowUserLeftModal] = useState(false);

  const { socket } = useSelector(socketSelector);
  const { matchId } = useSelector(matchSelector);

  socket.on("other user left room", () => {
    setShowUserLeftModal(true);
  });

  socket.on("last user left room", () => {
    deleteAssignedQuestion(matchId);
  });

  const handleTabClosing = () => {
    dispatch(clearState());
  };

  const alertUser = (e) => {
    e.preventDefault();
    return (e.returnValue = "Are you sure you want to exit?");
  };

  useEffect(() => {
    window.addEventListener("beforeunload", alertUser);
    window.addEventListener("unload", handleTabClosing);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
      window.removeEventListener("unload", handleTabClosing);
    };
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

export default CollabPage;
