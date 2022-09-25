import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import pairProgGif from "../../assets/pair-programming-animate.gif";
import NavBar from "../../components/NavBar";
import "./LandingPage.scss";

function LandingPage() {
  return (
    <>
      <NavBar />
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
        <Col className="btn-container mt-4 mb-">
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
