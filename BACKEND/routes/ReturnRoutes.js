const express =require ("express");
const router =express.Router();

const ReturnControl=require("../controllers/ReturnControl");


router.get("/",ReturnControl.getAllReturn);
router.post("/",ReturnControl.addReturn);
router.get("/:id",ReturnControl.getById);
router.put("/:id",ReturnControl.updateReturn);
router.delete('/:id', ReturnControl.deleteReturn); 
router.post('/returns',ReturnControl.createReturnOrder);


router.put('/:id/approve', ReturnControl.approveReturn);
router.put('/:id/reject', ReturnControl.rejectReturn);


module.exports = router;

