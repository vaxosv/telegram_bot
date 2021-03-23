const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    chatId: String,
});

module.exports = { UserSchema };
