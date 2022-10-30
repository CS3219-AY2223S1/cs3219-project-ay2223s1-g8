export default {
  development: {
    USER_SVC_BASE_URL: "http://localhost:8000",
    MATCH_SVC_BASE_URL: "http://localhost:8001",
    QUESTION_SVC_BASE_URL: "http://localhost:8002",
    HISTORY_SVC_BASE_URL: "http://localhost:8004",
    COMMUNICATION_SVC_BASE_URL: "http://localhost:8005",
  },
  production: {
    USER_SVC_BASE_URL: window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8000",
    MATCH_SVC_BASE_URL: window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8001",
    QUESTION_SVC_BASE_URL: window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8002",
    HISTORY_SVC_BASE_URL: window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8004",
    COMMUNICATION_SVC_BASE_URL:
      window.__RUNTIME_CONFIG__.REACT_APP_API_URL || "http://localhost:8005",
  },
};
