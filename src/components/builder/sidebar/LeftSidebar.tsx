import { useState } from 'react';
import {
  useDraggable,
} from '@dnd-kit/core';
import { useEditorStore } from '../../../store/editorStore';
import { componentRegistry, getComponentsByCategory } from '../../../lib/component-registry';
import type { BuilderNode, ComponentType } from '../../../types/builder';
import { v4 as uuidv4 } from 'uuid';
import {
  Layout,
  Type,
  MousePointerClick,
  Image,
  Video,
  CreditCard,
  Menu,
  PanelBottom,
  Mail,
  Heading,
  AlignLeft,
  Box,
  Rows,
  Columns,
  MoveVertical,
  Minus,
  Star,
  Zap,
  MessageSquare,
  DollarSign,
  HelpCircle,
  GalleryHorizontal,
  Users,
  Grid3x3,
  ChevronRight,
  TextCursorInput,
  FileText,
  ChevronDown,
  CheckSquare,
  Layers,
  File,
  FolderOpen,
  type LucideIcon,
} from 'lucide-react';

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Layout, Type, MousePointerClick, Image, Video, CreditCard, Menu,
  PanelBottom, Mail, Heading, AlignLeft, Box, Rows, Columns,
  MoveVertical, Minus, Star, Zap, MessageSquare, DollarSign,
  HelpCircle, GalleryHorizontal, Users, Grid3x3, TextCursorInput,
  FileText, ChevronDown, CheckSquare,
};

export function getIcon(name: string): LucideIcon {
  return iconMap[name] || Box;
}

const categoryLabels: Record<string, string> = {
  layout: 'Layout',
  basic: 'Basic',
  content: 'Content',
  navigation: 'Navigation',
  forms: 'Forms',
};

// ============================================================
// Draggable Sidebar Component
// ============================================================
function DraggableComponent({ type, label, icon }: { type: ComponentType; label: string; icon: string }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${type}`,
    data: { type, from: 'sidebar' },
  });
  const { addNode } = useEditorStore();

  const Icon = getIcon(icon);

  const handleClick = () => {
    const def = componentRegistry[type];
    const newNode: BuilderNode = {
      id: uuidv4(),
      type,
      name: def.label,
      props: { ...def.defaultProps },
      styles: { ...def.defaultStyles },
      children: [],
    };
    addNode(newNode);
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing group select-none ${
        isDragging
          ? 'bg-blue-500/20 border-blue-500 opacity-50'
          : 'bg-[#1e1e36] border-[#2a2a4a] hover:border-blue-500/50 hover:bg-[#252545]'
      }`}
      title={`Click to add or drag ${label}`}
    >
      <Icon size={18} className="text-gray-400 group-hover:text-blue-400 transition-colors" />
      <span className="text-[10px] text-gray-500 group-hover:text-gray-300 transition-colors">
        {label}
      </span>
    </div>
  );
}

// ============================================================
// Drag Overlay (shows while dragging)
// ============================================================
function DragOverlayContent({ type }: { type: ComponentType }) {
  const def = componentRegistry[type];
  if (!def) return null;
  const Icon = getIcon(def.icon);

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg shadow-xl shadow-blue-500/30 text-xs font-medium">
      <Icon size={14} />
      <span>{def.label}</span>
    </div>
  );
}

// ============================================================
// Elements Tab
// ============================================================
function ElementsTab() {
  const { addNode } = useEditorStore();
  const categories = ['layout', 'basic', 'content', 'navigation', 'forms'] as const;
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(['layout', 'basic'])
  );

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const handleAddComponent = (type: ComponentType) => {
    const def = componentRegistry[type];
    const newNode: BuilderNode = {
      id: uuidv4(),
      type,
      name: def.label,
      props: { ...def.defaultProps },
      styles: { ...def.defaultStyles },
      children: [],
    };
    addNode(newNode);
  };

  return (
    <div className="py-2">
      {categories.map((cat) => {
        const components = getComponentsByCategory(cat);
        const isExpanded = expandedCategories.has(cat);

        return (
          <div key={cat} className="mb-1">
            <button
              onClick={() => toggleCategory(cat)}
              className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider hover:text-gray-200 transition-colors"
            >
              <span>{categoryLabels[cat]}</span>
              <ChevronRight
                size={12}
                className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}
              />
            </button>
            {isExpanded && (
              <div className="grid grid-cols-2 gap-1.5 px-3 pb-3">
                {components.map((comp) => (
                  <DraggableComponent
                    key={comp.type}
                    type={comp.type}
                    label={comp.label}
                    icon={comp.icon}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// Layers Tab
// ============================================================
function LayersTab() {
  const { project, currentPageId, selectedNodeId, selectNode } = useEditorStore();
  const page = project.pages.find((p) => p.id === currentPageId);
  if (!page) return null;

  function renderLayer(node: BuilderNode, depth: number = 0) {
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children.length > 0;

    return (
      <div key={node.id}>
        <button
          onClick={() => selectNode(node.id)}
          className={`flex items-center gap-2 w-full px-3 py-1.5 text-xs transition-colors ${
            isSelected
              ? 'bg-blue-500/20 text-blue-300 border-l-2 border-blue-500'
              : 'text-gray-400 hover:bg-[#252545] hover:text-gray-200 border-l-2 border-transparent'
          }`}
          style={{ paddingLeft: `${12 + depth * 16}px` }}
        >
          <span className="truncate">{node.name || node.type}</span>
          {hasChildren && (
            <span className="text-[10px] text-gray-600 ml-auto">
              {node.children.length}
            </span>
          )}
        </button>
        {hasChildren && node.children.map((child: BuilderNode) => renderLayer(child, depth + 1))}
      </div>
    );
  }

  return (
    <div className="py-2">
      <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
        {page.name}
      </div>
      {page.nodes.length === 0 ? (
        <div className="px-3 py-8 text-center text-xs text-gray-600">
          No elements yet. Drag components from the Elements tab.
        </div>
      ) : (
        page.nodes.map((node: BuilderNode) => renderLayer(node))
      )}
    </div>
  );
}

// ============================================================
// Pages Tab
// ============================================================
function PagesTab() {
  const { project, currentPageId, setCurrentPage, addPage, deletePage, setHomepage } = useEditorStore();

  return (
    <div className="py-2">
      <div className="px-3 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Pages</span>
        <button
          onClick={() => addPage('New Page')}
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          + Add
        </button>
      </div>
      <div className="space-y-0.5 px-2">
        {project.pages.map((page) => (
          <div
            key={page.id}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors ${
              currentPageId === page.id
                ? 'bg-blue-500/20 text-blue-300'
                : 'text-gray-400 hover:bg-[#252545] hover:text-gray-200'
            }`}
            onClick={() => setCurrentPage(page.id)}
          >
            <File size={14} />
            <span className="flex-1 truncate">{page.name}</span>
            {page.isHomepage && (
              <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">
                Home
              </span>
            )}
            {project.pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!page.isHomepage) setHomepage(page.id);
                  deletePage(page.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400"
                title="Delete page"
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Assets Tab
// ============================================================
function AssetsTab() {
  return (
    <div className="py-2">
      <div className="px-3 py-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Assets</span>
      </div>
      <div className="px-3 py-8 text-center">
        <FolderOpen size={32} className="mx-auto text-gray-600 mb-2" />
        <p className="text-xs text-gray-500">No assets uploaded yet.</p>
        <button className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">
          Upload Image
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Left Sidebar (with DnD context)
// ============================================================
export function LeftSidebar() {
  const { leftSidebarTab, setLeftSidebarTab } = useEditorStore();

  const tabs = [
    { id: 'elements' as const, icon: Layout, label: 'Elements' },
    { id: 'layers' as const, icon: Layers, label: 'Layers' },
    { id: 'pages' as const, icon: File, label: 'Pages' },
    { id: 'assets' as const, icon: FolderOpen, label: 'Assets' },
  ];

  return (
    <aside className="w-64 bg-[#16162a] border-r border-[#2a2a4a] flex flex-col shrink-0 overflow-hidden">
      {/* Tab buttons */}
      <div className="flex border-b border-[#2a2a4a]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = leftSidebarTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setLeftSidebarTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors ${
                isActive
                  ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              title={tab.label}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {leftSidebarTab === 'elements' && <ElementsTab />}
        {leftSidebarTab === 'layers' && <LayersTab />}
        {leftSidebarTab === 'pages' && <PagesTab />}
        {leftSidebarTab === 'assets' && <AssetsTab />}
      </div>
    </aside>
  );
}


