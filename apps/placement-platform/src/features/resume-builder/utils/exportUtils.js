function bulletLines(text) {
  if (!text?.trim()) return []
  return text
    .split(/\n/)
    .map(s => s.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean)
}

export function toPlainText(data) {
  if (!data) return ''
  const lines = []
  const { personal = {}, summary = '', education = [], experience = [], projects = [], links = {} } = data

  lines.push(personal.name || 'Name')
  lines.push('')

  const contact = [personal.email, personal.phone, personal.location].filter(Boolean).join(' | ')
  if (contact) {
    lines.push(contact)
    lines.push('')
  }

  if (summary) {
    lines.push('SUMMARY')
    lines.push(summary)
    lines.push('')
  }

  if (education.length > 0) {
    lines.push('EDUCATION')
    for (const e of education) {
      lines.push(`${e.school}${e.dates ? ` | ${e.dates}` : ''}`)
      if (e.degree) lines.push(e.degree)
      if (e.details) lines.push(e.details)
      lines.push('')
    }
  }

  if (experience.length > 0) {
    lines.push('EXPERIENCE')
    for (const e of experience) {
      lines.push(`${e.company}${e.dates ? ` | ${e.dates}` : ''}`)
      if (e.role) lines.push(e.role)
      for (const b of bulletLines(e.details)) lines.push(`  • ${b}`)
      lines.push('')
    }
  }

  if (projects.length > 0) {
    lines.push('PROJECTS')
    for (const p of projects) {
      const urls = [p.liveUrl, p.githubUrl, p.link].filter(Boolean)
      lines.push(p.name + (urls.length ? ` | ${urls[0]}` : ''))
      if (p.description) {
        for (const b of bulletLines(p.description)) lines.push(`  • ${b}`)
      }
      if (p.techStack?.length) lines.push(`  Tech: ${p.techStack.join(', ')}`)
      lines.push('')
    }
  }

  const allSkills = [
    ...((data.skills && data.skills.technical) ? data.skills.technical : []),
    ...((data.skills && data.skills.soft) ? data.skills.soft : []),
    ...((data.skills && data.skills.tools) ? data.skills.tools : [])
  ]
  if (allSkills.length > 0) {
    lines.push('SKILLS')
    lines.push(allSkills.join(', '))
    lines.push('')
  }

  if (links.github || links.linkedin) {
    lines.push('LINKS')
    if (links.github) lines.push(`GitHub: ${links.github}`)
    if (links.linkedin) lines.push(`LinkedIn: ${links.linkedin}`)
  }

  return lines.join('\n').trim()
}

export function getExportWarning(data) {
  if (!data) return 'Add resume data to get started.'
  const noName = !data.personal?.name?.trim()
  const noContent = (data.projects || []).length === 0 && (data.experience || []).length === 0
  if (noName || noContent) {
    return 'Your resume may look incomplete.'
  }
  return null
}
