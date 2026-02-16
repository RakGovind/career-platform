"use client";

import React, { useState } from "react";
import { useResume } from "@/context/ResumeContext";
import { emptyProject, type ProjectEntry } from "@/lib/resume-types";
import { BulletGuidance } from "./BulletGuidance";
import { SkillTagInput } from "./SkillTagInput";

const DESC_MAX = 200;

export function ProjectsSection() {
  const { data, updateData } = useResume();
  const { projects } = data;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const addProject = () => {
    const next = [...projects, { ...emptyProject }];
    updateData({ projects: next });
    setOpenIndex(next.length - 1);
  };

  const removeProject = (i: number) => {
    updateData({ projects: projects.filter((_, j) => j !== i) });
    setOpenIndex(openIndex === i ? null : openIndex !== null && openIndex > i ? openIndex - 1 : openIndex);
  };

  const updateProject = (i: number, p: ProjectEntry) => {
    updateData({
      projects: projects.map((x, j) => (j === i ? p : x)),
    });
  };

  const toggleOpen = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="form-section projects-section">
      <div className="projects-header">
        <h3>Projects</h3>
        <button type="button" className="add-btn" onClick={addProject}>
          Add Project
        </button>
      </div>
      {projects.map((p, i) => (
        <div key={i} className="project-accordion">
          <button
            type="button"
            className="project-accordion-header"
            onClick={() => toggleOpen(i)}
            aria-expanded={openIndex === i}
          >
            <span className="project-accordion-title">
              {p.name || `Project ${i + 1}`}
            </span>
            <span className="project-accordion-icon">
              {openIndex === i ? "−" : "+"}
            </span>
          </button>
          {openIndex === i && (
            <div className="project-accordion-content">
              <input
                placeholder="Project Title"
                value={p.name}
                onChange={(e) => updateProject(i, { ...p, name: e.target.value })}
              />
              <div className="description-wrap">
                <textarea
                  placeholder="Description"
                  value={p.description}
                  onChange={(e) => {
                    const v = e.target.value.slice(0, DESC_MAX);
                    updateProject(i, { ...p, description: v });
                  }}
                  rows={3}
                />
                <span className="char-count">{p.description.length}/{DESC_MAX}</span>
              </div>
              <BulletGuidance bulletsText={p.description} />
              <div className="skill-tag-wrap">
                <label>Tech Stack</label>
                <SkillTagInput
                  value={p.techStack}
                  onChange={(techStack) => updateProject(i, { ...p, techStack })}
                />
              </div>
              <input
                placeholder="Live URL (optional)"
                type="url"
                value={p.liveUrl ?? ""}
                onChange={(e) => updateProject(i, { ...p, liveUrl: e.target.value })}
              />
              <input
                placeholder="GitHub URL (optional)"
                type="url"
                value={p.githubUrl ?? ""}
                onChange={(e) => updateProject(i, { ...p, githubUrl: e.target.value })}
              />
              <button
                type="button"
                className="remove-btn"
                onClick={() => removeProject(i)}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
