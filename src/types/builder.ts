// ============================================================
// Builder Types - Core schema for the website builder
// ============================================================

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

export type ComponentType =
  | 'section'
  | 'container'
  | 'row'
  | 'columns'
  | 'spacer'
  | 'divider'
  | 'heading'
  | 'paragraph'
  | 'text'
  | 'button'
  | 'image'
  | 'video'
  | 'icon'
  | 'card'
  | 'feature'
  | 'testimonial'
  | 'pricing'
  | 'faq'
  | 'gallery'
  | 'team'
  | 'logo-grid'
  | 'navbar'
  | 'breadcrumb'
  | 'footer'
  | 'input'
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'contact-form';

export interface ResponsiveStyles {
  desktop?: Record<string, string>;
  tablet?: Record<string, string>;
  mobile?: Record<string, string>;
}

export interface BuilderNode {
  id: string;
  type: ComponentType;
  name?: string;
  props: Record<string, unknown>;
  styles: Record<string, string>;
  responsiveStyles?: ResponsiveStyles;
  children: BuilderNode[];
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  isHomepage: boolean;
  nodes: BuilderNode[];
}

export interface Project {
  id: string;
  name: string;
  pages: Page[];
  globalStyles: GlobalStyles;
  createdAt: string;
  updatedAt: string;
}

export interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    heading: string;
    body: string;
    button: string;
  };
}

export interface ComponentDefinition {
  type: ComponentType;
  label: string;
  icon: string;
  category: 'layout' | 'basic' | 'content' | 'navigation' | 'forms';
  defaultProps: Record<string, unknown>;
  defaultStyles: Record<string, string>;
  validChildren: ComponentType[] | '*';
  validParents: ComponentType[] | '*';
}

export interface EditorState {
  project: Project;
  currentPageId: string;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  viewportMode: ViewportMode;
  leftSidebarTab: 'elements' | 'layers' | 'pages' | 'assets';
  isDragging: boolean;
  clipboard: BuilderNode | null;
  saveStatus: 'saved' | 'saving' | 'unsaved';
}
