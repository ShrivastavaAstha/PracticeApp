const bcrypt = require("bcryptjs");

const encrypPassword = async (originalpassword) => {
  try {
    let encryptedPassword = await bcrypt.hash(originalpassword, 10);
    return encryptedPassword;
  } catch (error) {
    console.log(error);
  }
};
