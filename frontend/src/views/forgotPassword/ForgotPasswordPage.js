import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import Toast from "react-bootstrap/esm/Toast";
import ToastContainer from "react-bootstrap/esm/ToastContainer";
import NavBar from "../../components/NavBar";
import { Link, useNavigate } from "react-router-dom";
// form validation libraries
import { Formik } from "formik";
import * as Yup from "yup";
// redux
import { useDispatch, useSelector } from "react-redux";
import { clearState, userSelector } from "../../stores/user";
// style
import "./ForgotPasswordPage.scss";

const initialValues = {
  username: "",
};

const loginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
});

function ForgotPasswordPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const { isFetching, isSuccess, isError, errorMessage } = useSelector(userSelector);

  const submitForm = (values) => {
    console.log("Handle forget password form submission", values);
    setShowSuccessToast(true);
  };

  useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(clearState());
      navigate("/login");
    }
    if (isError) {
      console.log(errorMessage);
      dispatch(clearState());
    }
  }, [isSuccess, isError]);

  const SuccessToast = () => (
    <ToastContainer position="bottom-end" className="custom-toast-container">
      <Toast
        bg="success"
        show={showSuccessToast}
        onClose={() => setShowSuccessToast(false)}
        delay={3000}
        autohide
      >
        <Toast.Body className="text-white">Reset email sent successfully.</Toast.Body>
      </Toast>
    </ToastContainer>
  );

  return (
    <>
      <NavBar />
      <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={submitForm}>
        {({ values, handleChange, handleSubmit, handleBlur, errors, touched }) => (
          <div className="Auth-form-container">
            <Form className="Auth-form" onSubmit={handleSubmit}>
              <div className="Auth-form-content">
                <h3 className="Auth-form-title">Forgot Password</h3>
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

                <div className="d-grid gap-2 mt-4">
                  <Button className="btn btn-primary text-white" variant="primary" type="submit">
                    {isFetching ? (
                      <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                    ) : (
                      <>Reset Password</>
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <p className="login text-center mt-3">
                  <Link to="/login">Back to Login</Link>
                </p>
              </div>
            </Form>
          </div>
        )}
      </Formik>

      <SuccessToast />
    </>
  );
}

export default ForgotPasswordPage;
