import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { setIsLeaving } from "../../stores/match/match.slice";
import PropTypes from "prop-types";

function NotifyUserLeftModal({ handleClose, show }) {
  const dispatch = useDispatch();

  const leaveRoomButtonClick = () => {
    dispatch(setIsLeaving(true));
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Matched user has left the room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your matched user has left the room, and you will no longer be able to send chat messages. Would you like to leave the room?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClose}>
          Stay
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
