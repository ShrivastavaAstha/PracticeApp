const express = require("express");
const app = express();
app.use(express.json());
const cookies = require("cookie-parser");
const { connectDatabase } = require("./connection/connect");
const registermodel = require("./models/registered_data");
const verifyToken = require("./tokens/verifyToken");
const generateToken = require("./tokens/generateToken");
const { encryptPassword, verifyPassword } = require("./functions/encryption");
const { FormatAlignJustifyRounded } = require("@mui/icons-material");

//--------------------middleware----------------

const checkIfUserLoggedIn = (req, res, next) => {
  if (verifyToken(req.cookies.auth_tk)) {
    const userinfo = verifyToken(req.cookies.auth_tk);
    req.userid = userinfo.indexOf;
    next();
  } else {
    return res.status(400).json({ success: false, error: "UNAUTHORIZED" });
  }
};

//--------------------public api----------------
app.get("/public", checkUserLoggedIn, (req, res) => {
  try {
    return res.json({ success: true, message: "Hello from the public side" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

//--------------------signup api----------------
app.post("/api/signup", async (req, res) => {
  try {
    const { email } = req.body;
    const userEmailExist = await registermodel.findOne({ email });
    if (userEmailExist) {
      return res.json({ message: "Email already Exist" });
    }
    const obj = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      dob: req.body.dob,
      contact: req.body.contact,
    };
    console.log(obj);
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
      const registerdata = new registermodel(obj);
      await registerdata.save();
      return res.status(200).json({ success: true, message: "Data saved" });
    } else {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email } = req.body;
    let inputpassword = req.body.password;
    const checkuser = await registermodel.findOne({ email: email });

    if (!checkuser) {
      return res.status(400).json({
        success: false,
        error: "User not found, please signup first!",
      });
    }
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

//for mfa verification-------------------------

app.post("/api/mfaverify", async (req, res) => {
  try {
    let email = req.body.email;
    let inputpassword = req.body.password;
    let code = req.body.code;
    const checkuser = await registermodel.findOne({ email: email });
    if (!checkuser) {
      return res
        .status(400)
        .json({ success: false, error: "User not found, please signup first" });
    }
    let originalpassword = checkuser.password;

    if (await verifyPassword(inputpassword, originalpassword)) {
      const token = generateToken(checkuser._id);
      res.cookie("auth_tk", token);
      console.log(token);
      return res.json({ success: true, message: "Logged in successfully." });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//current user api-------------------------------------

app.get("/currentuser", checkIfUserLoggedIn, async (req, res) => {
  try {
    const userid = req.userid;
    const userdetails = await registermodel.findOne({ _id: userid });
    if (userdetails) {
      return res.json({ success: true, data: userdetails });
    } else {
      return res.status(400).json({ success: false, error: "User not found" });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});

//Public api-------------------------------------------

app.get("/api/public", (req, res) => {
  try {
    return res.json({ success: true, message: "Hello from Profile" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
});

//logout api -------------------------------------------
app.get("/logout", (req, res) => {
  try {
    res.clearCookie("auth_tk");
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, error: error.message });
  }
});
const PORT = 6000;
connectDatabase();
app.listen(PORT, async () => {
  await console.log(`Server is running at ${PORT}`);
});
