export default {
  development: {
    USER_SVC_BASE_URL: process.env.REACT_APP_URI_USER_SVC || "http://localhost:8000",
    MATCH_SVC_BASE_URL: process.env.REACT_APP_URI_MATCH_SVC || "http://localhost:8001",
    QUESTION_SVC_BASE_URL: process.env.REACT_APP_URI_QUESTION_SVC || "http://localhost:8002",
    HISTORY_SVC_BASE_URL: process.env.REACT_APP_URI_HISTORY_SVC || "http://localhost:8004",
    COMMUNICATION_SVC_BASE_URL:
      process.env.REACT_APP_URI_COMMUNICATION_SVC || "http://localhost:8005",
    COLLABORATION_SVC_BASE_URL:
      process.env.REACT_APP_URI_COLLABORATION_SVC || "wss://demos.yjs.dev",
  },
  production: {
    USER_SVC_BASE_URL: window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8000",
    MATCH_SVC_BASE_URL: window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8001",
    QUESTION_SVC_BASE_URL: window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8002",
    HISTORY_SVC_BASE_URL: window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8004",
    COMMUNICATION_SVC_BASE_URL:
      window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8005",
    COLLABORATION_SVC_BASE_URL:
      window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "wss://demos.yjs.dev",
  },
};
