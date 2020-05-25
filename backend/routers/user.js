const express = require("express");
const User = require("./../models/user");
const auth = require("./../middleware/auth");

const router = express.Router();

router.post("/user", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    const token = await user.generateAuthentication();
    res.status(201).send({ user, token });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});
router.post("/user/login", async (req, res) => {
  try {
    const user = await User.findToLogin(req.body);
    const token = await user.generateAuthentication();
    res.status(200).send({ user, token });
  } catch (e) {
    console.log(e);
    res.status(404).send({ error: e.toString() });
  }
});
router.post("/user/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/user/find", async (req, res) => {
  try {
    const users = await User.find({ name: RegExp(req.body.username) });
    if (!users.toString()) {
      res
        .status(404)
        .send("No users with this name \n Remember letter case have matter");
    } else res.status(200).send(users);
  } catch (error) {
    res.send(error);
  }
});

router.get("/user/logged_in", auth, async (req, res) => {
  try {
    if (req.token) {
      const data = {
        logged_in: true,
        user: req.user,
      };
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/user/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/user/me", auth, async (req, res) => {
  res.send(req.user);
});

router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user ? res.status(201).send(user) : res.status(404).send("User not find");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/user/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
