/**
 * usePageTracking Composable
 * Tracks page visits and unique visitors to Supabase with shared reactive stats
 */

let isTrackingStarted = false

export function usePageTracking() {
  const { supabase } = useSupabase()
  const route = useRoute()
  const router = useRouter()

  // Shared reactive stats across all components
  const stats = useState('site_stats', () => ({
    visits: 0,
    visitors: 0,
  }))

  // Safe UUID generator with RFC4122 fallback for non-secure / older environments
  const generateUUID = (): string => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      try {
        return crypto.randomUUID()
      } catch {
        // Fallback if randomUUID fails
      }
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === 'x' ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  // Generate or retrieve visitor ID from localStorage
  const getVisitorId = (): string => {
    if (process.server) return ''

    const storageKey = 'cv_visitor_id'
    let visitorId = localStorage.getItem(storageKey)

    if (!visitorId) {
      visitorId = generateUUID()
      localStorage.setItem(storageKey, visitorId)
    }

    return visitorId
  }

  // Generate session ID (expires on browser close)
  const getSessionId = (): string => {
    if (process.server) return ''

    const storageKey = 'cv_session_id'
    let sessionId = sessionStorage.getItem(storageKey)

    if (!sessionId) {
      sessionId = generateUUID()
      sessionStorage.setItem(storageKey, sessionId)
    }

    return sessionId
  }

  // Get basic device info
  const getDeviceInfo = () => {
    if (process.server) return { device_type: 'unknown', browser: 'unknown', os: 'unknown' }

    const ua = navigator.userAgent

    // Detect device type
    let device_type = 'desktop'
    if (/Mobile|Android|iPhone/i.test(ua)) device_type = 'mobile'
    else if (/iPad|Tablet/i.test(ua)) device_type = 'tablet'

    // Detect browser
    let browser = 'unknown'
    if (ua.includes('Chrome')) browser = 'Chrome'
    else if (ua.includes('Firefox')) browser = 'Firefox'
    else if (ua.includes('Safari')) browser = 'Safari'
    else if (ua.includes('Edge')) browser = 'Edge'

    // Detect OS
    let os = 'unknown'
    if (ua.includes('Windows')) os = 'Windows'
    else if (ua.includes('Mac')) os = 'macOS'
    else if (ua.includes('Linux')) os = 'Linux'
    else if (ua.includes('Android')) os = 'Android'
    else if (ua.includes('iOS')) os = 'iOS'

    return { device_type, browser, os }
  }

  // Fetch updated stats from Supabase
  const fetchStats = async () => {
    try {
      const { count: visitCount, error: visitErr } = await supabase
        .from('page_visits')
        .select('*', { count: 'exact', head: true })

      const { count: visitorCount, error: visitorErr } = await supabase
        .from('unique_visitors')
        .select('*', { count: 'exact', head: true })

      if (!visitErr && visitCount !== null) {
        stats.value.visits = visitCount
      }
      if (!visitorErr && visitorCount !== null) {
        stats.value.visitors = visitorCount
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  // Track page visit
  const trackPageVisit = async () => {
    if (process.server) return

    try {
      const visitorId = getVisitorId()
      const sessionId = getSessionId()
      const deviceInfo = getDeviceInfo()

      // 1. Insert page visit
      const { error: visitError } = await supabase
        .from('page_visits')
        .insert({
          page_url: route.path,
          page_title: document.title,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: sessionId,
          ...deviceInfo,
        })

      if (visitError) {
        console.error('Error tracking visit:', visitError.message)
      }

      // 2. Upsert unique visitor
      const { error: visitorError } = await supabase
        .rpc('upsert_visitor', {
          p_visitor_id: visitorId,
        })

      if (visitorError) {
        console.error('Error tracking visitor:', visitorError.message)
      }

      // 3. Immediately re-fetch stats so all UI counters update in real-time
      await fetchStats()
    } catch (error) {
      console.error('Tracking error:', error)
    }
  }

  // Track on initial load and subsequent route changes
  const startTracking = () => {
    if (isTrackingStarted || process.server) return
    isTrackingStarted = true

    // Track initial page
    trackPageVisit()

    // Track on route change
    router.afterEach(() => {
      // Delay slightly to let document.title and route finalize
      setTimeout(() => {
        trackPageVisit()
      }, 100)
    })
  }

  return {
    stats,
    fetchStats,
    trackPageVisit,
    startTracking,
  }
}
