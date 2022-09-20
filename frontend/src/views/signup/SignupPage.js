import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { Link } from "react-router-dom";
// form validation libraries
import { Formik } from "formik";
import * as Yup from "yup";
// style
import "./SignupPage.scss";

const initialValues = {
  username: "",
  password: "",
  confirmPassword: "",
};

const signUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short! - should be 4 characters minimum")
    .max(50, "Too Long! - should be 50 characters maximum")
    .required("Username is required"),

  password: Yup.string()
    .required("Password is required")
    .min(8, "Password is too short - should be 8 characters minimum")
    .matches(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Must contain one uppercase, one lowercase, one number and one special case character",
    ),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

function SignupPage() {
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };

  const toggleConfirmPassword = () => {
    if (confirmPasswordType === "password") {
      setConfirmPasswordType("text");
      return;
    }
    setConfirmPasswordType("password");
  };

  const submitForm = (values) => {
    console.log("submit form function");
    console.log(values);
    // TODO: check for unique username
    // TODO: send data to userService
  };

  return (
    <Formik initialValues={initialValues} validationSchema={signUpSchema} onSubmit={submitForm}>
      {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
        <div className="Auth-form-container">
          <Form className="Auth-form" noValidate onSubmit={handleSubmit}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign Up</h3>
              <Form.Group className="mb-3" controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.username && !errors.username}
                />
                {touched.username && errors.username ? (
                  <div className="error-message">{errors.username}</div>
                ) : null}
              </Form.Group>

              <div className="mb-3">
                <Form.Label>Password</Form.Label>
                <InputGroup controlId="password">
                  <Form.Control
                    type={passwordType}
                    name="password"
                    placeholder="Enter password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.password && !errors.password}
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

              <div className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <InputGroup controlId="confirmPassword">
                  <Form.Control
                    type={passwordType}
                    name="confirmPassword"
                    placeholder="Retype password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.confirmPassword && !errors.confirmPassword}
                  />
                  <Button
                    variant="outline-secondary"
                    className="btn btn-outline-secondary btn-toggle-password-visibility"
                    onClick={toggleConfirmPassword}
                  >
                    {confirmPasswordType === "password" ? (
                      <i className="bi bi-eye-slash"></i>
                    ) : (
                      <i className="bi bi-eye"></i>
                    )}
                  </Button>
                </InputGroup>
                {touched.confirmPassword && errors.confirmPassword ? (
                  <div className="error-message">{errors.confirmPassword}</div>
                ) : null}
              </div>

              <div className="d-grid gap-2 mt-3">
                <Button className="btn btn-primary" variant="primary" type="submit">
                  Sign Up
                </Button>
              </div>
            </div>

            <div>
              <p className="sign-up text-center mt-3">
                Already have an account? <Link to="/login">Log In</Link>
              </p>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
}

export default SignupPage;
