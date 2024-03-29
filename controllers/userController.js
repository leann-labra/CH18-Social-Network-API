const { Users } = require("../models");

module.exports = {
  // get all users
  getAllUsers(res) {
    Users.find({})
      .then(async (users) => {
        res.json(users);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // get one user by id
  getUserById(req, res) {
    Users.findOne({ _id: req.params.userId })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((user) => {
        !user
          ? res.status(404).json({ message: "No User find with that ID!" })
          : res.json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // create a new user
  createUser(req, res) {
    Users.create(req.body)
      .then((users) => res.json(users))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // update user by id
  updateUser({ params, body }, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  // delete user by id
  deleteUser({ params }, res) {
    Users.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: "User and Thought deleted!" }))
      .catch((err) => res.status(500).json(err));
  },
  // add a friend to a user's friend list
  addFriend({ params }, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // remove a friend from a user's friend list
  removeFriend({ params }, res) {
    Users.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No User find with this ID!" })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
