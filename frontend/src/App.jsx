import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Github, Linkedin, ExternalLink, Briefcase, GraduationCap, Code, Trophy, Activity } from 'lucide-react';
import pic from './assets/pic.jpg';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function App() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [profileRes, skillsRes] = await Promise.all([
        axios.get(`${API_BASE}/profile`),
        axios.get(`${API_BASE}/skills/top`)
      ]);
      setProfile(profileRes.data);
      setProjects(profileRes.data.projects || []);
      setTopSkills(skillsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedSkill(null);

    if (query.trim() === '') {
      setProjects(profile?.projects || []);
      return;
    }

    try {
      const res = await axios.get(`${API_BASE}/search?q=${query}`);
      setProjects(res.data.projects);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const handleSkillClick = async (skill) => {
    if (selectedSkill === skill) {
      setSelectedSkill(null);
      setProjects(profile?.projects || []);
      return;
    }

    setSelectedSkill(skill);
    setSearchQuery('');
    try {
      const res = await axios.get(`${API_BASE}/projects?skill=${skill}`);
      setProjects(res.data);
    } catch (error) {
      console.error('Skill filter error:', error);
    }
  };

  if (loading) {
    return (
      <div className="empty-state">
        <Activity className="animate-pulse" />
        <p>Loading Playground...</p>
      </div>
    );
  }

  return (
    <div>
      <nav>
        <div className="logo">PLAYGROUND</div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search projects or skills..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <Search size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        </div>
      </nav>

      <main className="container">
        {profile && (
          <section className="profile-grid">
            <div className="profile-image-container">
              <div className="glass-card" style={{ textAlign: 'center' }}>
                <div style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  margin: '0 auto 1.5rem',
                  border: '2px solid rgba(99, 102, 241, 0.5)'
                }}>
                  <img
                    src={pic}
                    alt={profile.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3>{profile.name}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>{profile.email}</p>
              </div>
            </div>
            <div className="profile-info">
              <h1>{profile.name}</h1>
              <div className="profile-meta">
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <GraduationCap size={18} /> {profile.education}
                </p>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>{profile.email}</p>
              </div>
              <div className="profile-links">
                {profile.github && <a href={profile.github} target="_blank" rel="noreferrer"><Github size={24} /></a>}
                {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer"><Linkedin size={24} /></a>}
                {profile.portfolio && <a href={profile.portfolio} target="_blank" rel="noreferrer"><ExternalLink size={24} /></a>}
              </div>

              <div style={{ marginTop: '2rem' }}>
                <h2><Code size={20} /> Skills</h2>
                <div className="skills-grid">
                  {profile.skills.split(',').map(skill => (
                    <span
                      key={skill}
                      className={`skill-badge ${selectedSkill === skill ? 'active' : ''}`}
                      onClick={() => handleSkillClick(skill.trim())}
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="projects">
          <h2 className="section-title"><Trophy size={20} /> Featured Projects</h2>
          {projects.length > 0 ? (
            <div className="projects-grid">
              {projects.map(project => {
                const links = JSON.parse(project.links);
                return (
                  <div key={project.id} className="glass-card project-card">
                    <h3>{project.title}</h3>
                    <p style={{ color: '#94a3b8', margin: '1rem 0', fontSize: '0.95rem' }}>{project.description}</p>
                    <div className="project-tags">
                      {project.skills.split(',').map(s => <span key={s} className="tag">{s.trim()}</span>)}
                    </div>
                    <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                      {links.github && <a href={links.github} className="btn btn-outline" target="_blank" rel="noreferrer"><Github size={16} /> Code</a>}
                      {links.demo && <a href={links.demo} className="btn btn-primary" target="_blank" rel="noreferrer"><ExternalLink size={16} /> Demo</a>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>No projects found matching your criteria.</p>
            </div>
          )}
        </section>

        {profile?.work?.length > 0 && (
          <section id="work">
            <h2 className="section-title"><Briefcase size={20} /> Work Experience</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {profile.work.map(job => (
                <div key={job.id} className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ color: '#818cf8' }}>{job.role}</h3>
                    <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{job.company}</span>
                  </div>
                  <p style={{ marginTop: '1rem', lineHeight: '1.6' }}>{job.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '4rem', color: '#64748b', fontSize: '0.875rem' }}>
        &copy; 2026 ME-API Playground. Built with React & Express.
      </footer>
    </div>
  );
}

export default App;
