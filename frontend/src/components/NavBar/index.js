import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ChangePasswordModal from "../ChangePasswordModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, userSelector } from "../../stores/user";
import "./styles.scss";
import DeleteAccountModal from "../DeleteAccountModal";

function NavBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useSelector(userSelector);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  const handleDeleteUser = () => {
    setShowDeleteAccountModal(true);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <>
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

      {/* MODALS */}
      <ChangePasswordModal
        show={showChangePasswordModal}
        handleClose={() => setShowChangePasswordModal(false)}
      />
      <DeleteAccountModal
        show={showDeleteAccountModal}
        handleClose={() => setShowDeleteAccountModal(false)}
      />
    </>
  );
}

export default NavBar;
