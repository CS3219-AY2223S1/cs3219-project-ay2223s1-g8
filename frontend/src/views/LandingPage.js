import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

function LandingPage() {
  return (
    <>
      <Button variant="outline-primary" href="/login">
        Login
      </Button>
      <Button variant="outline-primary" href="/match">
        Find Match
      </Button>
    </>
  );
}

export default LandingPage;
