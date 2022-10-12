import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { userSelector } from "../../stores/user";
import { matchSelector } from "../../stores/match/match.slice";
import { COMMUNICATION_SVC_BASE_URL } from "../../utils/configs";
import useAutosizeTextArea from "../../utils/useAutoSizedTextArea";
import "./styles.scss";

const socket = io.connect(COMMUNICATION_SVC_BASE_URL, {
  path: "/communication-api",
});

const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username } = useSelector(userSelector);
  const { matchId } = useSelector(matchSelector);

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
    socket.emit("send message", {
      username: username,
      message: message,
      roomId: matchId,
    });
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

  return (
    <div className="overlay rounded-md overflow-hidden shadow-4xl" id="ChatWindow-container">
      <div className="pt-2 pb-1" id="Chat-header-container">
        Chat Box
      </div>
      <div ref={messageEnd} className="p-2 h-100 overflow-auto" id="Chatbox-container">
        {messages.map((message) =>
          message.username === username ? (
            <div className="Chat-messages" key={message.id}>
              <p className="Sender-name">You</p>
              <div className="Message Message-sender">{message.message}</div>
            </div>
          ) : (
            <div className="Chat-messages" key={message.id}>
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
