/**
 * Page Tracking Client Plugin
 * Automatically starts visitor and page tracking on client initialization
 */
export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const { startTracking } = usePageTracking()
    startTracking()
  }
})
