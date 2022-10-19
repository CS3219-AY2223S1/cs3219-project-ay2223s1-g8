import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { socketSelector } from "../../stores/socket/socket.slice";
import { useSelector } from "react-redux";

function NotifyUserLeftModal({ handleClose, show }) {
  const navigate = useNavigate();
  const { socket } = useSelector(socketSelector);
  console.log(socket);

  const leaveRoomButtonClick = () => {
    // Matched record already deleted, so only need to navigate to match page
    navigate("/match");
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Matched user has left the room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your matched user has left the room . Would you like to leave the room?
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

NotifyUserLeftModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default NotifyUserLeftModal;
