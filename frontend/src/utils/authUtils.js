import axios from "axios";
import { USER_SVC_BASE_URL } from "./configs";

export const checkUsernameAvailability = async (username) => {
  try {
    const response = await axios.post(`${USER_SVC_BASE_URL}/api/username`, { username });
    return !response.data;
  } catch (e) {
    console.log("Error: Unable to check username", e.response.data);
    return false;
  }
};
