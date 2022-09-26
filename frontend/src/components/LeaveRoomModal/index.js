import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function LeaveRoomModal({ handleClose, show }) {
  const navigate = useNavigate();

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
        <Button variant="danger" onClick={() => navigate("/match")}>
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