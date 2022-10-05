import axios from "axios";
import { QUESTION_SVC_BASE_URL } from "../utils/configs";

export const getRandomQuestion = async ({ matchId, difficulty }) => {
  try {
    const res = await axios.post(`${QUESTION_SVC_BASE_URL}/api/random-question`, {
      matchId,
      difficulty,
    });
    return res.data;
  } catch (e) {
    console.log("Error: Unable to get a random question", e.response.data);
    return e.response.data;
  }
};
