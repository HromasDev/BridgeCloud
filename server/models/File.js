const { Schema, model } = require("mongoose");

const File = new Schema({
    user: { type: String, required: true, unique: false},
    name: { type: String, required: true, unique: false },
    type: { type: String, required: true, unique: false},
    folder: { type: String, required: true, unique: false },
    ext: { type: String, required: false, unique: false },
    size: { type: Number, required: false, unique: false },
    document_id: { type: Number, required: false, unique: false },
    url: { type: String, required: false, unique: false }
})

module.exports = model('file', File);
