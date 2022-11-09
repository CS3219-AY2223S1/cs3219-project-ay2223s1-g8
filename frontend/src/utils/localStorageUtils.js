/*
 * handles token (token expiries in 2h)
 */
const tokenExpiryMin = 120;
const tokenExpiryMs = tokenExpiryMin * 60000;

const TOKEN = "token";

export const storeToken = (token) => {
  const tokenWExpiry = {
    value: token,
    expiry: Date.now() + tokenExpiryMs,
  };
  localStorage.setItem(TOKEN, JSON.stringify(tokenWExpiry));
};

export const hasToken = () => getToken() !== null;

export const getToken = () => {
  const tokenWExpiryStr = localStorage.getItem(TOKEN);

  if (!tokenWExpiryStr) {
    return null;
  }
  const tokenWExpiry = JSON.parse(tokenWExpiryStr);
  if (Date.now() > tokenWExpiry.expiry) {
    localStorage.removeItem(TOKEN);
    return null;
  }
  return tokenWExpiry.value;
};

export const deleteToken = () => {
  if (hasToken()) {
    localStorage.removeItem(TOKEN);
  }
};

/*
 * handles username
 */
const USERNAME = "username";

export const storeUsername = (username) => {
  localStorage.setItem(USERNAME, username);
};

export const getUsername = () => {
  return localStorage.getItem(USERNAME);
};

export const deleteUsername = () => {
  localStorage.removeItem(USERNAME);
};
