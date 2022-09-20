import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import "./LoginPage.scss";

function LoginPage() {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    //Prevent page reload
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    setValidated(true);
    // Find user login info (redux)
    // var { username, userPassword } = document.forms[0];
  };

  return (
    <div className="Auth-form-container">
      <Form className="Auth-form" noValidate validated={validated} onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Log In</h3>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Enter username" required />
            <Form.Control.Feedback type="invalid">Please enter a username.</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="userPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Enter password" required />
            <Form.Control.Feedback type="invalid">
              Please enter your password.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid gap-2 mt-3">
            <Button className="btn btn-primary" variant="primary" type="submit">
              Log In
            </Button>
          </div>
        </div>

        <div>
          <p className="sign-up text-center mt-3">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
          <p className="forgot-password text-center mt-3">
            <Link to="/forgotPassword">Forgot password?</Link>
          </p>
        </div>
      </Form>
    </div>
  );
}

export default LoginPage;
