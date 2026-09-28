const { Schema, model } = require("mongoose");

const protocolschema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
   date: {
    type: Date,
    default: Date.now
  },
    time: {
    type: String,
    default: function() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 || 12; 
      return `${formattedHours}:${minutes} ${ampm}`;
    }
  }

},{timestamps:true}) 

const Protocol=model("SecurityProtocol",protocolschema)
module.exports=Protocol