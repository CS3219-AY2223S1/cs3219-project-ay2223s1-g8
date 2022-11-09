import Button from "react-bootstrap/Button";
import pairProgGif from "../../assets/pair-programming-animate-v2.gif";
import NavBar from "../../components/NavBar";
import "./LandingPage.scss";

function LandingPage() {
  return (
    <>
      <NavBar />
      <div className="h-content w-100 bg-whitesmoke d-flex flex-column align-items-center justify-content-center p-4">
        <img src={pairProgGif} className="img-pair-prog" />
        <h1 className="text-peerprep display-4 m-0 mt-3">
          <strong>PeerPrep</strong>
        </h1>
        <div className="desc-container mt-3 mb-4">
          <p className="text-peerprep-desc m-0">
            PeerPrep aims to help students and job seekers boost their technical interview skills to
            land their dream job. PeerPrep can engage in real-time, collaborative programming to
            enhance their familiarly with technical interviews.
          </p>
        </div>
        <div>
          <Button variant="primary text-white landing-btn" href="/login">
            Login
          </Button>
          <Button variant="primary text-white landing-btn" href="/signup">
            Sign Up
          </Button>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
