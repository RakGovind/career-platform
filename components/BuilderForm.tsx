"use client";

import React from "react";
import { useResume } from "@/context/ResumeContext";
import {
  emptyEducation,
  emptyExperience,
  type EducationEntry,
  type ExperienceEntry,
} from "@/lib/resume-types";
import { BulletGuidance } from "@/components/BulletGuidance";
import { SkillsSection } from "@/components/SkillsSection";
import { ProjectsSection } from "@/components/ProjectsSection";

export function BuilderForm() {
  const { data, updateData, loadSample } = useResume();
  const { personal, summary, education, experience, links } = data;

  const addEducation = () =>
    updateData({ education: [...education, { ...emptyEducation }] });
  const removeEducation = (i: number) =>
    updateData({ education: education.filter((_, j) => j !== i) });
  const updateEducation = (i: number, e: EducationEntry) =>
    updateData({
      education: education.map((x, j) => (j === i ? e : x)),
    });

  const addExperience = () =>
    updateData({ experience: [...experience, { ...emptyExperience }] });
  const removeExperience = (i: number) =>
    updateData({ experience: experience.filter((_, j) => j !== i) });
  const updateExperience = (i: number, e: ExperienceEntry) =>
    updateData({
      experience: experience.map((x, j) => (j === i ? e : x)),
    });

  return (
    <div className="builder-form">
      <button type="button" className="load-sample-btn" onClick={loadSample}>
        Load Sample Data
      </button>

      <section className="form-section">
        <h3>Personal Info</h3>
        <div className="form-row">
          <input
            placeholder="Name"
            value={personal.name}
            onChange={(e) =>
              updateData({ personal: { ...personal, name: e.target.value } })
            }
          />
          <input
            placeholder="Email"
            type="email"
            value={personal.email}
            onChange={(e) =>
              updateData({ personal: { ...personal, email: e.target.value } })
            }
          />
        </div>
        <div className="form-row">
          <input
            placeholder="Phone"
            value={personal.phone}
            onChange={(e) =>
              updateData({ personal: { ...personal, phone: e.target.value } })
            }
          />
          <input
            placeholder="Location"
            value={personal.location}
            onChange={(e) =>
              updateData({ personal: { ...personal, location: e.target.value } })
            }
          />
        </div>
      </section>

      <section className="form-section">
        <h3>Summary</h3>
        <textarea
          placeholder="Professional summary..."
          value={summary}
          onChange={(e) => updateData({ summary: e.target.value })}
          rows={4}
        />
      </section>

      <section className="form-section">
        <h3>Education</h3>
        {education.map((e, i) => (
          <div key={i} className="form-block">
            <input
              placeholder="School"
              value={e.school}
              onChange={(ev) =>
                updateEducation(i, { ...e, school: ev.target.value })
              }
            />
            <div className="form-row">
              <input
                placeholder="Degree"
                value={e.degree}
                onChange={(ev) =>
                  updateEducation(i, { ...e, degree: ev.target.value })
                }
              />
              <input
                placeholder="Dates"
                value={e.dates}
                onChange={(ev) =>
                  updateEducation(i, { ...e, dates: ev.target.value })
                }
              />
            </div>
            <textarea
              placeholder="Details"
              value={e.details}
              onChange={(ev) =>
                updateEducation(i, { ...e, details: ev.target.value })
              }
              rows={2}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeEducation(i)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addEducation}>
          + Add Education
        </button>
      </section>

      <section className="form-section">
        <h3>Experience</h3>
        {experience.map((e, i) => (
          <div key={i} className="form-block">
            <input
              placeholder="Company"
              value={e.company}
              onChange={(ev) =>
                updateExperience(i, { ...e, company: ev.target.value })
              }
            />
            <div className="form-row">
              <input
                placeholder="Role"
                value={e.role}
                onChange={(ev) =>
                  updateExperience(i, { ...e, role: ev.target.value })
                }
              />
              <input
                placeholder="Dates"
                value={e.dates}
                onChange={(ev) =>
                  updateExperience(i, { ...e, dates: ev.target.value })
                }
              />
            </div>
            <textarea
              placeholder="Details (one bullet per line)"
              value={e.details}
              onChange={(ev) =>
                updateExperience(i, { ...e, details: ev.target.value })
              }
              rows={3}
            />
            <BulletGuidance bulletsText={e.details} />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeExperience(i)}
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addExperience}>
          + Add Experience
        </button>
      </section>

      <ProjectsSection />

      <SkillsSection />

      <section className="form-section">
        <h3>Links</h3>
        <input
          placeholder="GitHub URL"
          value={links.github}
          onChange={(e) =>
            updateData({ links: { ...links, github: e.target.value } })
          }
        />
        <input
          placeholder="LinkedIn URL"
          value={links.linkedin}
          onChange={(e) =>
            updateData({ links: { ...links, linkedin: e.target.value } })
          }
        />
      </section>
    </div>
  );
}
