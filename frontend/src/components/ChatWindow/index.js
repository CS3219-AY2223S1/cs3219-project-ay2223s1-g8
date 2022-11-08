import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { userSelector } from "../../stores/user";
import { matchSelector } from "../../stores/match/match.slice";
import useAutosizeTextArea from "../../utils/useAutoSizedTextArea";
import io from "socket.io-client";
import configs from "../../utils/configs";
import PropTypes from "prop-types";

import "./styles.scss";

const config = configs[process.env.NODE_ENV];

const socket = io.connect(config.COMMUNICATION_SVC_BASE_URL, {
  path: "/communication-api",
  closeOnBeforeunload: false,
});

socket.on("connect_error", (data) => {
  console.log("Communication socket connection error:", data);
  socket.disconnect();
});

const ChatWindow = ({ mode }) => {
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
    setMessages([...messages, req]);
  });

  useEffect(() => {
    socket.emit("join chat", {
      roomId: matchId,
    });
  }, []);

  useEffect(() => {
    if (isLeaving) {
      socket.emit("leave chat", { roomId: matchId });
    }
  }, [isLeaving]);

  const toggleClassNameMode = mode ? "chat-window--dark" : "";

  return (
    <div
      className={`overlay rounded-md overflow-hidden shadow-4xl ${toggleClassNameMode}`}
      id="ChatWindow-container"
    >
      <div
        className={`pt-2 pb-1 ${mode ? "text-light bg-dark-900" : "bg-whitesmoke"}`}
        id="Chat-header-container"
      >
        Chat Box
      </div>
      <div
        ref={messageEnd}
        className={`Chatbox-container p-2 h-100 overflow-auto ${toggleClassNameMode}`}
      >
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
      <div className={`Chat-footer-container px-2 ${mode && "bg-dark-500"}`}>
        <form className="Chat-submit" ref={(el) => (formRef = el)} onSubmit={handleSendMessage}>
          <textarea
            rows="1"
            placeholder="Write a message..."
            className={`Chat-message-input m-2 ${mode && "text-light"}`}
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
  mode: PropTypes.bool,
};

export default ChatWindow;
