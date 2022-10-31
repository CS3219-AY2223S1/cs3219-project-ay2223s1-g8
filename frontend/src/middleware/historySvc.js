import axios from "axios";
import configs from "../utils/configs";

const config = configs[process.env.NODE_ENV];

export const addAttempt = async ({ uid, qid, content }) => {
  try {
    const res = await axios.post(`${config.HISTORY_SVC_BASE_URL}/history-api/history/attempt`, {
      uid,
      attempt: { qid, content },
    });
    console.log(res.data);
    return res.data;
  } catch (e) {
    console.log("Error: Unable to post new attempt to question", e.response.data);
    return e.response.data;
  }
};

export const getHistory = async ({ uid }) => {
  try {
    const res = await axios.get(`${config.HISTORY_SVC_BASE_URL}/history-api/history?uid=${uid}`);
    return res.data;
  } catch (e) {
    console.log("Error: Unable to get user history", e.response.data);
    return e.response.data;
  }
};