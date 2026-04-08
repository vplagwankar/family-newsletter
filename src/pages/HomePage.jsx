import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import HeroBanner    from '../components/home/HeroBanner.jsx'
import UpcomingStrip from '../components/home/UpcomingStrip.jsx'
import RecentEvents  from '../components/home/RecentEvents.jsx'
import Announcements from '../components/home/Announcements.jsx'
import Spotlight     from '../components/home/Spotlight.jsx'

export default function HomePage() {
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${t('home.heroTitle')} — Lagwankar Family`
  }, [t])

  return (
    <>
      <HeroBanner />
      <UpcomingStrip />
      <RecentEvents />
      <Announcements />
      <Spotlight />
    </>
  )
}
