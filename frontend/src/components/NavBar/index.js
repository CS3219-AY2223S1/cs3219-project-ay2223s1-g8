import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, userSelector } from "../../stores/user";
import "./styles.scss";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector(userSelector);

  const handleChangePassword = () => {
    console.log("Handle change password");
  };

  const handleDeleteUser = () => {
    console.log("Handle delete user");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid className="Nav-bar-container">
        <Navbar.Brand href="#home">PeerPrep</Navbar.Brand>
        <Nav>
          <NavDropdown
            title={`Welcome, ${username || "user"}`}
            id="basic-nav-dropdown"
            className="Nav-bar-dropdown"
          >
            <NavDropdown.Item onClick={handleChangePassword}>Change password</NavDropdown.Item>
            <NavDropdown.Item onClick={handleDeleteUser}>Delete account</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
