const mongoose=require('mongoose');

const sharkVerdictSchema =new mongoose.Schema({
  sharkName:{type:String, required:true},
  persona:{type:String,required:true},
  verdict:{type:String,required:true},
  quote:{type:String,required:true},
  wouldInvest:{type:Boolean,required:true},
},
{_id:false}
);

const recommendedRoleSchema = new mongoose. Schema({

        role: { type: String, required: true },
        reason: { type: String, required: true },
        priority: {
        type: String,
        enum: ["critical", "important", "nice_to_have"],
        required: true,
    },
    },
    { _id: false }
);

const actionPlanSchema= new mongoose.Schema({
    step:{type:Number,required:true},
    description:{type:String,required:true},
    done:{type:Boolean,default:false},
},
{_id:false}
);

const reportSchema = new mongoose.Schema({
    pitchId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Pitch",
        required:true,
        index:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true,
    },
    versionNumber:{
        type:Number,
        required:true,
    },
    overallScore:{
        type:Number,
        required:true,
        min:0,
        max:100,
    },   
    verdict:{
        type:String,
        enum:["strong","promising","needs_work"],
        required:true,
     },
    
     categoryScores:{
        
     }
    
})