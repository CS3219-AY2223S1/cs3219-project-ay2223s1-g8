import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/logo-white.png";
import pairProgGif from "../../assets/pair-programming-animate.gif";
import "./LandingPage.scss";

function LandingPage() {
  return (
    <>
      <Navbar bg="light">
        <Container>
          <Navbar.Brand href="/" className="navbar-peerprep text-white">
            <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" />{" "}
            PeerPrep
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className="landing-container">
        <img src={pairProgGif} className="img-pair-prog" />
        <h1 className="text-peerprep display-4">
          <strong>PeerPrep</strong>
        </h1>
        <div className="desc-container">
          <p className="text-peerprep-desc">
            PeerPrep aims to help students and job seekers boost their technical interview skills to
            land their dream job. PeerPrep can engage in real-time, collaborative programming to
            enhance their familiarly with technical interviews.
          </p>
        </div>
        <Col className="btn-container mt-4 mb-4">
          <Button variant="primary text-white landing-btn" href="/login">
            Login
          </Button>
          <Button variant="primary text-white landing-btn" href="/signup">
            Sign Up
          </Button>
        </Col>
      </div>
    </>
  );
}

export default LandingPage;
