"use client";

import React from "react";
import type { ResumeData } from "@/lib/resume-types";
import type { TemplateId } from "@/context/TemplateContext";

interface ResumeLayoutProps {
  data: ResumeData;
  variant: "live" | "preview";
  template?: TemplateId;
}

function SkillsSection({ skills }: { skills: ResumeData["skills"] }) {
  const hasSkills =
    skills.technical.length > 0 || skills.soft.length > 0 || skills.tools.length > 0;
  if (!hasSkills) return null;
  return (
    <section className="resume-section">
      <h2>Skills</h2>
      <div className="resume-skills-groups">
        {skills.technical.length > 0 && (
          <div className="resume-skill-group">
            <span className="resume-skill-group-label">Technical</span>
            <div className="resume-skill-pills">
              {skills.technical.map((s, i) => (
                <span key={i} className="resume-skill-pill">{s}</span>
              ))}
            </div>
          </div>
        )}
        {skills.soft.length > 0 && (
          <div className="resume-skill-group">
            <span className="resume-skill-group-label">Soft</span>
            <div className="resume-skill-pills">
              {skills.soft.map((s, i) => (
                <span key={i} className="resume-skill-pill">{s}</span>
              ))}
            </div>
          </div>
        )}
        {skills.tools.length > 0 && (
          <div className="resume-skill-group">
            <span className="resume-skill-group-label">Tools</span>
            <div className="resume-skill-pills">
              {skills.tools.map((s, i) => (
                <span key={i} className="resume-skill-pill">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function ResumeLayout({ data, variant, template = "classic" }: ResumeLayoutProps) {
  const { personal, summary, education, experience, projects, skills, links } = data;
  const isModern = template === "modern";

  const header = (
    <header className="resume-header">
      <h1 className="resume-name">{personal.name || "Your Name"}</h1>
      <div className="resume-contact">
        {personal.email && <span>{personal.email}</span>}
        {personal.phone && <span>{personal.phone}</span>}
        {personal.location && <span>{personal.location}</span>}
      </div>
    </header>
  );

  const mainSections = (
    <>
      {summary && (
        <section className="resume-section">
          <h2>Summary</h2>
          <p>{summary}</p>
        </section>
      )}
      {education.length > 0 && (
        <section className="resume-section">
          <h2>Education</h2>
          {education.map((e, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-header">
                <strong>{e.school || "School"}</strong>
                <span>{e.dates}</span>
              </div>
              <div className="resume-entry-sub">{e.degree}</div>
              {e.details && <p>{e.details}</p>}
            </div>
          ))}
        </section>
      )}
      {experience.length > 0 && (
        <section className="resume-section">
          <h2>Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="resume-entry">
              <div className="resume-entry-header">
                <strong>{e.company || "Company"}</strong>
                <span>{e.dates}</span>
              </div>
              <div className="resume-entry-sub">{e.role}</div>
              {e.details && <p>{e.details}</p>}
            </div>
          ))}
        </section>
      )}
      {projects.length > 0 && (
        <section className="resume-section">
          <h2>Projects</h2>
          <div className="resume-projects-grid">
            {projects.map((p, i) => (
              <div key={i} className="resume-project-card">
                <div className="resume-project-card-header">
                  <strong>{p.name || "Project"}</strong>
                  <div className="resume-project-links">
                    {p.liveUrl && (
                      <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" title="Live">
                        ↗ Live
                      </a>
                    )}
                    {p.githubUrl && (
                      <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub">
                        ↗ GitHub
                      </a>
                    )}
                    {!p.liveUrl && !p.githubUrl && p.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" title="Link">
                        ↗
                      </a>
                    )}
                  </div>
                </div>
                {p.description && <p className="resume-project-desc">{p.description}</p>}
                {p.techStack && p.techStack.length > 0 && (
                  <div className="resume-project-tech">
                    {p.techStack.map((t, j) => (
                      <span key={j} className="resume-tech-pill">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      {!isModern && <SkillsSection skills={skills} />}
      {(links.github || links.linkedin) && (
        <section className="resume-section">
          <h2>Links</h2>
          <div className="resume-links-list">
            {links.github && (
              <a href={links.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            )}
            {links.linkedin && (
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            )}
          </div>
        </section>
      )}
    </>
  );

  const isEmpty =
    !personal.name &&
    !summary &&
    education.length === 0 &&
    experience.length === 0 &&
    projects.length === 0 &&
    skills.technical.length === 0 &&
    skills.soft.length === 0 &&
    skills.tools.length === 0 &&
    !links.github &&
    !links.linkedin;

  return (
    <article className={`resume-layout ${variant} template-${template}`}>
      {isModern ? (
        <div className="resume-modern-grid">
          <div className="resume-sidebar">
            {header}
            <SkillsSection skills={skills} />
          </div>
          <div className="resume-main">{mainSections}</div>
        </div>
      ) : (
        <>
          {header}
          {mainSections}
        </>
      )}
      {isEmpty && <div className="resume-empty">Resume content will appear here</div>}
    </article>
  );
}
