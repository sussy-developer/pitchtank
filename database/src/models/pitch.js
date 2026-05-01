const mongoose = require('mongoose')


const versionSchema = new mongoose.Schema({
    versionNumber: {
        type: Number,
        required: true,
    },
    fileURL: {
        type: String,
        required: [true, "File URL is required"],
    },
    overallScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const pitchSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User Id is required"],
        index: true,
    },
    startupName: {
        type: String,
        required: [true, "Pitch title is required"],
        trim: true,
        minlength: [3, "Title must be atleast 3 characters"],
        maxlength: [100, "Title cannpt exceed 150 characters"],
    },
    industry: {
        type: String,
        required: [true, "Industry is required"],
        enum: ["tech", "healthcare", "fintech", "edtech", "ecommerce", "saas",
            "food", "travel", "medical", "sustainability", "other"],
    },
    stage:{
        type:String,
        required:true,
        enum:["Idea","MVP","Early Revenue","Scaling"]
    },
    tagLine:{
        type:String,
        required:true,
        maxlength:[150, "Tagline lust be less than 150 characters"]
    },
    problemSolvingDescription: {
    type: String,
    required: true,
    validate: {
        validator: function (value) {
        if (!value) return  "The problem you solving must not empty"
        const wordCount = value.trim().split(/\s+/).length;
        return wordCount <= 150; // enforce 150-word limit
        },
            message: "Problem description must not exceed 150 words",
    },
    },

       fundingAsk: {
        type: Number,
        default: 0,
        validate:{
            validator:(value)=>{
                return value>=0;
            },
            message:"Funding ask must be  a positive number",
        },
        },
        
        description: {
        type: String,
        trim: true,
        maxlength: 1000,
        },
        fileURL: {
        type: String,
        required: [true, "Pitch deck file is required"],
        },
        fileType: {
        type: String,
        enum: ["pptx", "ppt", "pdf"],
        required: true,
        },
        slideCount:{
            type:Number,
            min:0,
            max:7,
            default:0,

        },
        currentVersion:{
            type:Number,
            default:1,
        },
        latestScore:{
            type:Number,
            max:100,
            min:0,
            default:0
        },
        status:{
            type:String,
            enum:["draft","processing","analyzed","failed"],
            default:"draft",
        },
        isPublic:{
            type:Boolean,
            default:true,
        },
        versions:[versionSchema],
    },
    {
        timestamps:true,
    }
);

pitchSchema. index({ userId: 1, createdAt: -1 });
pitchSchema. index({ isPublic: 1, latestScore: -1 }); // leaderboard
pitchSchema. index({ status: 1 });
pitchSchema. index({ industry: 1 });

module.exports = mongoose.model("Pitch",pitchSchema);