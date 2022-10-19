import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { socketSelector } from "../../stores/socket/socket.slice";
import { matchSelector } from "../../stores/match/match.slice";
import { useSelector } from "react-redux";
import axios from "axios";
import configs from "../../utils/configs";
const config = configs[process.env.NODE_ENV];

function LeaveRoomModal({ handleClose, show }) {
  const navigate = useNavigate();
  const { socket } = useSelector(socketSelector);
  const { matchId } = useSelector(matchSelector);
  console.log(matchId);

  socket.on("leave room", (data) => {
    console.log(`all users have left room ${data.roomId}`);
    navigate("/match");
  });

  const leaveRoomButtonClick = () => {
    socket.emit("leave room by button", { socketId: socket.id });
    axios.delete(config.QUESTION_SVC_BASE_URL + "/question-api/assigned-question", {
      data: {
        matchId: matchId,
      },
    });
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Leave Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to leave the room? You would lose access to your match and your code.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-light" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={leaveRoomButtonClick}>
          Leave Room
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

LeaveRoomModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default LeaveRoomModal;
