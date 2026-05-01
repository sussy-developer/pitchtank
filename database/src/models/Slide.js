const mongoose = require("mongoose");

const slideSchema = new mongoose. Schema(
{
    pitchId: {
    type: mongoose. Schema. Types. ObjectId,
    ref: "Pitch",
    required: true,
    index: true,
    },
    versionNumber: {
    type: Number,
    required: true,
    },
    slideNumber: {
    type: Number,
    required: true,
    min: 1,
    },
    title: {
    type: String,
    trim: true,
    default: "",
    },
});

slideSchema. index({ pitchId: 1, versionNumber: 1, slideNumber: 1 });

module. exports = mongoose.model("Slide", slideSchema);