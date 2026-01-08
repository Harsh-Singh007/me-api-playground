const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get Profile
app.get('/profile', async (req, res) => {
    try {
        const profile = await prisma.profile.findFirst({
            where: { id: 1 },
            include: {
                projects: true,
                work: true
            }
        });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create/Update Profile
app.post('/profile', async (req, res) => {
    const { name, email, education, github, linkedin, portfolio, skills } = req.body;
    try {
        const profile = await prisma.profile.upsert({
            where: { id: 1 },
            update: { name, email, education, github, linkedin, portfolio, skills },
            create: { id: 1, name, email, education, github, linkedin, portfolio, skills },
        });
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Projects with skill filter
app.get('/projects', async (req, res) => {
    const { skill } = req.query;
    try {
        const projects = await prisma.project.findMany({
            where: skill ? {
                skills: {
                    contains: skill
                }
            } : {}
        });
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Top Skills
app.get('/skills/top', async (req, res) => {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { count: 'desc' },
            take: 10
        });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Search
app.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { title: { contains: q } },
                    { description: { contains: q } },
                    { skills: { contains: q } }
                ]
            }
        });
        const work = await prisma.workExperience.findMany({
            where: {
                OR: [
                    { company: { contains: q } },
                    { role: { contains: q } },
                    { description: { contains: q } }
                ]
            }
        });
        res.json({ projects, work });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
