import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
// form validation libraries
import { Formik } from "formik";
import * as Yup from "yup";
// redux
import { useDispatch, useSelector } from "react-redux";
import { clearState, signupUser, userSelector } from "../../stores/user";
// style
import "./SignupPage.scss";

const initialValues = {
  username: "",
  password: "",
  confirmPassword: "",
};

const signUpSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(2, "Too Short! - should be 4 characters minimum")
    .max(50, "Too Long! - should be 50 characters maximum"),
  // TODO: check for unique username from database
  // .test("username", "This username has already been taken", (username) => checkAvailabilityUsername(username));

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const { isFetching, isSuccess, isError, errorMessage } = useSelector(userSelector);

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
    dispatch(signupUser(values));
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      navigate("/");
    }
    if (isError) {
      console.log(errorMessage);
      dispatch(clearState());
    }
  }, [isSuccess, isError]);

  return (
    <Formik initialValues={initialValues} validationSchema={signUpSchema} onSubmit={submitForm}>
      {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
        <div className="Auth-form-container">
          <Form className="Auth-form" noValidate onSubmit={handleSubmit}>
            <div className="Auth-form-content">
              <h3 className="Auth-form-title">Sign Up</h3>
              <Form.Group className="mb-3">
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
                <InputGroup>
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
                <InputGroup>
                  <Form.Control
                    type={confirmPasswordType}
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
                  {isFetching ? (
                    <>
                      <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                      Signing up
                    </>
                  ) : (
                    <>Sign Up</>
                  )}
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
