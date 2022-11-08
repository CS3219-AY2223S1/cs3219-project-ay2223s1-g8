import { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import NavBar from "../../components/NavBar";
import DifficultyPill from "../../components/DifficultyPill";
import { getQuestionDetails } from "../../middleware/questionSvc";
import { getHistory } from "../../middleware/historySvc";
import { useSelector } from "react-redux";
import { userSelector } from "../../stores/user";

import PropTypes from "prop-types";
import "./HistoryPage.scss";

const getDateString = (date = Date.now()) => {
  const d = new Date(date);
  const ampm = d.getHours() >= 12 ? " PM" : " AM";
  const options = {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return d.toLocaleDateString(undefined, options) + ampm;
};

const HistoryPage = () => {
  const [userHistories, setUserHistories] = useState([]);
  const [showAttemptModal, setShowAttemptModal] = useState(false);
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const { userId } = useSelector(userSelector);

  const handleHide = () => setShowAttemptModal(false);

  const handleShow = (attempt) => {
    setCurrentAttempt(attempt);
    setShowAttemptModal(true);
  };

  useEffect(() => {
    getHistory({ uid: userId })
      .then(async (res) => {
        const data = await Promise.all(
          res.data.attempts.map(async (h) => {
            const qnDetails = await getQuestionDetails({ qid: h.qid });
            return {
              ...h,
              title: qnDetails.title,
              qnContent: qnDetails.content,
              difficulty: qnDetails.difficulty,
            };
          }),
        );
        setUserHistories(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <NavBar isHistoryPage />
      <div className="h-content p-4 bg-whitesmoke" id="History-content-div">
        <h4>Past attempts</h4>
        <HistoryTable history={userHistories} handleShow={handleShow} />
      </div>
      <AttemptModal show={showAttemptModal} attempt={currentAttempt} handleHide={handleHide} />
    </>
  );
};

const replaceWhitespaceCharacters = (str) => {
  let replacedStr = str.replaceAll("\n\n", "\n");
  replacedStr = replacedStr.replaceAll("\t", "  ");
  return replacedStr;
};

const DivToggle = ({ children, eventKey }) => {
  const decoratedOnClick = useAccordionButton(eventKey);
  return (
    <div
      className="card-header fw-bold d-flex flex-row justify-content-between"
      onClick={decoratedOnClick}
    >
      {children}
      <i className="bi bi-chevron-down" />
    </div>
  );
};

const AttemptModal = ({ show, attempt, handleHide }) => {
  if (!attempt) {
    return;
  }
  return (
    <Modal show={show} fullscreen onHide={handleHide} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{attempt.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="px-2 pb-2 d-flex flex-row justify-content-between">
          <div>
            <b>Last Attempted On: </b>
            {getDateString(attempt.attemptDate)}
          </div>
          <div>
            <b>Difficulty: </b>
            <DifficultyPill variant={attempt.difficulty} />
          </div>
        </div>
        <Accordion className="py-2" defaultActiveKey={["0", "1"]} alwaysOpen>
          <div className="card mb-3">
            <DivToggle eventKey="0">Question</DivToggle>
            <Accordion.Collapse eventKey="0">
              <div className="card-body" id="History-attempt-content">
                {`${attempt.qnContent}`}
              </div>
            </Accordion.Collapse>
          </div>
          <div className="card">
            <DivToggle eventKey="1">Attempt</DivToggle>
            <Accordion.Collapse eventKey="1">
              <div className="card-body font-monospace" id="History-attempt-content">
                {`${replaceWhitespaceCharacters(attempt.content)}`}
              </div>
            </Accordion.Collapse>
          </div>
        </Accordion>
      </Modal.Body>
    </Modal>
  );
};

const HistoryTable = ({ history = [], handleShow }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>Question</th>
        <th>Difficulty</th>
        <th>Attempt Date</th>
      </tr>
    </thead>
    <tbody>
      {!history || history.length === 0 ? (
        <tr>
          <td colSpan={4} className="text-center fst-italic font-trebuchet">
            No past attempts!
          </td>
        </tr>
      ) : (
        history.map((h, index) => (
          <tr key={++index} onClick={() => handleShow(h)}>
            <td>{++index}</td>
            <td>{h.title}</td>
            <td>
              <DifficultyPill variant={h.difficulty} />
            </td>
            <td>{getDateString(h.attemptDate)}</td>
          </tr>
        ))
      )}
    </tbody>
  </Table>
);

DivToggle.propTypes = {
  eventKey: PropTypes.any,
  children: PropTypes.any,
};

AttemptModal.propTypes = {
  show: PropTypes.bool,
  attempt: PropTypes.any,
  handleHide: PropTypes.func,
};

HistoryTable.propTypes = {
  history: PropTypes.any,
  handleShow: PropTypes.func,
};

export default HistoryPage;
