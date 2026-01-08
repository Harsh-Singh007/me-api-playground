const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.skill.deleteMany({});
  await prisma.workExperience.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.profile.deleteMany({});

  const profile = await prisma.profile.create({
    data: {
      id: 1,
      name: "Harsh Singh",
      email: "harsh.65004@gmail.com",
      education: "Master of Computer Applications (MCA), Parul University (2026)",
      github: "https://github.com/Harsh-Singh007",
      linkedin: "https://linkedin.com/in/harsh-singh-626449235",
      portfolio: "https://harshsinghrajput.netlify.app",
      skills: "React.js,Node.js,Express.js,MongoDB,JavaScript,Java,Tailwind CSS,HTML,CSS,MySQL,Git,GitHub,DSA,OOP",
      work: {
        create: [
          {
            company: "TCA Technology",
            role: "Web Developer Intern (Oct 2023 - Mar 2024)",
            description: "Worked on a multi-vendor e-commerce platform using MERN stack. Developed core features, collaborated with designers/developers, managed MongoDB, and implemented JWT/OAuth authentication."
          },
          {
            company: "Intel® Unnati",
            role: "Industrial Training Intern (May 2023 - Jul 2023)",
            description: "Improved ATM operations using Finite State Machine (FSM). Designed optimized state transition logic, analyzed ATM functionalities, and proposed FSM-based solutions for banking systems."
          }
        ]
      },
      projects: {
        create: [
          {
            title: "VendorVista",
            description: "Multivendor E-commerce Platform with vendor dashboards, product management, and JWT-based role-based access.",
            links: JSON.stringify({ github: "https://github.com/Harsh-Singh007/Multivendor-site" }),
            skills: "React.js,Node.js,Express.js,MongoDB,Tailwind CSS"
          },
          {
            title: "Jobify",
            description: "Full-featured job portal enabling users to search, apply, and manage job applications with role-based access.",
            links: JSON.stringify({ github: "https://github.com/Harsh-Singh007/jobify" }),
            skills: "React.js,Node.js,Express.js,MongoDB,Tailwind CSS"
          },
          {
            title: "VenueVibe",
            description: "Event Venue Booking System with admin/vendor dashboards for venue listing and availability controls.",
            links: JSON.stringify({ github: "https://github.com/Harsh-Singh007/VenueVibe" }),
            skills: "React.js,Node.js,Express.js,MongoDB"
          },
          {
            title: "ATM - FSM",
            description: "Finite State Machine Based ATM System (Intel® Unnati Project) simulating withdrawal, deposit, and PIN validation.",
            links: JSON.stringify({ github: "https://github.com/Harsh-Singh007/intelrepo-ATM-FSM" }),
            skills: "FSM,System Design"
          },
          {
            title: "E-Voting System",
            description: "Secure Online Voting Platform with encrypted authentication and transparent vote-counting logic.",
            links: JSON.stringify({ github: "https://github.com/Harsh-Singh007/voting-website" }),
            skills: "React.js,Node.js,Encryption"
          }
        ]
      }
    }
  });

  const skills = [
    { name: "React.js", count: 95 },
    { name: "Node.js", count: 85 },
    { name: "Express.js", count: 80 },
    { name: "MongoDB", count: 85 },
    { name: "JavaScript", count: 90 },
    { name: "Tailwind CSS", count: 88 },
    { name: "Java", count: 75 }
  ];

  for (const skill of skills) {
    await prisma.skill.create({
      data: {
        name: skill.name,
        count: skill.count
      }
    });
  }

  console.log("Database seeded successfully with Harsh Singh's profile!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
