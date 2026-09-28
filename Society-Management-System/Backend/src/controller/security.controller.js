const Protocol = require("../models/SecurityProtocol.model");
const cloudinary = require('../utils/cloudinary');
const fs = require("fs")
const twilio = require("twilio");
const crypto = require("crypto");
const { hash } = require("../utils/hashpassword");
const senData = require("../config/mail");
const Guard = require("../models/SecurityGuard.model");
const { ForgotFormatSecurity } = require("../utils/securityUi");
const accountsid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient =
  accountsid && authToken
    ? new twilio(accountsid, authToken)
    : null;
//create protocol
exports.CreateProtocol = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const protocol = new Protocol({
            title,
            description,
        })

        await protocol.save();

        if (!protocol) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Protocol successfully Added"
        })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "error in protocol creating"
        });
    }
}
//get protocol 
exports.GetAllProtocol = async (req, res) => {
    try {
        const find = await Protocol.find().sort({ date: 1 });
        if (!find) {
            return res.status(400).json({
                success: false,
                message: "No data found"
            })
        }
        return res.status(200).json({
            success: true,
            Protocol: find
        })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "error in protocol find"
        });
    }
}
//get By Id protocol
exports.GetByIdProtocol = async (req, res) => {
    try {
        const find = await Protocol.findById(req.params.id).sort({ date: 1 });
        if (!find) {
            return res.status(400).json({
                success: false,
                message: "No data found"
            })
        }
        return res.status(200).json({
            success: true,
            Protocol: find
        })
    } catch (error) {
       
        return res.status(500).json({
            success: false,
            message: "error in protocol find"
        });
    }
}
//delete protocol
exports.DeleteProtocol = async (req, res) => {
    try {
        const find = await Protocol.findByIdAndDelete(req.params.id);
        if (!find) {
            return res.status(400).json({
                success: false,
                message: "No data found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Protocol are deleted"
        })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "error in protocol delete"
        });
    }
}
//update protocol
exports.UpdateProtocol = async (req, res) => {
    try {
        const { title, description, date, time } = req.body;
        if (!title || !description || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const protocol = await Protocol.findByIdAndUpdate(req.params.id, {
            title,
            description,
            date,
            time
        }, { new: true })

        if (!protocol) {
            return res.status(400).json({
                success: false,
                message: "Something went wrong"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Protocol successfully updated"
        })
    } catch (error) {
        
        return res.status(500).json({
            success: false,
            message: "error in protocol updated"
        });
    }
}
// add security guard
exports.CreateSecurityGuard = async (req, res) => {
   try {
     function generatePassword(length = 6) {
         const password = crypto.randomInt(0, Math.pow(10, length)).toString();
         return password.padStart(length, "0")
     }
     const {
         full_name,
         MailOrPhone,
         gender,
         shift,
         date,
         time,
         role,
     } = req.body;
     const password = generatePassword();
   
 
     const hashpassword = await hash(password)
 
     const uploadAndDeleteLocal = async (fileArray) => {
         if (fileArray && fileArray[0]) {
             const filePath = fileArray[0].path;
             try {
                 // Upload to Cloudinary
                 const result = await cloudinary.uploader.upload(filePath);
                 // Delete from local server
                 fs.unlink(filePath, (err) => {
                     if (err) console.error("Error deleting file from server:", err);
                     else console.log("File deleted from server:", filePath);
                 });
                 return result.secure_url;
             } catch (error) {
                 console.error("Error uploading to Cloudinary:", error);
                 throw error;
             }
         }
         return '';
     };
 
     // Upload images to Cloudinary and delete local files
     const profileimage = await uploadAndDeleteLocal(req.files?.profileimage);
     const adhar_card = await uploadAndDeleteLocal(req.files?.adhar_card);
     if (
         !full_name ||
         !MailOrPhone ||
         !gender ||
         !shift ||
         !date ||
         !time ||
         profileimage === null ||
         adhar_card === null
     ) {
         return res.status(400).json({
             success: false,
             message: "All fields are required",
         });
     }
   
     const newOwner = new Guard({
         full_name,
         MailOrPhone,
         gender,
         shift,
         date,
         time,
         profileimage,
         adhar_card,
         role:role || "security",
         password: hashpassword
     });
 
 
     await newOwner.save();
     let user;
     if (MailOrPhone.includes("@")) {
       
        
         await senData(newOwner.MailOrPhone, "Registration Successfully" ,ForgotFormatSecurity(newOwner.full_name,newOwner.MailOrPhone,password));
       
     } else {
      
       // Send OTP via SMS
       await twilioClient.messages.create({
         body: `You have successfully registered as a security. Your login details are as follows UserName ${MailOrPhone} & Password is <b> ${password}</b>\n\nPlease keep this information secure.\n\nBest Regards,\nManagement`,
         to: MailOrPhone, // Phone number
         from: process.env.TWILIO_PHONE_NUMBER,
       });
 
      
 }
 
  return res.status(200).json({
     success:true,
     message:"Security Guard Successfully added"
  })
   } catch (error) {
    
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
   }
}

//get a security Guard
exports.GetSecurityGuard= async (req,res)=>{
    try {
        const find= await Guard.find();
        if(!find){
            return res.status(400).json({
                success:false,
                message:"No data found"
            })
        }
        return res.status(200).json({
            success:true,
            Guard:find
        })
    } catch (error) {
     
        return res.status(500).json({
             success: false,
             message: "error in Announcement fetching"
         });
    }
}
exports.GetByIdGuard= async (req,res)=>{
    try {
        const find= await Guard.findById(req.params.id);
        if(!find){
            return res.status(400).json({
                success:false,
                message:"No data found"
            })
        }
        return res.status(200).json({
            success:true,
            Guard:find
        })
    } catch (error) {
       
        return res.status(500).json({
             success: false,
             message: "error in Announcement fetching"
         });
    }
}
exports.DeleteGuard= async (req,res)=>{
    try {
        const find= await Guard.findByIdAndDelete(req.params.id);
        if(!find){
            return res.status(400).json({
                success:false,
                message:"No data found"
            })
        }
        return res.status(200).json({
            success:true,
            message:"Security Guard deleted"
        })
    } catch (error) {
       
        return res.status(500).json({
             success: false,
             message: "error in Announcement deleting"
         });
    }
}
exports.updateSecurityGuard = async (req, res) => {
    const { id } = req.params; 
    const {
        full_name,
        MailOrPhone,
        gender,
        shift,
        date,
        time,
        role,
    } = req.body;

    try {
        
        const guard = await Guard.findById(id);
        if (!guard) {
            return res.status(404).json({
                success: false,
                message: "Security Guard not found"
            });
        }

      
        const uploadAndDeleteLocal = async (fileArray) => {
            if (fileArray && fileArray[0]) {
                const filePath = fileArray[0].path;
                try {
                    const result = await cloudinary.uploader.upload(filePath);
                    fs.unlink(filePath, (err) => {
                        if (err) console.error("Error deleting file from server:", err);
                    });
                    return result.secure_url;
                } catch (error) {
                   
                    throw error;
                }
            }
            return '';
        };

        
        if (full_name) guard.full_name = full_name;
        if (MailOrPhone) guard.MailOrPhone = MailOrPhone;
        if (gender) guard.gender = gender;
        if (shift) guard.shift = shift;
        if (date) guard.date = date;
        if (time) guard.time = time;
        if (role) guard.role = role || guard.role;

        
        if (req.files?.profileimage) {
            guard.profileimage = await uploadAndDeleteLocal(req.files.profileimage);
        }

       
        if (req.files?.adhar_card) {
            guard.adhar_card = await uploadAndDeleteLocal(req.files.adhar_card);
        }

       
        await guard.save();

        return res.status(200).json({
            success: true,
            message: "Security Guard details updated successfully",
            
        });
    } catch (error) {
       
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating Security Guard details",
        });
    }
};