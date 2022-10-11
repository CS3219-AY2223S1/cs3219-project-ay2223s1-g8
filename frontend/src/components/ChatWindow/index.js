import { useEffect, useState, useRef } from "react";
import "./styles.scss";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { userSelector } from "../../stores/user";
import { matchSelector } from "../../stores/match/match.slice";
import configs from "../../utils/configs";

const config = configs[process.env.NODE_ENV];

const socket = io.connect(config.COMMUNICATION_SVC_BASE_URL, {
  path: "/communication-api",
});

const ChatWindow = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username } = useSelector(userSelector);
  const { matchId } = useSelector(matchSelector);

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
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl ChatWindow-container">
      <div className="Chat-header-container">
        <h2>ChatBox</h2>
      </div>
      <div ref={messageEnd} className="Chatbox-container">
        {messages.map((message) =>
          message.username === username ? (
            <div className="Chat-messages" key={message.id}>
              <p className="Sender-name">You</p>
              <div className="Message-sender">
                <p>{message.message}</p>
              </div>
            </div>
          ) : (
            <div className="Chat-messages" key={message.id}>
              <p className="Recipient-name">{message.username}</p>
              <div className="Message-recipient">
                <p>{message.message}</p>
              </div>
            </div>
          ),
        )}
      </div>
      <div className="chat__footer">
        <form className="Chat-submit" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type message"
            className="Chat-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="Chat-btn">Send</button>
        </form>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {};

export default ChatWindow;
