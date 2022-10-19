import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { socketSelector } from "../../stores/socket/socket.slice";
import { useSelector } from "react-redux";

function LeaveRoomModal({ handleClose, show }) {
  const navigate = useNavigate();
  const { socket } = useSelector(socketSelector);

  const leaveRoomButtonClick = () => {
    socket.emit("leave room by button", { socketId: socket.id });
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
