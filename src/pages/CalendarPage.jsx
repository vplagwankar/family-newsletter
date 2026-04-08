import { useState, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllEvents } from '../services/api.js'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage.js'
import Spinner from '../components/ui/Spinner.jsx'
import Badge from '../components/ui/Badge.jsx'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function buildCalendarGrid(year, month) {
  // month is 0-indexed
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weeks = []
  let day = 1 - firstDay
  while (day <= daysInMonth) {
    const week = []
    for (let i = 0; i < 7; i++, day++) {
      week.push(day >= 1 && day <= daysInMonth ? day : null)
    }
    weeks.push(week)
  }
  return weeks
}

export default function CalendarPage() {
  const { t }    = useTranslation()
  const { lang } = useLanguage()
  const today    = new Date()

  const [year,    setYear]    = useState(today.getFullYear())
  const [month,   setMonth]   = useState(today.getMonth())
  const [events,  setEvents]  = useState([])
  const [loading, setLoading] = useState(true)
  const [popover, setPopover] = useState(null) // { day, x, y, events }

  useEffect(() => {
    document.title = `Calendar — Lagwankar Family`
    getAllEvents().then((data) => { setEvents(data); setLoading(false) })
  }, [])

  // Index events by "YYYY-MM-DD"
  const eventsByDate = useMemo(() => {
    const map = {}
    events.forEach((e) => {
      const key = e.date.slice(0, 10)
      if (!map[key]) map[key] = []
      map[key].push(e)
    })
    return map
  }, [events])

  const weeks = useMemo(() => buildCalendarGrid(year, month), [year, month])

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1) }
    else setMonth((m) => m - 1)
    setPopover(null)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear((y) => y + 1) }
    else setMonth((m) => m + 1)
    setPopover(null)
  }

  const handleDayClick = (e, day) => {
    if (!day) return
    const pad = (n) => String(n).padStart(2, '0')
    const key = `${year}-${pad(month + 1)}-${pad(day)}`
    const dayEvents = eventsByDate[key] || []
    if (dayEvents.length === 0) { setPopover(null); return }
    const rect = e.currentTarget.getBoundingClientRect()
    setPopover({ key, day, events: dayEvents })
  }

  const isToday = (day) =>
    day === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  if (loading) return <div className="flex justify-center py-24"><Spinner /></div>

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-terracotta-dark mb-6">
        Event Calendar
      </h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100">
        <button
          onClick={prevMonth}
          className="p-2 text-gray-500 hover:text-terracotta transition-colors"
          aria-label="Previous month"
        >
          ‹
        </button>
        <h2 className="text-lg font-bold text-gray-900">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 text-gray-500 hover:text-terracotta transition-colors"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-gray-100">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2.5 uppercase tracking-wide">
              {d}
            </div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-b border-gray-50 last:border-0">
            {week.map((day, di) => {
              const pad = (n) => String(n).padStart(2, '0')
              const key = day ? `${year}-${pad(month + 1)}-${pad(day)}` : ''
              const dayEvents = key ? (eventsByDate[key] || []) : []
              const hasEvents = dayEvents.length > 0

              return (
                <button
                  key={di}
                  onClick={(e) => handleDayClick(e, day)}
                  disabled={!day}
                  className={`min-h-[64px] sm:min-h-[80px] p-1.5 text-left flex flex-col border-r border-gray-50 last:border-0 transition-colors ${
                    !day ? 'bg-gray-50/50 cursor-default' :
                    isToday(day) ? 'bg-terracotta/5' :
                    hasEvents ? 'hover:bg-saffron/5 cursor-pointer' : 'hover:bg-gray-50 cursor-default'
                  }`}
                  aria-label={day ? `${day} ${MONTHS[month]} ${year}${hasEvents ? ` - ${dayEvents.length} event(s)` : ''}` : ''}
                >
                  {day && (
                    <>
                      <span className={`text-xs sm:text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                        isToday(day) ? 'bg-terracotta text-white' : 'text-gray-700'
                      }`}>
                        {day}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {dayEvents.slice(0, 2).map((ev) => {
                          const evTitle = lang === 'kn' && ev.titleKn ? ev.titleKn : ev.title
                          const dot = ev.published ? 'bg-terracotta' : 'bg-warmgreen'
                          return (
                            <span
                              key={ev.id}
                              className={`hidden sm:flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded ${dot} text-white leading-tight truncate`}
                              title={evTitle}
                            >
                              <span className="truncate">{evTitle}</span>
                            </span>
                          )
                        })}
                        {/* Mobile: just dots */}
                        {dayEvents.length > 0 && (
                          <div className="flex gap-0.5 sm:hidden mt-0.5">
                            {dayEvents.slice(0, 3).map((ev) => (
                              <span key={ev.id} className={`w-1.5 h-1.5 rounded-full ${ev.published ? 'bg-terracotta' : 'bg-warmgreen'}`} />
                            ))}
                          </div>
                        )}
                        {dayEvents.length > 2 && (
                          <span className="hidden sm:block text-[10px] text-gray-400 px-1">+{dayEvents.length - 2} more</span>
                        )}
                      </div>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-terracotta inline-block" />
          Past events
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-warmgreen inline-block" />
          Upcoming events
        </div>
      </div>

      {/* Popover / event list for clicked day */}
      {popover && (
        <div className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">
              {popover.day} {MONTHS[month]} {year}
            </h3>
            <button
              onClick={() => setPopover(null)}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3">
            {popover.events.map((ev) => {
              const evTitle = lang === 'kn' && ev.titleKn ? ev.titleKn : ev.title
              return (
                <div key={ev.id} className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${ev.published ? 'bg-terracotta' : 'bg-warmgreen'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{evTitle}</p>
                    <p className="text-xs text-gray-400">{ev.location}</p>
                  </div>
                  {ev.published && (
                    <Link
                      to={`/events/${ev.id}`}
                      className="text-xs text-terracotta hover:underline shrink-0"
                    >
                      View →
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
