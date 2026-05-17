
export interface SiteSettings {
  studio_phone?: string;
  studio_email?: string;
  studio_address?: string;
  instagram_url?: string;
  currently_working_on?: string;
  footer_text?: string;
  copyright_text?: string;
  footer_tagline?: string;
  wordmark_color?: 'white' | 'black';
}

export interface HeroContent {
  headline_line1?: string;
  headline_line2?: string;
  headline_line3?: string;
  overline_text?: string;
  tagline?: string;
  marquee_text?: string;
  background_image_url?: string;
  hero_video_url?: string;
  hero_video_enabled?: boolean;
}

export interface AboutContent {
  manifesto_line1?: string;
  manifesto_line2?: string;
  manifesto_line3?: string;
  studio_tagline?: string;
  studio_description?: string;
  studio_description_sub?: string;
  founder_name?: string;
  founder_title?: string;
  founder_image_url?: string;
  founder_instagram_url?: string;
  founder2_name?: string;
  founder2_title?: string;
  founder2_image_url?: string;
  founder2_instagram_url?: string;
  studio_image_url?: string;
  [key: string]: string | undefined | boolean | null; // For philosophy_1_title etc.
}

export interface Service {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  image_url?: string;
  video_url?: string;
  media_type?: 'image' | 'video';
  order_index: number;
  number_label?: string;
  deliverables?: string[];
  enquire_label?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photo_url?: string;
  instagram_url?: string;
  order_index: number;
  is_active: boolean;
}

export interface StatItem {
  id: string;
  label: string;
  number_value: string | number;
  order_index: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  thumbnail_url?: string;
  order_index: number;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  description?: string;
  short_description?: string;
  full_description?: string;
  thumbnail_url?: string;
  image_url?: string;
  cover_image_url?: string;
  video_url?: string;
  video_type?: 'none' | 'upload' | 'embed';
  gallery_images?: string[];
  client?: string;
  client_name?: string;
  year?: string;
  project_year?: string;
  tags?: string[];
  featured?: boolean;
  order_index: number;
}

export interface MediaFile {
  id: string;
  file_url: string;
  file_name: string;
  file_size: number;
  uploaded_at: string;
  tags?: string[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  service?: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  created_at: string;
}
