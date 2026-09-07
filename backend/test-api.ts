import axios from 'axios';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
  // Get an existing user and resume
  const user = await prisma.user.findFirst();
  if (!user) {
    console.log("No user found snippet!");
    return;
  }
  const resume = await prisma.resume.findFirst({ where: { userId: user.id }});
  if (!resume) {
    console.log("No resume found snippet!");
    return;
  }
  
  console.log("Found resume:", resume.id);
  
  // Mock auth token (since it's purely internal, we might have to bypass auth or sign a real JWT)
  // Let's just sign a real JWT!
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "dummysecret", { expiresIn: '1h' });
  
  try {
    const res = await axios.patch(`http://localhost:5000/api/resumes/${resume.id}`, {
      parsedData: resume.parsedData,
      templateId: resume.templateId,
      title: resume.title
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("PATCH Success!", res.data);
  } catch (e: any) {
    console.error("PATCH Failed!", e.response?.status, e.response?.data || e.message);
  }
}
run();
