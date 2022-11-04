import { useState } from "react";
import toast from "react-hot-toast";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import { changeUserPassword } from "../../middleware/userSvc";

// form related imports
import { Formik } from "formik";
import * as Yup from "yup";

import PropTypes from "prop-types";
import "./styles.scss";

const initialValues = {
  currPassword: "",
  newPassword: "",
};

const changePasswordSchema = Yup.object().shape({
  currPassword: Yup.string().required("Current password is required"),
  newPassword: Yup.string()
    .required("New password is required")
    .min(8, "Password is too short - should be 8 characters minimum")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Must contain one uppercase, one lowercase, one number and one special case character",
    )
    .notOneOf([Yup.ref("currPassword"), null], "Current and new passwords should not match"),
});

const ChangePasswordModal = ({ show, handleClose }) => {
  const [currPasswordType, setCurrPasswordType] = useState("password");
  const [newPasswordType, setNewPasswordType] = useState("password");

  const toggleCurrPasswordVisibility = () => {
    if (currPasswordType === "password") {
      setCurrPasswordType("text");
      return;
    }
    setCurrPasswordType("password");
  };

  const toggleNewPasswordVisibility = () => {
    if (newPasswordType === "password") {
      setNewPasswordType("text");
      return;
    }
    setNewPasswordType("password");
  };

  const onSubmit = async (values) => {
    await changeUserPassword(values)
      .then(() => {
        toast.success("Password changed successfully");
        handleClose();
      })
      .catch((err) => {
        const errMsg = err.message.includes("Incorrect token or password")
          ? "Incorrect password"
          : err.message;
        toast.error(errMsg);
      });
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Change password</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={changePasswordSchema}
          onSubmit={onSubmit}
        >
          {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
            <Form noValidate onSubmit={handleSubmit}>
              <div className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={currPasswordType}
                    name="currPassword"
                    placeholder="Current password"
                    value={values.currPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.currPassword && !errors.currPassword}
                  />
                  <Button
                    variant="outline-secondary"
                    className="btn btn-outline-secondary btn-toggle-password-visibility"
                    onClick={toggleCurrPasswordVisibility}
                  >
                    {currPasswordType === "password" ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </Button>
                </InputGroup>
                {touched.currPassword && errors.currPassword ? (
                  <div className="error-message">{errors.currPassword}</div>
                ) : null}
              </div>

              <div className="mb-3">
                <Form.Label>New Password</Form.Label>
                <InputGroup>
                  <Form.Control
                    type={newPasswordType}
                    name="newPassword"
                    placeholder="New password"
                    value={values.newPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.newPassword && !errors.newPassword}
                  />
                  <Button
                    variant="outline-secondary"
                    className="btn btn-outline-secondary btn-toggle-password-visibility"
                    onClick={toggleNewPasswordVisibility}
                  >
                    {newPasswordType === "password" ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </Button>
                </InputGroup>
                {touched.newPassword && errors.newPassword ? (
                  <div className="error-message">{errors.newPassword}</div>
                ) : null}
              </div>

              <div className="d-grid gap-2 mt-4">
                <Button className="btn btn-primary text-white" variant="primary" type="submit">
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
};

ChangePasswordModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default ChangePasswordModal;
