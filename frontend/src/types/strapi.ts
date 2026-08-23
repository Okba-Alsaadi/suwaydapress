export interface StrapiEntity {
  id: number;
  documentId?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface StrapiImageFormat {
  url: string;
  width?: number;
  height?: number;
}

export interface StrapiImage extends StrapiEntity {
  url: string;
  alternativeText?: string | null;
  caption?: string | null;
  width?: number;
  height?: number;
  formats?: {
    large?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    small?: StrapiImageFormat;
    thumbnail?: StrapiImageFormat;
  };
}

export interface Category extends StrapiEntity {
  name: string;
  slug: string;
  parent?: Category | null;
  children?: Category[];
  order?: number;
  active?: boolean;
  show_in_navbar?: boolean;
  articles?: Article[];
}

export interface Author extends StrapiEntity {
  name: string;
  slug: string;
  photo?: StrapiImage | null;
  bio?: any;
  role: 'Editor' | 'Contributor';
  active: boolean;
  articles?: Article[];
}

export interface Tag extends StrapiEntity {
  name: string;
  slug: string;
  description?: string | null;
  articles?: Article[];
}

export interface DiscussionPost extends StrapiEntity {
  display_name: string;
  anonymous: boolean;
  content: string;
  referenced_article?: Article | null;
  post_status: 'Pending' | 'Approved' | 'Rejected';
  reviewed_by?: any; // Admin user relation
}

export interface Subscriber extends StrapiEntity {
  name?: string | null;
  email: string;
  confirmed: boolean;
  source?: string | null;
}

export interface Imageblock {
  id: number;
  image: StrapiImage[];
  caption?: string | null;
  credit?: string | null;
}

export type LayoutType = 'Grid4' | 'Grid6' | 'List' | 'Mixed';

export interface Sectionblock {
  id: number;
  section_title: string;
  linked_category: Category | null;
  layout_type: 'Grid4' | 'Grid6' | 'List' | 'Mixed';
  manual_articles: Article[];
  show_more_button: boolean;
  section_style?: 'default' | 'grey-background' | 'two-column-left' | 'two-column-right';
}

export type ContentType =
  | 'news'
  | 'economy'
  | 'investigation'
  | 'fact check'
  | 'interview'
  | 'documentation'
  | 'map'
  | 'media'
  | 'opinion'
  | 'feature';

export interface Article extends StrapiEntity {
  title: string;
  slug: string;
  content: any;
  featured_image?: StrapiImage | null;
  excerpt?: string | null;
  category?: Category | null;
  tags?: Tag[];
  content_type_editorial: ContentType;
  author?: Author | null;
  breaking?: boolean;
  breaking_until?: string | null;
  featured?: boolean;
  external_url?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image?: StrapiImage | null;
  canonical_url?: string | null;
  gallery?: Imageblock[];
  discussion_posts?: DiscussionPost[];
  related_articles?: Article[];
  highlight?: string;
}

export interface Homepage extends StrapiEntity {
  main_headline?: Article | null;
  secondary_headlines?: Article[];
  editor_picks?: Article[];
  sections?: Sectionblock[];
}
