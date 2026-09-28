const VisitorController= require("../controller/visitor.controller");
const { auth, IsSecurity } = require("../middleware/auth");
const router=require("express").Router()
//add visitor
router.post("/addvisitor",auth,VisitorController.CreateVisitor)
//get visitor
router.get("/viewvisitor",auth,VisitorController.GetAllVisitor)

//update visitor
router.patch("/visitor/:id", auth, VisitorController.UpdateVisitor)
//delete visitor
router.delete("/visitor/:id", auth, VisitorController.DeleteVisitor)

//filter data
router.get("/filter",auth,IsSecurity,VisitorController.FilterVisitor)
module.exports=router;