/**
 * Auth Middleware
 * Protects admin routes
 */

export default defineNuxtRouteMiddleware(async (to) => {
  // Skip middleware untuk login page
  if (!to.path.startsWith('/admin') || to.path === '/admin/login') return;

  // Client-side only
  if (process.server) return;

  const { checkAuth } = useAuth();
  try {
    const user = await checkAuth();
    if (!user) {
      // Hanya redirect ke login jika tidak ada user
      return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath } });
    }
  } catch (error) {
    // Log error tapi jangan redirect - user mungkin masih autentik
    console.warn('Auth check error:', error);
    // Jangan redirect ke login, biarkan page load dan retry auth
    return;
  }
});
