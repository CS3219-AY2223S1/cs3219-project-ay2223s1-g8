import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { userSelector } from "../../stores/user";
import { matchSelector } from "../../stores/match/match.slice";
import useAutosizeTextArea from "../../utils/useAutoSizedTextArea";
import configs from "../../utils/configs";
import "./styles.scss";

const config = configs[process.env.NODE_ENV];

const socket = io.connect(config.COMMUNICATION_SVC_BASE_URL, {
  path: "/communication-api",
  pingTimeout: 40000,
  pingInterval: 10000,
  closeOnBeforeunload: false,
});

socket.on("connect_error", (data) => {
  console.log("Communication socket connection error:", data);
  socket.disconnect();
});

const ChatWindow = () => {
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
    if (message.trim().length != 0) {
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

ChatWindow.propTypes = {};

export default ChatWindow;
