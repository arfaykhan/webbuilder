import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
  BuilderNode,
  ComponentType,
  EditorState,
  Page,
  ViewportMode,
} from '../types/builder';

// ============================================================
// Default project
// ============================================================
function createDefaultPage(name: string, slug: string, isHomepage: boolean): Page {
  return {
    id: uuidv4(),
    name,
    slug,
    isHomepage,
    nodes: [],
  };
}

function createDefaultProject() {
  const homePage = createDefaultPage('Home', '/', true);
  return {
    id: uuidv4(),
    name: 'My Website',
    pages: [homePage],
    globalStyles: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#06b6d4',
        background: '#ffffff',
        text: '#1f2937',
        muted: '#6b7280',
      },
      typography: {
        heading: 'Inter, sans-serif',
        body: 'Inter, sans-serif',
        button: 'Inter, sans-serif',
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// ============================================================
// Store interface
// ============================================================
interface EditorActions {
  // Viewport
  setViewportMode: (mode: ViewportMode) => void;

  // Selection
  selectNode: (id: string | null) => void;
  setHoveredNode: (id: string | null) => void;

  // Sidebar
  setLeftSidebarTab: (tab: 'elements' | 'layers' | 'pages' | 'assets') => void;

  // Node operations
  addNode: (node: BuilderNode, parentId?: string, index?: number) => void;
  updateNode: (id: string, updates: Partial<BuilderNode>) => void;
  updateNodeStyles: (id: string, styles: Record<string, string>) => void;
  updateNodeProps: (id: string, props: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  moveNode: (id: string, newParentId: string | null, index: number) => void;

  // Pages
  addPage: (name: string) => void;
  deletePage: (id: string) => void;
  setCurrentPage: (id: string) => void;
  updatePageName: (id: string, name: string) => void;
  setHomepage: (id: string) => void;

  // Clipboard
  copyNode: (id: string) => void;
  pasteNode: (parentId: string | null) => void;

  // Drag state
  setDragging: (isDragging: boolean) => void;

  // Save status
  setSaveStatus: (status: 'saved' | 'saving' | 'unsaved') => void;

  // Project
  setProjectName: (name: string) => void;

  // Helpers
  findNode: (id: string) => BuilderNode | null;
  findNodeParent: (id: string) => BuilderNode | null;
  getCurrentPage: () => Page;
}

type EditorStore = EditorState & EditorActions;

// ============================================================
// Helper functions for tree operations
// ============================================================
function findNodeInTree(nodes: BuilderNode[], id: string): BuilderNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const found = findNodeInTree(node.children, id);
    if (found) return found;
  }
  return null;
}

function findParentInTree(nodes: BuilderNode[], id: string, parent: BuilderNode | null = null): BuilderNode | null {
  for (const node of nodes) {
    if (node.id === id) return parent;
    const found = findParentInTree(node.children, id, node);
    if (found) return found;
  }
  return null;
}

function removeNodeFromTree(nodes: BuilderNode[], id: string): BuilderNode[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) => ({
      ...node,
      children: removeNodeFromTree(node.children, id),
    }));
}

function insertNodeInTree(
  nodes: BuilderNode[],
  parentId: string | null,
  newNode: BuilderNode,
  index?: number
): BuilderNode[] {
  if (parentId === null) {
    const newNodes = [...nodes];
    if (index !== undefined) {
      newNodes.splice(index, 0, newNode);
    } else {
      newNodes.push(newNode);
    }
    return newNodes;
  }

  return nodes.map((node) => {
    if (node.id === parentId) {
      const newChildren = [...node.children];
      if (index !== undefined) {
        newChildren.splice(index, 0, newNode);
      } else {
        newChildren.push(newNode);
      }
      return { ...node, children: newChildren };
    }
    return {
      ...node,
      children: insertNodeInTree(node.children, parentId, newNode, index),
    };
  });
}

function updateNodeInTree(nodes: BuilderNode[], id: string, updates: Partial<BuilderNode>): BuilderNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return { ...node, ...updates };
    }
    return {
      ...node,
      children: updateNodeInTree(node.children, id, updates),
    };
  });
}

function deepCloneNode(node: BuilderNode): BuilderNode {
  return {
    ...node,
    id: uuidv4(),
    children: node.children.map(deepCloneNode),
  };
}

// ============================================================
// Store
// ============================================================
export const useEditorStore = create<EditorStore>((set, get) => ({
  // Initial state
  ...(() => {
    const project = createDefaultProject();
    return {
      project,
      currentPageId: project.pages[0].id,
      selectedNodeId: null,
      hoveredNodeId: null,
      viewportMode: 'desktop' as ViewportMode,
      leftSidebarTab: 'elements' as const,
      isDragging: false,
      clipboard: null,
      saveStatus: 'saved' as const,
    };
  })(),

  // Viewport
  setViewportMode: (mode) => set({ viewportMode: mode }),

  // Selection
  selectNode: (id) => set({ selectedNodeId: id }),
  setHoveredNode: (id) => set({ hoveredNodeId: id }),

  // Sidebar
  setLeftSidebarTab: (tab) => set({ leftSidebarTab: tab }),

  // Node operations
  addNode: (node, parentId, index) => {
    const { project, currentPageId } = get();
    const pages = project.pages.map((page) => {
      if (page.id === currentPageId) {
        return {
          ...page,
          nodes: insertNodeInTree(page.nodes, parentId || null, node, index),
        };
      }
      return page;
    });
    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
      selectedNodeId: node.id,
    });
  },

  updateNode: (id, updates) => {
    const { project, currentPageId } = get();
    const pages = project.pages.map((page) => {
      if (page.id === currentPageId) {
        return { ...page, nodes: updateNodeInTree(page.nodes, id, updates) };
      }
      return page;
    });
    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
    });
  },

  updateNodeStyles: (id, styles) => {
    const { project, currentPageId } = get();
    const pages = project.pages.map((page) => {
      if (page.id === currentPageId) {
        const node = findNodeInTree(page.nodes, id);
        if (node) {
          return {
            ...page,
            nodes: updateNodeInTree(page.nodes, id, {
              styles: { ...node.styles, ...styles },
            }),
          };
        }
      }
      return page;
    });
    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
    });
  },

  updateNodeProps: (id, props) => {
    const { project, currentPageId } = get();
    const pages = project.pages.map((page) => {
      if (page.id === currentPageId) {
        const node = findNodeInTree(page.nodes, id);
        if (node) {
          return {
            ...page,
            nodes: updateNodeInTree(page.nodes, id, {
              props: { ...node.props, ...props },
            }),
          };
        }
      }
      return page;
    });
    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
    });
  },

  deleteNode: (id) => {
    const { project, currentPageId, selectedNodeId } = get();
    const pages = project.pages.map((page) => {
      if (page.id === currentPageId) {
        return { ...page, nodes: removeNodeFromTree(page.nodes, id) };
      }
      return page;
    });
    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
      selectedNodeId: selectedNodeId === id ? null : selectedNodeId,
    });
  },

  duplicateNode: (id) => {
    const { project, currentPageId } = get();
    const page = project.pages.find((p) => p.id === currentPageId);
    if (!page) return;

    const node = findNodeInTree(page.nodes, id);
    if (!node) return;

    const parent = findParentInTree(page.nodes, id);
    const cloned = deepCloneNode(node);

    const pages = project.pages.map((p) => {
      if (p.id === currentPageId) {
        if (parent) {
          const parentIndex = parent.children.findIndex((c) => c.id === id);
          return {
            ...p,
            nodes: insertNodeInTree(p.nodes, parent.id, cloned, parentIndex + 1),
          };
        } else {
          const rootIndex = p.nodes.findIndex((c) => c.id === id);
          return {
            ...p,
            nodes: insertNodeInTree(p.nodes, null, cloned, rootIndex + 1),
          };
        }
      }
      return p;
    });

    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
      selectedNodeId: cloned.id,
    });
  },

  moveNode: (id, newParentId, index) => {
    const { project, currentPageId } = get();
    const page = project.pages.find((p) => p.id === currentPageId);
    if (!page) return;

    const node = findNodeInTree(page.nodes, id);
    if (!node) return;

    // Remove from current position
    let nodes = removeNodeFromTree(page.nodes, id);
    // Insert at new position
    nodes = insertNodeInTree(nodes, newParentId, node, index);

    const pages = project.pages.map((p) => {
      if (p.id === currentPageId) {
        return { ...p, nodes };
      }
      return p;
    });

    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
    });
  },

  // Pages
  addPage: (name) => {
    const { project } = get();
    const slug = '/' + name.toLowerCase().replace(/\s+/g, '-');
    const newPage = createDefaultPage(name, slug, false);
    set({
      project: {
        ...project,
        pages: [...project.pages, newPage],
        updatedAt: new Date().toISOString(),
      },
      currentPageId: newPage.id,
      selectedNodeId: null,
      saveStatus: 'unsaved',
    });
  },

  deletePage: (id) => {
    const { project, currentPageId } = get();
    if (project.pages.length <= 1) return;

    const pages = project.pages.filter((p) => p.id !== id);
    const newCurrentPageId = currentPageId === id ? pages[0].id : currentPageId;

    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      currentPageId: newCurrentPageId,
      selectedNodeId: null,
      saveStatus: 'unsaved',
    });
  },

  setCurrentPage: (id) => set({ currentPageId: id, selectedNodeId: null }),

  updatePageName: (id, name) => {
    const { project } = get();
    const pages = project.pages.map((p) =>
      p.id === id ? { ...p, name, slug: '/' + name.toLowerCase().replace(/\s+/g, '-') } : p
    );
    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
    });
  },

  setHomepage: (id) => {
    const { project } = get();
    const pages = project.pages.map((p) => ({
      ...p,
      isHomepage: p.id === id,
      slug: p.id === id ? '/' : p.slug,
    }));
    set({
      project: { ...project, pages, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
    });
  },

  // Clipboard
  copyNode: (id) => {
    const { project, currentPageId } = get();
    const page = project.pages.find((p) => p.id === currentPageId);
    if (!page) return;

    const node = findNodeInTree(page.nodes, id);
    if (node) {
      set({ clipboard: JSON.parse(JSON.stringify(node)) });
    }
  },

  pasteNode: (parentId) => {
    const { clipboard } = get();
    if (!clipboard) return;

    const cloned = deepCloneNode(clipboard);
    get().addNode(cloned, parentId || undefined);
  },

  // Drag state
  setDragging: (isDragging) => set({ isDragging }),

  // Save status
  setSaveStatus: (status) => set({ saveStatus: status }),

  // Project
  setProjectName: (name) => {
    const { project } = get();
    set({
      project: { ...project, name, updatedAt: new Date().toISOString() },
      saveStatus: 'unsaved',
    });
  },

  // Helpers
  findNode: (id) => {
    const { project, currentPageId } = get();
    const page = project.pages.find((p) => p.id === currentPageId);
    if (!page) return null;
    return findNodeInTree(page.nodes, id);
  },

  findNodeParent: (id) => {
    const { project, currentPageId } = get();
    const page = project.pages.find((p) => p.id === currentPageId);
    if (!page) return null;
    return findParentInTree(page.nodes, id);
  },

  getCurrentPage: () => {
    const { project, currentPageId } = get();
    return project.pages.find((p) => p.id === currentPageId) || project.pages[0];
  },
}));
