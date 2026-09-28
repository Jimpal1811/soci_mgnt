
const jwt=require("jsonwebtoken");
const User = require("../models/user.schema");
const Guard = require("../models/SecurityGuard.model");
const Owner = require("../models/Owener.model");
const Tenante = require("../models/Tenent.model");

exports.auth = async (req, res, next) => {
    try {
      
      const token = req.cookies['society-auth'] || req.headers.authorization?.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({ success: false, message: 'Authorization denied, no token provided' });
      }
  
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
     
      let user = await User.findById(decoded.userId);

   
    if (!user) {
      user = await Guard.findById(decoded.userId);
    }
    if (!user) {
      user = await Owner.findById(decoded.userId);
    }
    if (!user) {
      user = await Tenante.findById(decoded.userId);
    }

    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
  
      
      req.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error.message);
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
  };
  

  exports.IsAdmin = (req, res, next) => {
      
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized, no user found" });
    }
  
    
    if (req.user.role === "admin") {
      next();
    } else {
     
      
      return res.status(403).json({ success: false, message: "You are not authorized to access this resource" });
    }
  };
  exports.IsResident = (req, res, next) => {
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized, no user found" });
      }
    
      
      if (req.user.role === "resident") {
        next();
      } else {
        console.log(error);
        
        return res.status(403).json({ success: false, message: "You are not authorized to access this resource" });
      }
    };

    
    exports.IsSecurity = (req, res, next) => {
      
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized, no user found" });
      }
    
      
      if (req.user.role === "security") {
        next();
      } else {
        return res.status(403).json({ success: false, message: "You are not authorized to access this resource" });
      }
    };

    