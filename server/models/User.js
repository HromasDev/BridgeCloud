const { Schema, model } = require("mongoose");

const User = new Schema({
    login: { type: String, required: true, unique: true },
    name: { type: String, required: false, unique: false },
    password: { type: String, required: true, unique: false },
    photo: { type: String, required: false, unique: false },
    vk_id: { type: String, required: false, unique: false },
    role: { type: String, required: true, unique: false },
    created_at: { type: String, required: true, unique: false }
})

module.exports = model('users', User);