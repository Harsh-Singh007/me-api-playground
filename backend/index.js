const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Fix for Prisma + SQLite on Vercel
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');
process.env.DATABASE_URL = `file:${dbPath}`;

const { PrismaClient } = require('@prisma/client');
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the ME-API Playground Backend',
        endpoints: ['/health', '/profile', '/projects', '/skills/top', '/search', '/seed-db', '/debug-paths'],
        status: 'running'
    });
});

app.get('/debug-paths', (req, res) => {
    res.json({
        cwd: process.cwd(),
        dirname: __dirname,
        exists: {
            prisma: require('fs').existsSync(path.join(process.cwd(), 'prisma')),
            db: require('fs').existsSync(path.join(process.cwd(), 'prisma', 'dev.db')),
            seed: require('fs').existsSync(path.join(process.cwd(), 'prisma', 'seed.js'))
        }
    });
});

// Seed trigger for production
app.get('/seed-db', async (req, res) => {
    try {
        const { exec } = require('child_process');
        exec('node prisma/seed.js', (error, stdout, stderr) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            res.json({ message: 'Seeding successful', output: stdout });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
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

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

module.exports = app;
