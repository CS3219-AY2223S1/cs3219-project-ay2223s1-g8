import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../../stores/user";
import { matchSelector } from "../../stores/match/match.slice";
import useAutosizeTextArea from "../../utils/useAutoSizedTextArea";
import PropTypes from "prop-types";
import "./styles.scss";

const ChatWindow = (props) => {
  const socket = props.sock;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username } = useSelector(userSelector);
  const { matchId, isLeaving } = useSelector(matchSelector);

  const textAreaRef = useRef(null);
  let formRef = useRef(null);

  useAutosizeTextArea(textAreaRef.current, message);

  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      formRef.requestSubmit();
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim().length != 0 && message.trim().length < 1000) {
      socket.emit("send message", {
        username: username,
        message: message,
        roomId: matchId,
      });
    }
    setMessage("");
  };

  const messageEnd = useRef(null);

  useEffect(() => {
    if (messageEnd) {
      messageEnd.current.addEventListener("DOMNodeInserted", (event) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
  }, []);

  socket.on("receive message", (req) => {
    console.log("Receiving message:");
    console.log(req);
    setMessages([...messages, req]);
    console.log(messages);
  });

  useEffect(() => {
    socket.emit("join chat", {
      roomId: matchId,
    });
  }, []);

  useEffect(() => {
    if (isLeaving) socket.disconnect();
  }, [isLeaving]);

  return (
    <div className="overlay rounded-md overflow-hidden shadow-4xl" id="ChatWindow-container">
      <div className="pt-2 pb-1" id="Chat-header-container">
        Chat Box
      </div>
      <div ref={messageEnd} className="p-2 h-100 overflow-auto" id="Chatbox-container">
        {messages.map((message, idx) =>
          message.username === username ? (
            <div className="Chat-messages" key={idx}>
              <p className="Sender-name">You</p>
              <div className="Message Message-sender">{message.message}</div>
            </div>
          ) : (
            <div className="Chat-messages" key={idx}>
              <p className="Recipient-name">{message.username}</p>
              <div className="Message Message-recipient">{message.message}</div>
            </div>
          ),
        )}
      </div>
      <div className="Chat-footer-container px-2">
        <form className="Chat-submit" ref={(el) => (formRef = el)} onSubmit={handleSendMessage}>
          <textarea
            rows="1"
            placeholder="Write a message..."
            className="Chat-message-input m-2"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            ref={textAreaRef}
            onKeyDown={onEnterPress}
          />
          <button type="submit" id="ChatWindow-btn">
            <i className="bi bi-send-fill" />
          </button>
        </form>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  sock: PropTypes.object,
};

export default ChatWindow;
