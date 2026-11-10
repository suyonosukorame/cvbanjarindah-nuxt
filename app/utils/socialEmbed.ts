/**
 * Social Media Embed Utility
 * Detects and parses YouTube, Instagram, and TikTok links or IDs
 */

export type SocialPlatform = 'youtube' | 'instagram' | 'tiktok';

export interface ParsedSocialMedia {
  platform: SocialPlatform;
  id: string;
  embedUrl: string;
  directUrl: string;
  label: string;
  actionText: string;
  icon: string;
  badgeBg: string;
  badgeText: string;
  gradientClass: string;
}

export function parseSocialMedia(input: string | null | undefined): ParsedSocialMedia | null {
  if (!input) return null;
  const raw = String(input).trim();
  if (!raw) return null;

  // 1. YouTube Detection (Video, Shorts, or youtu.be)
  // Handles: youtube.com/watch?v=ID, youtube.com/shorts/ID, youtu.be/ID, youtube.com/embed/ID
  const ytRegex = /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const ytMatch = raw.match(ytRegex);
  if (ytMatch) {
    const id = ytMatch[1];
    return {
      platform: 'youtube',
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&rel=0&modestbranding=1`,
      directUrl: `https://www.youtube.com/watch?v=${id}`,
      label: 'YouTube',
      actionText: 'Tonton di YouTube (HD)',
      icon: 'smart_display',
      badgeBg: 'bg-red-600',
      badgeText: 'text-white',
      gradientClass: 'from-red-600 to-rose-700',
    };
  }

  // 2. Instagram Detection (Reels or Feed Post)
  // Handles: instagram.com/reel/CODE, instagram.com/p/CODE, instagram.com/tv/CODE
  const igRegex = /instagram\.com\/(?:reel|p|tv)\/([a-zA-Z0-9_-]+)/;
  const igMatch = raw.match(igRegex);
  if (igMatch) {
    const id = igMatch[1];
    return {
      platform: 'instagram',
      id,
      embedUrl: `https://www.instagram.com/p/${id}/embed/captioned/`,
      directUrl: `https://www.instagram.com/reel/${id}/`,
      label: 'Instagram',
      actionText: 'Buka di Instagram',
      icon: 'photo_camera',
      badgeBg: 'bg-gradient-to-r from-purple-500 to-pink-500',
      badgeText: 'text-white',
      gradientClass: 'from-purple-600 via-pink-600 to-orange-500',
    };
  }

  // 3. TikTok Detection (URL or bare numerical ID)
  // Handles: tiktok.com/@user/photo/ID, tiktok.com/@user/video/ID, or 15-25 digit number
  const ttRegex = /tiktok\.com\/@[^/]+\/(?:video|photo)\/(\d+)/;
  const ttMatch = raw.match(ttRegex);
  const bareDigits = raw.match(/^\d{15,25}$/);

  if (ttMatch || bareDigits) {
    const id = ttMatch ? ttMatch[1] : bareDigits![0];
    return {
      platform: 'tiktok',
      id,
      embedUrl: `https://www.tiktok.com/player/v1/${id}?music_info=1&description=1&rel=0&autoplay=0`,
      directUrl: `https://www.tiktok.com/@cvbanjarindah/photo/${id}`,
      label: 'TikTok',
      actionText: 'Putar di TikTok (Musik & HD)',
      icon: 'music_note',
      badgeBg: 'bg-slate-900',
      badgeText: 'text-white',
      gradientClass: 'from-[#fe2c55] via-[#ff0050] to-[#25f4ee]',
    };
  }

  // 4. Fallback if user just entered an 11-char YouTube ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw) && !/^\d+$/.test(raw)) {
    return {
      platform: 'youtube',
      id: raw,
      embedUrl: `https://www.youtube-nocookie.com/embed/${raw}?autoplay=0&rel=0&modestbranding=1`,
      directUrl: `https://www.youtube.com/watch?v=${raw}`,
      label: 'YouTube',
      actionText: 'Tonton di YouTube',
      icon: 'smart_display',
      badgeBg: 'bg-red-600',
      badgeText: 'text-white',
      gradientClass: 'from-red-600 to-rose-700',
    };
  }

  return null;
}
