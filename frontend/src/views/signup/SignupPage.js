import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import "./SignupPage.scss";

function SignupPage() {
  const defaultErrorMsg = {
    username: "Please enter a username",
    password: "Please enter a password",
  };
  const [validated, setValidated] = useState(false);
  const [errorMsg, setErrorMsg] = useState(defaultErrorMsg);

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    // Check for unique username
    setErrorMsg(defaultErrorMsg);
    // Create new user (redux)
    // var { username, password } = document.forms[0];
  };

  return (
    <div className="Auth-form-container">
      <Form className="Auth-form" noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Sign Up</h3>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" required />
            <Form.Control.Feedback type="invalid">{errorMsg.username}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" required />
            <Form.Control.Feedback type="invalid">{errorMsg.password}</Form.Control.Feedback>
          </Form.Group>

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
  );
}

export default SignupPage;
