
const router=require("express").Router()
const ctrl=require("../controllers/taskController")
const auth=require("../middleware/auth")

router.get("/",auth,ctrl.getTasks)
router.post("/",auth,ctrl.createTask)
router.patch("/:id",auth,ctrl.updateTask)
router.delete("/:id",auth,ctrl.deleteTask)

module.exports=router
