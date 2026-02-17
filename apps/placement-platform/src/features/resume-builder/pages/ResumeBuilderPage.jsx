import React, { useState } from 'react'
import { useResume } from '../hooks/useResume'
import { Button } from '@/shared/components/Button'
import { Card } from '@/shared/components/Card'
import { SkillTagInput } from '../components/SkillTagInput'
import { BulletGuidance } from '../components/BulletGuidance'
import { ATSScore } from '../components/ATSScore'
import { ResumePreview } from '../components/ResumePreview'
import { toPlainText, getExportWarning } from '../utils/exportUtils'

const emptyEducation = { school: '', degree: '', dates: '', details: '' }
const emptyExperience = { company: '', role: '', dates: '', details: '' }
const emptyProject = { name: '', description: '', techStack: [] }

const COLOR_THEMES = {
  teal: { hsl: 'hsl(168, 60%, 40%)', label: 'Teal' },
  navy: { hsl: 'hsl(220, 60%, 35%)', label: 'Navy' },
  burgundy: { hsl: 'hsl(345, 60%, 35%)', label: 'Burgundy' },
  forest: { hsl: 'hsl(150, 50%, 30%)', label: 'Forest' },
  charcoal: { hsl: 'hsl(0, 0%, 25%)', label: 'Charcoal' }
}

export function ResumeBuilderPage() {
  const { data, updateData, loadSample } = useResume()
  const { personal = {}, summary = '', education = [], experience = [], projects = [], skills = { technical: [], soft: [], tools: [] }, links = {} } = data || {}
  
  const [accentColor, setAccentColor] = useState(COLOR_THEMES.teal.hsl)
  const [template, setTemplate] = useState('classic')
  const [openProjectIndex, setOpenProjectIndex] = useState(0)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showWarning, setShowWarning] = useState(false)

  const warning = getExportWarning(data)

  const handlePrint = () => {
    if (warning) setShowWarning(true)
    window.print()
  }

  const handleCopyText = async () => {
    if (warning) setShowWarning(true)
    const text = toPlainText(data)
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (e) {
      const ta = document.createElement('textarea')
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    }
  }

  const addEducation = () => updateData({ education: [...education, { ...emptyEducation }] })
  const removeEducation = (i) => updateData({ education: education.filter((_, j) => j !== i) })
  const updateEducation = (i, e) => updateData({ education: education.map((x, j) => (j === i ? e : x)) })

  const addExperience = () => updateData({ experience: [...experience, { ...emptyExperience }] })
  const removeExperience = (i) => updateData({ experience: experience.filter((_, j) => j !== i) })
  const updateExperience = (i, e) => updateData({ experience: experience.map((x, j) => (j === i ? e : x)) })

  const addProject = () => {
    const next = [...projects, { ...emptyProject }]
    updateData({ projects: next })
    setOpenProjectIndex(next.length - 1)
  }
  const removeProject = (i) => {
    updateData({ projects: projects.filter((_, j) => j !== i) })
    setOpenProjectIndex(openProjectIndex === i ? null : openProjectIndex !== null && openProjectIndex > i ? openProjectIndex - 1 : openProjectIndex)
  }
  const updateProject = (i, p) => updateData({ projects: projects.map((x, j) => (j === i ? p : x)) })

  const SUGGESTED = {
    technical: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL'],
    soft: ['Team Leadership', 'Problem Solving'],
    tools: ['Git', 'Docker', 'AWS']
  }

  const handleSuggestSkills = () => {
    const currentSkills = skills || { technical: [], soft: [], tools: [] }
    const next = {
      technical: Array.from(new Set([...(currentSkills.technical || []), ...SUGGESTED.technical])),
      soft: Array.from(new Set([...(currentSkills.soft || []), ...SUGGESTED.soft])),
      tools: Array.from(new Set([...(currentSkills.tools || []), ...SUGGESTED.tools]))
    }
    updateData({ skills: next })
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Resume Builder</h1>
        <Button onClick={loadSample}>Load Sample Data</Button>
      </div>

      <div className="mb-6">
        <ATSScore />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={personal.name || ''}
                  onChange={(e) => updateData({ personal: { ...(personal || {}), name: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={personal.email || ''}
                  onChange={(e) => updateData({ personal: { ...(personal || {}), email: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="tel"
                  placeholder="Phone"
                  value={personal.phone || ''}
                  onChange={(e) => updateData({ personal: { ...(personal || {}), phone: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={personal.location || ''}
                  onChange={(e) => updateData({ personal: { ...(personal || {}), location: e.target.value } })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Summary</h2>
            <textarea
              placeholder="Professional summary..."
              value={summary || ''}
              onChange={(e) => updateData({ summary: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            {education.map((edu, i) => (
              <div key={i} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  placeholder="School"
                  value={edu.school || ''}
                  onChange={(e) => updateEducation(i, { ...edu, school: e.target.value })}
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Degree"
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(i, { ...edu, degree: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Dates"
                    value={edu.dates || ''}
                    onChange={(e) => updateEducation(i, { ...edu, dates: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <textarea
                  placeholder="Details"
                  value={edu.details || ''}
                  onChange={(e) => updateEducation(i, { ...edu, details: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <Button variant="secondary" onClick={() => removeEducation(i)} className="mt-2">
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addEducation}>+ Add Education</Button>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Experience</h2>
            {experience.map((exp, i) => (
              <div key={i} className="mb-4 p-4 border border-gray-200 rounded-lg">
                <input
                  type="text"
                  placeholder="Company"
                  value={exp.company || ''}
                  onChange={(e) => updateExperience(i, { ...exp, company: e.target.value })}
                  className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Role"
                    value={exp.role || ''}
                    onChange={(e) => updateExperience(i, { ...exp, role: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Dates"
                    value={exp.dates || ''}
                    onChange={(e) => updateExperience(i, { ...exp, dates: e.target.value })}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <textarea
                  placeholder="Details (one bullet per line)"
                  value={exp.details || ''}
                  onChange={(e) => updateExperience(i, { ...exp, details: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                <BulletGuidance bulletsText={exp.details || ''} />
                <Button variant="secondary" onClick={() => removeExperience(i)} className="mt-2">
                  Remove
                </Button>
              </div>
            ))}
            <Button onClick={addExperience}>+ Add Experience</Button>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Button onClick={addProject}>Add Project</Button>
            </div>
            {projects.map((p, i) => (
              <div key={i} className="mb-4 border border-gray-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => setOpenProjectIndex(openProjectIndex === i ? null : i)}
                  className="w-full p-4 flex justify-between items-center"
                >
                  <span className="font-medium">{p.name || `Project ${i + 1}`}</span>
                  <span>{openProjectIndex === i ? '−' : '+'}</span>
                </button>
                {openProjectIndex === i && (
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <input
                      type="text"
                      placeholder="Project Title"
                      value={p.name || ''}
                      onChange={(e) => updateProject(i, { ...p, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Description"
                      value={p.description || ''}
                      onChange={(e) => {
                        const v = e.target.value.slice(0, 200)
                        updateProject(i, { ...p, description: v })
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <div className="text-xs text-gray-500">{(p.description || '').length}/200</div>
                    <BulletGuidance bulletsText={p.description || ''} />
                    <div>
                      <label className="block text-sm font-medium mb-2">Tech Stack</label>
                      <SkillTagInput
                        value={p.techStack || []}
                        onChange={(techStack) => updateProject(i, { ...p, techStack })}
                      />
                    </div>
                    <input
                      type="url"
                      placeholder="Live URL (optional)"
                      value={p.liveUrl ?? ''}
                      onChange={(e) => updateProject(i, { ...p, liveUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="url"
                      placeholder="GitHub URL (optional)"
                      value={p.githubUrl ?? ''}
                      onChange={(e) => updateProject(i, { ...p, githubUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                    <Button variant="secondary" onClick={() => removeProject(i)}>
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Skills</h2>
              <Button variant="secondary" onClick={handleSuggestSkills}>
                ✨ Suggest Skills
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Technical Skills ({skills && skills.technical ? skills.technical.length : 0})</h4>
                <SkillTagInput
                  value={(skills && skills.technical) || []}
                  onChange={(technical) => updateData({ skills: { ...(skills || {}), technical } })}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Soft Skills ({skills && skills.soft ? skills.soft.length : 0})</h4>
                <SkillTagInput
                  value={(skills && skills.soft) || []}
                  onChange={(soft) => updateData({ skills: { ...(skills || {}), soft } })}
                />
              </div>
              <div>
                <h4 className="font-medium mb-2">Tools & Technologies ({skills && skills.tools ? skills.tools.length : 0})</h4>
                <SkillTagInput
                  value={(skills && skills.tools) || []}
                  onChange={(tools) => updateData({ skills: { ...(skills || {}), tools } })}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Links</h2>
            <div className="space-y-3">
              <input
                type="url"
                placeholder="GitHub URL"
                value={links.github || ''}
                onChange={(e) => updateData({ links: { ...(links || {}), github: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
              <input
                type="url"
                placeholder="LinkedIn URL"
                value={links.linkedin || ''}
                onChange={(e) => updateData({ links: { ...(links || {}), linkedin: e.target.value } })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Accent Color</label>
              <div className="flex gap-2">
                {Object.entries(COLOR_THEMES).map(([key, theme]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setAccentColor(theme.hsl)}
                    className={`w-10 h-10 rounded border-2 ${
                      accentColor === theme.hsl ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: theme.hsl }}
                    title={theme.label}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Template</label>
              <select
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="classic">Classic</option>
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <div className="border-2 border-gray-300 p-4 bg-gray-50 rounded-lg overflow-auto max-h-[800px]">
              <ResumePreview data={data} accentColor={accentColor} />
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold mb-4">Export</h2>
            <div className="space-y-3">
              <Button onClick={handlePrint} className="w-full">
                Download PDF
              </Button>
              <Button variant="secondary" onClick={handleCopyText} className="w-full">
                {copySuccess ? 'Copied' : 'Copy Resume as Text'}
              </Button>
              {showWarning && warning && (
                <p className="text-sm text-yellow-600">{warning}</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
