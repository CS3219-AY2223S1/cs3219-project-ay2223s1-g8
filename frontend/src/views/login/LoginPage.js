import { useEffect, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import NavBar from "../../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
// form validation libraries
import { Formik } from "formik";
import * as Yup from "yup";
// redux
import { useDispatch, useSelector } from "react-redux";
import { clearState, loginUser, userSelector } from "../../stores/user";

import PropTypes from "prop-types";
import "./LoginPage.scss";

const initialValues = {
  username: "",
  password: "",
};

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),

  password: Yup.string().required("Password is required"),
});

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const { isFetching, isSuccess, isError, errorMessage } = useSelector(userSelector);

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const submitForm = (values) => {
    dispatch(loginUser(values));
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      navigate("/match");
    }
    if (isError) {
      console.log(errorMessage);
      dispatch(clearState());
      setShowAlert(true);
      setMessage(errorMessage);
    }
  }, [isSuccess, isError]);

  return (
    <>
      <NavBar />
      <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={submitForm}>
        {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
          <div className="Auth-form-container">
            <Form className="Auth-form" noValidate onSubmit={handleSubmit}>
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Log In</h3>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={values.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {touched.username && errors.username ? (
                    <div className="error-message">{errors.username}</div>
                  ) : null}
                </Form.Group>

                <div className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type={passwordType}
                      name="password"
                      placeholder="Enter password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Button
                      variant="outline-secondary"
                      className="btn btn-outline-secondary btn-toggle-password-visibility"
                      onClick={togglePassword}
                    >
                      {passwordType === "password" ? (
                        <i className="bi bi-eye-slash"></i>
                      ) : (
                        <i className="bi bi-eye"></i>
                      )}
                    </Button>
                  </InputGroup>
                  {touched.password && errors.password ? (
                    <div className="error-message">{errors.password}</div>
                  ) : null}
                </div>

                <div className="d-grid gap-2 mt-3">
                  <Button className="btn btn-primary text-white" variant="primary" type="submit">
                    {isFetching ? (
                      <>
                        <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                        Logging in
                      </>
                    ) : (
                      <>Login</>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <p className="sign-up text-center mt-3">
                  Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
                </p>
                {/* <p className="forgot-password text-center mt-3">
                  <Link to="/forgotPassword">Forgot password?</Link>
                </p> */}
              </div>
            </Form>
          </div>
        )}
      </Formik>

      <AlertMessage showAlert={showAlert} onClose={() => setShowAlert(false)} message={message} />
    </>
  );
}

function AlertMessage({ showAlert, onClose, message }) {
  if (!showAlert) return;
  return (
    <Modal show={showAlert} onHide={onClose} backdrop="static" keyboard={false} centered>
      <Alert className="m-0" variant="danger" onClose={onClose} dismissible>
        <Alert.Heading>Error</Alert.Heading>
        {message}
      </Alert>
    </Modal>
  );
}

AlertMessage.propTypes = {
  showAlert: PropTypes.bool,
  onClose: PropTypes.func,
  message: PropTypes.string,
};

export default LoginPage;
