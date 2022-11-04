import axios from "axios";
import configs from "../utils/configs";
import { getToken } from "../utils/localStorageUtils";

const config = configs[process.env.NODE_ENV];

export const changeUserPassword = async ({ currPassword, newPassword }) => {
  try {
    const res = await axios.patch(`${config.USER_SVC_BASE_URL}/user-api/user`, {
      token: getToken(),
      currPassword,
      newPassword,
    });
    return res.data;
  } catch (e) {
    console.log("Error: Unable to change new password", e.response.data);
    throw e.response.data;
  }
};

export const deleteUser = async () => {
  try {
    const res = await axios.delete(`${config.USER_SVC_BASE_URL}/user-api/user`, {
      data: {
        token: getToken(),
      },
    });
    return res.data;
  } catch (e) {
    console.log("Error: Unable to delete user", e.response.data);
    throw e.response.data;
  }
};
