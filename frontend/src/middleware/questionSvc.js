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
    throw e.response.data;
  }
};

export const getQuestionDetails = async ({ qid }) => {
  try {
    const res = await axios.post(`${config.QUESTION_SVC_BASE_URL}/question-api/question-by-id`, {
      qid,
    });
    return res.data;
  } catch (e) {
    console.log("Error: Unable to get question details", e.response.data);
    return e.response.data;
  }
};

export const deleteAssignedQuestion = async (matchId) => {
  try {
    const res = await axios.delete(
      config.QUESTION_SVC_BASE_URL + "/question-api/assigned-question",
      {
        data: {
          matchId,
        },
      },
    );
    return res.data;
  } catch (e) {
    console.log("Error: Unable to delete assigned question", e.response.data);
    return e.response.data;
  }
};
