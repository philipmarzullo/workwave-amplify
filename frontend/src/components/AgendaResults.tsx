import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { RotateCcw, Download, ExternalLink, FileText, Mail, ArrowRight, Sparkles, Star } from 'lucide-react'
import type { PersonaSelection, Session, Day, Interest } from '../types'
import { sessions, dayLabels } from '../data/sessions'
import { getTrack } from '../data/tracks'
import { roles, products, interests as interestData } from '../data/personas'

interface Props {
  persona: PersonaSelection
  onReset: () => void
}

function scoreSession(session: Session, persona: PersonaSelection): number {
  let score = 0

  // Track match: +3 if session track matches selected product (or joint)
  if (session.track === 'joint') {
    score += 2
  } else if (persona.product && session.track === persona.product) {
    score += 3
  }

  // Interest match: +2 per matching interest
  for (const interest of persona.interests) {
    if (session.interests.includes(interest)) {
      score += 2
    }
  }

  // Role match: +2
  if (persona.role && session.roles.includes(persona.role)) {
    score += 2
  }

  return score
}

const dayOrder: Day[] = ['sat', 'sun', 'mon', 'tue']

const DAY_DATES: Record<Day, string> = {
  sat: '20270131',
  sun: '20270201',
  mon: '20270202',
  tue: '20270203',
}

const VENUE = 'Hilton New Orleans Riverside, 2 Poydras Street, New Orleans, LA 70130'

function parseTime(time: string): { hour: number; minute: number } {
  const match = time.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i)
  if (!match) return { hour: 9, minute: 0 }
  let hour = parseInt(match[1], 10)
  const minute = parseInt(match[2], 10)
  const period = match[3].toUpperCase()
  if (period === 'PM' && hour !== 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  return { hour, minute }
}

function formatIcsTime(day: Day, time: string): string {
  const date = DAY_DATES[day]
  const { hour, minute } = parseTime(time)
  return `${date}T${String(hour).padStart(2, '0')}${String(minute).padStart(2, '0')}00`
}

function getEndTime(day: Day, time: string, bootCamp: boolean): string {
  const { hour, minute } = parseTime(time)
  const durationMinutes = bootCamp ? 180 : 60
  const endMinutes = hour * 60 + minute + durationMinutes
  const endHour = Math.floor(endMinutes / 60)
  const endMin = endMinutes % 60
  const date = DAY_DATES[day]
  return `${date}T${String(endHour).padStart(2, '0')}${String(endMin).padStart(2, '0')}00`
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

function generateIcs(sessionList: Session[]): string {
  const events = sessionList.map(s => {
    const dtStart = formatIcsTime(s.day, s.time)
    const dtEnd = getEndTime(s.day, s.time, s.bootCamp)
    return [
      'BEGIN:VEVENT',
      `DTSTART;TZID=America/Chicago:${dtStart}`,
      `DTEND;TZID=America/Chicago:${dtEnd}`,
      `SUMMARY:${escapeIcs(s.title)}`,
      `DESCRIPTION:${escapeIcs(s.description + '\\n\\nSpeaker: ' + s.speaker)}`,
      `LOCATION:${escapeIcs(VENUE)}`,
      `STATUS:CONFIRMED`,
      'END:VEVENT',
    ].join('\r\n')
  })

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WorkWave AMPLIFY 2027//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:WorkWave AMPLIFY 2027',
    'X-WR-TIMEZONE:America/Chicago',
    'BEGIN:VTIMEZONE',
    'TZID:America/Chicago',
    'BEGIN:STANDARD',
    'DTSTART:19701101T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU',
    'TZOFFSETFROM:-0500',
    'TZOFFSETTO:-0600',
    'TZNAME:CST',
    'END:STANDARD',
    'BEGIN:DAYLIGHT',
    'DTSTART:19700308T020000',
    'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU',
    'TZOFFSETFROM:-0600',
    'TZOFFSETTO:-0500',
    'TZNAME:CDT',
    'END:DAYLIGHT',
    'END:VTIMEZONE',
    ...events,
    'END:VCALENDAR',
  ].join('\r\n')
}

function downloadIcs(sessionList: Session[]) {
  const ics = generateIcs(sessionList)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'workwave-AMPLIFY-2027.ics'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function googleCalendarUrl(session: Session): string {
  const dtStart = formatIcsTime(session.day, session.time)
  const dtEnd = getEndTime(session.day, session.time, session.bootCamp)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: session.title,
    dates: `${dtStart}/${dtEnd}`,
    ctz: 'America/Chicago',
    details: `${session.description}\n\nSpeaker: ${session.speaker}`,
    location: VENUE,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function downloadPdf(grouped: Map<Day, { session: Session; score: number }[]>) {
  const win = window.open('', '_blank')
  if (!win) return

  const dayHtml = Array.from(grouped.entries()).map(([day, items]) => {
    const rows = items.map(({ session }) => {
      const track = getTrack(session.track)
      return `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;width:80px;vertical-align:top;color:#666;font-size:13px;">${session.time}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;vertical-align:top;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span style="background:${track.color};color:#fff;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">${track.label}</span>
              ${session.customerLed ? '<span style="background:#fdf2f8;color:#E8005E;font-size:10px;font-weight:600;padding:2px 8px;border-radius:4px;">Customer-Led</span>' : ''}
            </div>
            <div style="font-weight:600;color:#0A1128;font-size:14px;">${session.title}</div>
            <div style="color:#666;font-size:12px;margin-top:2px;">${session.speaker}</div>
          </td>
        </tr>`
    }).join('')

    return `
      <div style="margin-bottom:24px;">
        <h2 style="font-size:16px;color:#0A1128;border-bottom:2px solid #8B3DFF;padding-bottom:6px;margin-bottom:0;">${dayLabels[day]}</h2>
        <table style="width:100%;border-collapse:collapse;">${rows}</table>
      </div>`
  }).join('')

  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>My AMPLIFY 2027 Agenda</title>
  <style>
    @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
    body { font-family: -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin:0; padding:40px; color:#333; }
  </style>
</head>
<body>
  <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #0A1128;">
    <div>
      <div style="font-size:28px;font-weight:800;color:#0A1128;letter-spacing:1px;">AMPLIFY</div>
      <div style="font-size:12px;color:#666;margin-top:2px;">WorkWave Customer Conference 2027</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:12px;color:#666;">January 31 - February 3, 2027</div>
      <div style="font-size:12px;color:#666;">Hilton New Orleans Riverside</div>
    </div>
  </div>
  <h1 style="font-size:20px;color:#0A1128;margin-bottom:4px;">Your Personalized Agenda</h1>
  <p style="color:#888;font-size:13px;margin-bottom:24px;">Based on your role, product, and interests</p>
  ${dayHtml}
  <div style="margin-top:32px;padding:16px;background:#0A1128;border-radius:8px;text-align:center;">
    <div style="color:#fff;font-weight:600;font-size:14px;">Register at workwaveconference.cventevents.com</div>
    <div style="color:#999;font-size:12px;margin-top:4px;">Your industry. Your success. Your conference, in the spirit of New Orleans.</div>
  </div>
</body>
</html>`)
  win.document.close()
  setTimeout(() => win.print(), 300)
}

function generateMailto(grouped: Map<Day, { session: Session; score: number }[]>): string {
  const subject = encodeURIComponent('My WorkWave AMPLIFY 2027 Agenda')

  const lines: string[] = [
    'Here are the sessions I plan to attend at WorkWave AMPLIFY 2027:',
    '',
  ]

  for (const [day, items] of grouped.entries()) {
    lines.push(`--- ${dayLabels[day]} ---`)
    for (const { session } of items) {
      const track = getTrack(session.track)
      lines.push(`• ${session.title}`)
      lines.push(`  ${session.time} | ${track.label} Track | ${session.speaker}`)
      lines.push('')
    }
  }

  lines.push('---')
  lines.push('Register: https://workwaveconference.cventevents.com/9AWddk')
  lines.push('Build your own agenda: https://amplify.workwave.com/my-agenda')

  const body = encodeURIComponent(lines.join('\n'))
  return `mailto:?subject=${subject}&body=${body}`
}

function getInterestLabel(id: Interest): string {
  return interestData.find(i => i.id === id)?.label || id
}

function generateSummary(persona: PersonaSelection, recommended: { session: Session; score: number }[]): {
  intro: string
  highlights: string[]
  extras: { title: string; description: string }[]
} {
  const roleLabel = roles.find(r => r.id === persona.role)?.label || 'attendee'
  const productLabel = products.find(p => p.id === persona.product)?.label || 'your platform'

  const trackCount = recommended.filter(r => r.session.track === persona.product).length
  const jointCount = recommended.filter(r => r.session.track === 'joint').length
  const customerLedCount = recommended.filter(r => r.session.customerLed).length
  const topInterests = persona.interests.slice(0, 3).map(getInterestLabel)

  const intro = `As a ${roleLabel.toLowerCase()} on ${productLabel}, your agenda focuses on ${topInterests.join(', ').replace(/, ([^,]*)$/, ', and $1')}. We found ${recommended.length} sessions across ${Array.from(new Set(recommended.map(r => r.session.day))).length} days tailored to your priorities.`

  const highlights: string[] = []
  if (trackCount > 0) highlights.push(`${trackCount} ${productLabel}-specific session${trackCount > 1 ? 's' : ''} matched your interests`)
  if (jointCount > 0) highlights.push(`${jointCount} cross-platform session${jointCount > 1 ? 's' : ''} on topics like AI, analytics, and industry trends`)
  if (customerLedCount > 0) highlights.push(`${customerLedCount} customer-led session${customerLedCount > 1 ? 's' : ''} from real operators sharing proven strategies`)

  const extras: { title: string; description: string }[] = []
  const role = persona.role

  // Suggest bootcamp if they didn't get one in recommendations
  const hasBootcamp = recommended.some(r => r.session.bootCamp)
  if (!hasBootcamp) {
    const bootcampDesc = role === 'owner'
      ? `Great for your team members who need a refresher on software setup and workflows. Included in ticket price, pre-registration required.`
      : role === 'admin'
      ? `Hands-on time with product experts, perfect for new users or anyone needing a refresh. Bring your laptop. Included in ticket price, pre-registration required.`
      : `Get hands-on with ${productLabel} alongside product experts using your own company data. Included in ticket price, pre-registration required.`
    extras.push({
      title: `Explore Sunday Bootcamps`,
      description: bootcampDesc,
    })
  }

  // Always suggest Meet the Experts — role-specific copy
  const expertsDesc = role === 'owner'
    ? `30-minute one-on-ones for reporting, feature demos, configuration help, and API questions. Book via the conference app the week before or onsite.`
    : role === 'admin'
    ? `30-minute one-on-ones covering reporting, feature demos, configuration, and technical questions. Book via the conference app the week before or onsite.`
    : `30-minute one-on-ones for field-specific questions, mobile app tips, and workflow help. Book via the conference app the week before or onsite.`
  extras.push({
    title: 'Meet the Product Experts',
    description: expertsDesc,
  })

  // Suggest Wavelytics if not in their interests
  if (!persona.interests.includes('wavelytics')) {
    extras.push({
      title: 'Wavelytics Sessions',
      description: "WorkWave's new business analytics platform is a major focus this year. Worth checking out even if analytics isn't your primary interest.",
    })
  }

  // Suggest AI sessions if not in their interests
  if (!persona.interests.includes('ai')) {
    extras.push({
      title: 'AI & WAIve Sessions',
      description: "WAIve, WorkWave's AI platform, launches new capabilities at AMPLIFY. These sessions are relevant to every role.",
    })
  }

  // Always show early bird pricing callout
  extras.push({
    title: 'Early Bird Pricing — Through August 31',
    description: 'Lock in $849 (save $100+). Group discounts available for 5+ tickets. Lowest price of the year.',
  })

  return { intro, highlights, extras }
}

export default function AgendaResults({ persona, onReset }: Props) {
  const recommended = useMemo(() => {
    const scored = sessions.map(s => ({
      session: s,
      score: scoreSession(s, persona),
    }))

    scored.sort((a, b) => b.score - a.score)

    return scored.filter(s => s.score > 0).slice(0, 10)
  }, [persona])

  const grouped = useMemo(() => {
    const map = new Map<Day, typeof recommended>()
    for (const day of dayOrder) {
      const daySessions = recommended.filter(r => r.session.day === day)
      if (daySessions.length > 0) {
        daySessions.sort((a, b) => {
          if (a.session.time < b.session.time) return -1
          if (a.session.time > b.session.time) return 1
          return b.score - a.score
        })
        map.set(day, daySessions)
      }
    }
    return map
  }, [recommended])

  const allRecommendedSessions = useMemo(() => recommended.map(r => r.session), [recommended])

  const summary = useMemo(() => generateSummary(persona, recommended), [persona, recommended])

  return (
    <div className="max-w-3xl mx-auto">
      {/* AI Summary */}
      <div className="bg-gradient-to-br from-accent/5 to-magenta/5 border border-accent/20 rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-bold text-navy text-base mb-1">Your Agenda at a Glance</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{summary.intro}</p>
          </div>
        </div>
        {summary.highlights.length > 0 && (
          <ul className="space-y-1.5 mb-5 ml-12">
            {summary.highlights.map((h, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-accent mt-0.5">&#8226;</span>
                {h}
              </li>
            ))}
          </ul>
        )}
        {summary.extras.length > 0 && (
          <div className="ml-12">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-4 h-4 text-magenta" />
              <h4 className="font-semibold text-navy text-sm">Don't miss these extras</h4>
            </div>
            <div className="grid gap-2">
              {summary.extras.map((extra) => (
                <div key={extra.title} className="bg-white/60 rounded-lg px-4 py-3 border border-gray-200/60">
                  <p className="font-medium text-navy text-sm">{extra.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{extra.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-navy mb-2">Your Recommended Sessions</h2>
        <p className="text-gray-500 mb-4">
          {recommended.length} sessions matched your profile, sorted by relevance.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
          <button
            onClick={() => downloadIcs(allRecommendedSessions)}
            className="inline-flex items-center gap-2 text-sm bg-blue-brand text-white hover:opacity-90 font-medium px-4 py-2 rounded-lg transition-opacity"
          >
            <Download className="w-4 h-4" /> Export for Outlook / Apple
          </button>
          <button
            onClick={() => downloadPdf(grouped)}
            className="inline-flex items-center gap-2 text-sm bg-navy text-white hover:opacity-90 font-medium px-4 py-2 rounded-lg transition-opacity"
          >
            <FileText className="w-4 h-4" /> Download PDF
          </button>
          <a
            href={generateMailto(grouped)}
            className="inline-flex items-center gap-2 text-sm bg-accent text-white hover:opacity-90 font-medium px-4 py-2 rounded-lg transition-opacity"
          >
            <Mail className="w-4 h-4" /> Share via Email
          </a>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </button>
        </div>
        <p className="text-xs text-gray-400 mb-3">Google Calendar users: use the link on each session below, or import the .ics file.</p>
        <Link
          to="/sessions"
          className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent-dark font-medium transition-colors"
        >
          Browse all sessions <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {Array.from(grouped.entries()).map(([day, items]) => (
        <div key={day} className="mb-8">
          <h3 className="text-lg font-bold text-navy mb-4 pb-2 border-b border-gray-200">
            {dayLabels[day]}
          </h3>
          <div className="space-y-3">
            {items.map(({ session, score }) => {
              const track = getTrack(session.track)
              return (
                <div
                  key={session.id}
                  className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
                >
                  <div
                    className="w-1 shrink-0 rounded-full"
                    style={{ backgroundColor: track.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-navy leading-snug">{session.title}</h4>
                      <span className="shrink-0 text-xs font-bold text-accent bg-accent/10 px-2 py-1 rounded-full">
                        {score}pt
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{session.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 flex-wrap">
                      <span
                        className="font-semibold px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: track.color }}
                      >
                        {track.label}
                      </span>
                      <span>{session.time}</span>
                      <span>{session.speaker}</span>
                      <a
                        href={googleCalendarUrl(session)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-accent hover:text-accent-dark font-medium transition-colors ml-auto"
                      >
                        <ExternalLink className="w-3 h-3" /> Google Cal
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <div className="text-center mt-8 p-6 bg-navy rounded-xl">
        <h3 className="text-white font-bold text-lg mb-2">Ready to experience it live?</h3>
        <p className="text-gray-300 text-sm mb-4">
          Register for WorkWave AMPLIFY 2027 in New Orleans.
        </p>
        <a
          href="https://workwaveconference.cventevents.com/9AWddk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-magenta hover:bg-magenta-dark text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Register Now
        </a>
      </div>
    </div>
  )
}
