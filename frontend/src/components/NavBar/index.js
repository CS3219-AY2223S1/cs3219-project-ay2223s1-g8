import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ChangePasswordModal from "../ChangePasswordModal";
import DeleteAccountModal from "../DeleteAccountModal";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser, userSelector } from "../../stores/user";
import logo from "../../assets/logo-white.png";
import "./styles.scss";

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
      <Navbar bg="light" expand="lg" fixed="top">
        <Container fluid className="Navbar-container">
          <Navbar.Brand href="/match" className="Navbar-peerprep text-white">
            <img alt="" src={logo} width="30" height="30" className="d-inline-block align-top" />{" "}
            PeerPrep
          </Navbar.Brand>
          <Nav>
            <NavDropdown
              title={`Welcome, ${username || "user"}`}
              id="Navbar-dropdown-text"
              align="end"
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
