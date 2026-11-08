/**
 * usePageTracking Composable
 * Tracks page visits and unique visitors to Supabase
 */

export function usePageTracking() {
  const supabase = useSupabase()
  const route = useRoute()
  const router = useRouter()
  
  // Generate or retrieve visitor ID from localStorage
  const getVisitorId = (): string => {
    if (process.server) return ''
    
    const storageKey = 'cv_visitor_id'
    let visitorId = localStorage.getItem(storageKey)
    
    if (!visitorId) {
      visitorId = crypto.randomUUID()
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
      sessionId = crypto.randomUUID()
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
  
  // Track page visit
  const trackPageVisit = async () => {
    if (process.server) {
      console.log('trackPageVisit called on server side - skipping')
      return
    }
    
    console.log('trackPageVisit started on client side')
    
    try {
      const visitorId = getVisitorId()
      const sessionId = getSessionId()
      const deviceInfo = getDeviceInfo()
      
      console.log('Tracking info:', {
        visitorId,
        sessionId,
        deviceInfo,
        pageUrl: route.path,
        pageTitle: document.title
      })
      
      // Insert page visit
      const { error: visitError, data: visitData } = await supabase
        .from('page_visits')
        .insert({
          page_url: route.path,
          page_title: document.title,
          referrer: document.referrer || null,
          user_agent: navigator.userAgent,
          session_id: sessionId,
          ...deviceInfo,
        })
        .select()
      
      if (visitError) {
        console.error('Error tracking visit:', visitError)
        console.error('Visit error details:', {
          message: visitError.message,
          details: visitError.details,
          hint: visitError.hint
        })
      } else {
        console.log('Visit tracked successfully:', visitData)
      }
      
      // Upsert unique visitor
      const { error: visitorError } = await supabase
        .rpc('upsert_visitor', {
          p_visitor_id: visitorId,
        })
      
      if (visitorError) {
        console.error('Error tracking visitor:', visitorError)
        console.error('Visitor error details:', {
          message: visitorError.message,
          details: visitorError.details,
          hint: visitorError.hint
        })
      } else {
        console.log('Visitor tracked successfully')
      }
      
    } catch (error) {
      console.error('Tracking error:', error)
    }
  }
  
  // Track on route change
  const startTracking = () => {
    // Track initial page
    trackPageVisit()
    
    // Track on route change
    router.afterEach(() => {
      trackPageVisit()
    })
  }
  
  return {
    trackPageVisit,
    startTracking,
  }
}
