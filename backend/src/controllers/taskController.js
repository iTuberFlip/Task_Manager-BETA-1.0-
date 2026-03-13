
const prisma=require("../db/prisma")

exports.getTasks=async(req,res)=>{
    const tasks=await prisma.task.findMany({where:{userId:req.user.id}})
    res.json(tasks)
}

exports.createTask=async(req,res)=>{
    const count=await prisma.task.count({where:{userId:req.user.id}})
    const task=await prisma.task.create({
    data:{title:req.body.title,userId:req.user.id,order:count+1}
    })
    req.io.to(req.user.id).emit("newTask",task)
    res.json(task)
}

exports.deleteTask = async (req, res) => {
    const { id } = req.params
    try {
        await prisma.task.delete({ where: { id } })
        res.json({ ok: true })
    } catch (err) {
        res.status(404).json({ error: "Task no encontrada" })
    }
}

exports.updateTask = async (req, res) => {
    const { id } = req.params
    const { completed } = req.body

    try {
        const task = await prisma.task.update({
        where: { id },
        data: { completed }
        })
        // Devuelve la tarea actualizada
        res.json(task)
    } catch (err) {
        res.status(404).json({ error: "Task no encontrada" })
    }
}
