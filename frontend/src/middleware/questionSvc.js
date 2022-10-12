import axios from "axios";
import configs from "../utils/configs";

const config = configs[process.env.NODE_ENV];

export const getRandomQuestion = async ({ matchId, difficulty }) => {
  try {
    const res = await axios.post(`${config.QUESTION_SVC_BASE_URL}/question-api/random-question`, {
      matchId,
      difficulty,
    });
    return res.data;
  } catch (e) {
    console.log("Error: Unable to get a random question", e.response.data);
    return e.response.data;
  }
};
