const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  kebab: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Kebab",
    },
  ],
  username: {
    type: String,
    required: [true, "Username must be provided"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email must be provided"],
    unique: true,
  },
  passwordHash: { type: String, required: [true, "Password must be provided"] },
  verified: {
    type: Boolean,
    default: false,
  },
  verifyHash: {
    type: String,
    required: true,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  },
});

module.exports = mongoose.model("User", userSchema);
