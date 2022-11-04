import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/Modal";
import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import PropTypes from "prop-types";
import { deleteUser } from "../../middleware/userSvc";
import { logoutUser } from "../../stores/user";

import "./styles.scss";

const DeleteAccountModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const handleDelete = async () => {
    await deleteUser()
      .then(() => {
        setShowSuccessToast(true);
        handleClose();
        setTimeout(() => {
          dispatch(logoutUser());
          navigate("/login");
        }, 1000);
      })
      .catch(() => setShowErrorToast(true));
  };

  const SuccessToast = () => (
    <ToastContainer position="bottom-end" className="custom-toast-container">
      <Toast
        bg="success"
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        delay={3000}
        autohide
      >
        <Toast.Body className="text-white">Account deleted successfully.</Toast.Body>
      </Toast>
    </ToastContainer>
  );

  const ErrorToast = () => (
    <ToastContainer position="bottom-end" className="custom-toast-container">
      <Toast
        bg="warning"
        show={showErrorToast}
        onClose={() => setShowErrorToast(false)}
        delay={3000}
        autohide
      >
        <Toast.Body className="text-black">
          <i className="bi bi-exclamation-triangle-fill"></i> Unable to delete account
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );

  return (
    <>
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

      <SuccessToast />
      <ErrorToast />
    </>
  );
};

DeleteAccountModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default DeleteAccountModal;
