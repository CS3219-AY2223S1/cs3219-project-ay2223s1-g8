import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { socketSelector } from "../../stores/socket/socket.slice";
import { useSelector } from "react-redux";
// import configs from "../../utils/configs";
// import io from "socket.io-client";
// const config = configs[process.env.NODE_ENV];
// const socket = io.connect(config.MATCH_SVC_BASE_URL, {
//   path: "/matching-api",
// });

function LeaveRoomModal({ handleClose, show }) {
  const navigate = useNavigate();

  const leaveRoomButtonClick = () => {
    const { socket } = useSelector(socketSelector);
    console.log(socket);
    socket.emit("leave room by button", { req: socket.id });
    navigate("/match");
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
        <Button variant="danger" onClick={leaveRoomButtonClick()}>
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
