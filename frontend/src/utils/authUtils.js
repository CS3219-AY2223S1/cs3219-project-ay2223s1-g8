import axios from "axios";
import configs from "./configs";

const config = configs[process.env.NODE_ENV];

export const checkUsernameAvailability = async (username) => {
  try {
    const response = await axios.post(`${config.USER_SVC_BASE_URL}/user-api/username`, {
      username,
    });
    return !response.data;
  } catch (e) {
    console.log("Error: Unable to check username", e.response.data);
    return false;
  }
};
