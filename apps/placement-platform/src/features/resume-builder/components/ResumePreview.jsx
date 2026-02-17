import React from 'react'

export function ResumePreview({ data, accentColor = 'hsl(168, 60%, 40%)' }) {
  if (!data) return <div>No data available</div>
  const { personal = {}, summary = '', education = [], experience = [], projects = [], skills = { technical: [], soft: [], tools: [] }, links = {} } = data

  return (
    <div 
      className="bg-white border-2 border-gray-300 p-8 max-w-4xl mx-auto shadow-lg"
      style={{ '--resume-accent': accentColor }}
    >
      <header className="mb-6 pb-4 border-b-2" style={{ borderColor: accentColor }}>
        <h1 className="text-3xl font-bold mb-2" style={{ color: accentColor }}>
          {personal.name || 'Your Name'}
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
      </header>

      {summary && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>Summary</h2>
          <p className="text-gray-700">{summary}</p>
        </section>
      )}

      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>Education</h2>
          {education.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <strong className="font-semibold">{e?.school || 'School'}</strong>
                <span className="text-sm text-gray-600">{e?.dates || ''}</span>
              </div>
              <div className="text-gray-700">{e?.degree || ''}</div>
              {e?.details && <p className="text-sm text-gray-600 mt-1">{e.details}</p>}
            </div>
          ))}
        </section>
      )}

      {experience && experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>Experience</h2>
          {experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <strong className="font-semibold">{e?.company || 'Company'}</strong>
                <span className="text-sm text-gray-600">{e?.dates || ''}</span>
              </div>
              <div className="text-gray-700 mb-1">{e?.role || ''}</div>
              {e?.details && (
                <div className="text-sm text-gray-700 whitespace-pre-line">
                  {e.details.split('\n').map((line, idx) => (
                    <div key={idx}>• {line}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {projects && projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>Projects</h2>
          {projects.map((p, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <strong className="font-semibold">{p?.name || ''}</strong>
                {p?.liveUrl && (
                  <a href={p.liveUrl} target="_blank" rel="noopener" className="text-sm text-blue-600">
                    Live
                  </a>
                )}
                {p?.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noopener" className="text-sm text-blue-600">
                    GitHub
                  </a>
                )}
              </div>
              {p?.description && <p className="text-sm text-gray-700 mb-1">{p.description}</p>}
              {p?.techStack && p.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {p.techStack.map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {((skills && skills.technical && skills.technical.length > 0) || 
        (skills && skills.soft && skills.soft.length > 0) || 
        (skills && skills.tools && skills.tools.length > 0)) && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>Skills</h2>
          <div className="space-y-2">
            {skills && skills.technical && skills.technical.length > 0 && (
              <div>
                <span className="text-sm font-medium">Technical: </span>
                <span className="text-sm text-gray-700">
                  {skills.technical.join(', ')}
                </span>
              </div>
            )}
            {skills && skills.soft && skills.soft.length > 0 && (
              <div>
                <span className="text-sm font-medium">Soft: </span>
                <span className="text-sm text-gray-700">
                  {skills.soft.join(', ')}
                </span>
              </div>
            )}
            {skills && skills.tools && skills.tools.length > 0 && (
              <div>
                <span className="text-sm font-medium">Tools: </span>
                <span className="text-sm text-gray-700">
                  {skills.tools.join(', ')}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {links && (links.github || links.linkedin) && (
        <section>
          <h2 className="text-xl font-semibold mb-2" style={{ color: accentColor }}>Links</h2>
          <div className="space-y-1">
            {links.github && (
              <div>
                <a href={links.github} target="_blank" rel="noopener" className="text-blue-600">
                  GitHub: {links.github}
                </a>
              </div>
            )}
            {links.linkedin && (
              <div>
                <a href={links.linkedin} target="_blank" rel="noopener" className="text-blue-600">
                  LinkedIn: {links.linkedin}
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}
