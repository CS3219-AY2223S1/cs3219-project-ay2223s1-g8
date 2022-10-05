import axios from "axios";
import { API_URL } from "./configs";

export const checkUsernameAvailability = async (username) => {
  try {
    const response = await axios.post(`${API_URL}/user-api/username`, { username });
    return !response.data;
  } catch (e) {
    console.log("Error: Unable to check username", e.response.data);
    return false;
  }
};
