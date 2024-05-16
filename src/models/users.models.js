import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String, // cloudinary url
      required: true,
    },
    coverImage: {
      type: String, // cloudinary url
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // we will only encrypt password when "password" field is updated/modified in the DB, and not on every updation in DB.
  if (!this.isModified("password")) return next();

  this.pasword = await bcrypt.hash(this.password, 10);
  next();
});

//way to inject methods to schema .... userSchema.methods.name
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// generateAccessToken: This method creates an access token, which is a short-lived token used by a user to access protected resources on a server. It includes some user-specific information like the user's ID, email, username, and full name. Access tokens typically have a shorter expiration time to enhance security. They are used frequently and are refreshed often.
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// This method creates a refresh token, which is a long-lived token used to obtain a new access token once the current access token expires. Refresh tokens are generally stored securely on the client-side (like in a cookie or local storage) and are used to request a new access token without needing the user to re-enter their credentials. Refresh tokens typically have a longer expiration time compared to access tokens. They are less frequently used and are only exchanged for a new access token when needed
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
