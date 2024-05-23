import { asyncHandler } from "../utils/asyncHandler.js";

const registerUser = asyncHandler(async (req, res) => {
  console.log("User registration endpoint hit");

  res.status(200).json({
    message: "Ok",
  });
});

export { registerUser };
