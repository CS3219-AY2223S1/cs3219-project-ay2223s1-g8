import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { setIsLeaving } from "../../stores/match/match.slice";
import PropTypes from "prop-types";

function LeaveRoomModal({ show, handleClose }) {
  const dispatch = useDispatch();

  const leaveRoomButtonClick = () => {
    dispatch(setIsLeaving(true));
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
