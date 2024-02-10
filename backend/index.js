const express = require("express");
const app = express();
app.use(express.json());
const { connectDatabase } = require("./connection/connect");
const registermodel = require("./models/registered_data");

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

app.get("/api/public", (req, res) => {
  try {
    return res.json({ success: true, message: "Hello from Profile" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, error: error.message });
  }
});
const PORT = 6000;
connectDatabase();
app.listen(PORT, async () => {
  await console.log(`Server is running at ${PORT}`);
});
