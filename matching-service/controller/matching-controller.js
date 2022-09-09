async function findMatch(req, res) {
  const { userID } = req.body;
  if (userID) {
    // Todo: Call orm method to add user to waiting room
    
  } else {
    return res
      .status(500)
      .json({ message: "User ID not found!"})
  }
  return res.status(200);
}