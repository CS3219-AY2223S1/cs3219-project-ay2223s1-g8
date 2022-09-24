import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/logo.svg";
import pairProgGif from "../../assets/pair-programming-animate.gif";
import "./LandingPage.scss";

function LandingPage() {
  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="/" className="navbar-peerprep">
            <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" />{" "}
            PeerPrep
          </Navbar.Brand>
        </Container>
      </Navbar>
      <Container className="landing-container" fluid>
        <img src={pairProgGif} className="img-pair-prog" width="400" />
        <h1 className="text-peerprep display-4">
          <strong>PeerPrep</strong>
        </h1>
        <Container className="w-75 p-3">
          <p className="text-peerprep-desc">
            PeerPrep aims to help students and job seekers boost their technical interview skills to
            land their dream job. PeerPrep can engage in real-time, collaborative programming to
            enhance their familiarly with technical interviews.
          </p>
        </Container>
        <Col className="button-container">
          <Button variant="outline-primary" href="/login">
            Login
          </Button>
          <Button variant="outline-primary" href="/signup">
            Sign Up
          </Button>
        </Col>
      </Container>
    </>
  );
}

export default LandingPage;
