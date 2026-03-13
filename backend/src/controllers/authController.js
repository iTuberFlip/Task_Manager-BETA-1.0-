
const prisma=require("../db/prisma")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

exports.register=async(req,res)=>{
 const {email,password}=req.body
 const hash=await bcrypt.hash(password,10)
 const user=await prisma.user.create({data:{email,password:hash}})
 res.json({id:user.id})
}

exports.login=async(req,res)=>{
 const {email,password}=req.body
 const user=await prisma.user.findUnique({where:{email}})
 if(!user) return res.status(401).json({error:"Invalid"})
 const ok=await bcrypt.compare(password,user.password)
 if(!ok) return res.status(401).json({error:"Invalid"})
 const token=jwt.sign({id:user.id},process.env.JWT_SECRET)
 res.json({token,user:{id:user.id}})
}
