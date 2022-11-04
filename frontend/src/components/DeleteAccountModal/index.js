import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";
import { deleteUser } from "../../middleware/userSvc";
import { logoutUser } from "../../stores/user";

import "./styles.scss";

const DeleteAccountModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    await deleteUser()
      .then(() => {
        toast.success("Account deleted successfully");
        dispatch(logoutUser());
        navigate("/login");
      })
      .catch(() => toast.error("Unable to delete account"));
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Delete Account</Modal.Title>
      </Modal.Header>
      <Modal.Body>Be careful!! This will erase all your user data.</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose} variant="outline-primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} variant="danger">
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

DeleteAccountModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default DeleteAccountModal;
