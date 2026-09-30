import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { v4 as uuidv4 } from 'uuid';
import { useEditorStore } from '../../../store/editorStore';
import { componentRegistry } from '../../../lib/component-registry';
import type { BuilderNode } from '../../../types/builder';
import { Copy, Trash2, Layers, Move } from 'lucide-react';

// ============================================================
// Droppable Canvas Area
// ============================================================
function DroppableCanvas({ children }: { children: React.ReactNode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-root',
    data: { type: 'canvas' },
  });

  return (
    <div
      ref={setNodeRef}
      className={`bg-white rounded-lg shadow-2xl shadow-black/20 min-h-[calc(100vh-120px)] overflow-hidden transition-all ${
        isOver ? 'ring-4 ring-blue-500/50 ring-offset-2 ring-offset-[#0f0f1e]' : ''
      }`}
    >
      {children}
    </div>
  );
}

// ============================================================
// Droppable Zone (for containers)
// ============================================================
function DropZone({ parentId }: { parentId: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: `dropzone-${parentId}`,
    data: { type: 'dropzone', parentId },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center justify-center min-h-[60px] border-2 border-dashed rounded-lg text-sm transition-all ${
        isOver
          ? 'border-blue-500 bg-blue-50 text-blue-600 scale-[1.02]'
          : 'border-gray-300 text-gray-400 hover:border-blue-400 hover:bg-blue-50/30'
      }`}
    >
      {isOver ? '↓ Drop here' : 'Drop components here'}
    </div>
  );
}

// ============================================================
// Component Renderer - renders a single node
// ============================================================
function ComponentRenderer({ node }: { node: BuilderNode }) {
  const { selectedNodeId, hoveredNodeId, selectNode, setHoveredNode, viewportMode } = useEditorStore();
  const isSelected = selectedNodeId === node.id;
  const isHovered = hoveredNodeId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNode(node.id);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setHoveredNode(node.id);
  };

  const handleMouseLeave = () => {
    setHoveredNode(null);
  };

  // Get responsive styles based on viewport
  const baseStyles = { ...node.styles };
  if (viewportMode === 'tablet' && node.responsiveStyles?.tablet) {
    Object.assign(baseStyles, node.responsiveStyles.tablet);
  } else if (viewportMode === 'mobile' && node.responsiveStyles?.mobile) {
    Object.assign(baseStyles, node.responsiveStyles.mobile);
  }

  const renderContent = () => {
    switch (node.type) {
      case 'section':
        return (
          <div style={baseStyles} className="min-h-[100px]">
            {node.children.length === 0 && <DropZone parentId={node.id} />}
            {node.children.map((child) => (
              <ComponentRenderer key={child.id} node={child} />
            ))}
          </div>
        );

      case 'container':
        return (
          <div style={baseStyles}>
            {node.children.length === 0 && <DropZone parentId={node.id} />}
            {node.children.map((child) => (
              <ComponentRenderer key={child.id} node={child} />
            ))}
          </div>
        );

      case 'row':
        return (
          <div style={baseStyles}>
            {node.children.length === 0 && <DropZone parentId={node.id} />}
            {node.children.map((child) => (
              <ComponentRenderer key={child.id} node={child} />
            ))}
          </div>
        );

      case 'columns':
        return (
          <div style={baseStyles}>
            {node.children.length === 0 && <DropZone parentId={node.id} />}
            {node.children.map((child) => (
              <ComponentRenderer key={child.id} node={child} />
            ))}
          </div>
        );

      case 'heading': {
        const Tag = ((node.props.tag as string) || 'h2') as keyof JSX.IntrinsicElements;
        return (
          <Tag style={baseStyles}>
            {node.props.text as string}
          </Tag>
        );
      }

      case 'paragraph':
        return (
          <p style={baseStyles}>
            {node.props.text as string}
          </p>
        );

      case 'text':
        return (
          <span style={baseStyles}>
            {node.props.text as string}
          </span>
        );

      case 'button':
        return (
          <button style={baseStyles}>
            {node.props.text as string}
          </button>
        );

      case 'image':
        return (
          <div style={baseStyles} className="bg-gray-100 flex items-center justify-center overflow-hidden">
            {(node.props.src as string) ? (
              <img
                src={node.props.src as string}
                alt={node.props.alt as string}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-gray-400">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span className="text-xs">Image placeholder</span>
              </div>
            )}
          </div>
        );

      case 'spacer':
        return <div style={baseStyles} />;

      case 'divider':
        return <hr style={baseStyles} />;

      case 'card':
        return (
          <div style={baseStyles}>
            {node.children.length > 0 ? (
              node.children.map((child) => (
                <ComponentRenderer key={child.id} node={child} />
              ))
            ) : (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {node.props.title as string}
                </h3>
                <p className="text-sm text-gray-600">
                  {node.props.description as string}
                </p>
              </>
            )}
          </div>
        );

      case 'navbar':
        return (
          <nav style={baseStyles}>
            <span className="font-bold text-lg">{node.props.brand as string}</span>
            <div className="flex items-center gap-4">
              {(node.props.links as string[]).map((link: string, i: number) => (
                <span key={i} className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
                  {link}
                </span>
              ))}
            </div>
          </nav>
        );

      case 'footer':
        return (
          <footer style={baseStyles}>
            <p className="text-sm">{node.props.copyright as string}</p>
            {node.children.map((child) => (
              <ComponentRenderer key={child.id} node={child} />
            ))}
          </footer>
        );

      case 'input':
        return (
          <div className="mb-3">
            {!!node.props.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {node.props.label as string}
              </label>
            )}
            <input
              type={(node.props.type as string) || 'text'}
              placeholder={node.props.placeholder as string}
              style={baseStyles}
              readOnly
            />
          </div>
        );

      case 'textarea':
        return (
          <div className="mb-3">
            {!!node.props.label && (
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {node.props.label as string}
              </label>
            )}
            <textarea
              placeholder={node.props.placeholder as string}
              rows={(node.props.rows as number) || 4}
              style={baseStyles}
              readOnly
            />
          </div>
        );

      case 'contact-form':
        return (
          <div style={baseStyles}>
            {node.children.length > 0 ? (
              node.children.map((child) => (
                <ComponentRenderer key={child.id} node={child} />
              ))
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input type="text" placeholder="Your name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" readOnly />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" placeholder="your@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" readOnly />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea placeholder="Your message..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" readOnly />
                </div>
                <button className="px-6 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium">
                  {node.props.submitText as string}
                </button>
              </>
            )}
          </div>
        );

      default:
        return (
          <div style={baseStyles} className="p-4 border border-dashed border-gray-300 rounded text-center text-gray-500 text-sm">
            {componentRegistry[node.type]?.label || node.type}
          </div>
        );
    }
  };

  return (
    <div
      className={`relative group ${isSelected ? 'ring-2 ring-blue-500 ring-offset-1' : ''} ${
        isHovered && !isSelected ? 'ring-1 ring-blue-400/50' : ''
      }`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-node-id={node.id}
      data-node-type={node.type}
    >
      {/* Selection label */}
      {(isSelected || isHovered) && (
        <div
          className={`absolute -top-5 left-0 px-1.5 py-0.5 text-[10px] font-medium rounded-t z-50 ${
            isSelected
              ? 'bg-blue-500 text-white'
              : 'bg-blue-400/80 text-white'
          }`}
        >
          {node.name || node.type}
        </div>
      )}

      {/* Selection toolbar */}
      {isSelected && (
        <div className="absolute -top-5 right-0 flex items-center gap-0.5 z-50">
          <button
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Move"
            onClick={(e) => e.stopPropagation()}
          >
            <Move size={10} />
          </button>
          <button
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Duplicate"
            onClick={(e) => {
              e.stopPropagation();
              useEditorStore.getState().duplicateNode(node.id);
            }}
          >
            <Layers size={10} />
          </button>
          <button
            className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            title="Copy"
            onClick={(e) => {
              e.stopPropagation();
              useEditorStore.getState().copyNode(node.id);
            }}
          >
            <Copy size={10} />
          </button>
          <button
            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              useEditorStore.getState().deleteNode(node.id);
            }}
          >
            <Trash2 size={10} />
          </button>
        </div>
      )}

      {renderContent()}
    </div>
  );
}

// ============================================================
// Canvas
// ============================================================
export function Canvas() {
  const { viewportMode, selectNode, project, currentPageId, addNode } = useEditorStore();
  const page = project.pages.find((p) => p.id === currentPageId);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.canvas) {
      selectNode(null);
    }
  };

  // Quick start - add a basic page structure
  const handleQuickStart = () => {
    // Add a section with navbar
    const navbar: BuilderNode = {
      id: uuidv4(),
      type: 'navbar',
      name: 'Navbar',
      props: { brand: 'My Website', links: ['Home', 'About', 'Contact'] },
      styles: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 24px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
      },
      children: [],
    };
    addNode(navbar);

    // Add a hero section
    const heroSection: BuilderNode = {
      id: uuidv4(),
      type: 'section',
      name: 'Hero Section',
      props: {},
      styles: {
        paddingTop: '80px',
        paddingBottom: '80px',
        paddingLeft: '20px',
        paddingRight: '20px',
        backgroundColor: '#f9fafb',
        textAlign: 'center',
      },
      children: [
        {
          id: uuidv4(),
          type: 'container',
          name: 'Container',
          props: {},
          styles: {
            maxWidth: '800px',
            marginLeft: 'auto',
            marginRight: 'auto',
          },
          children: [
            {
              id: uuidv4(),
              type: 'heading',
              name: 'Hero Heading',
              props: { text: 'Welcome to My Website', tag: 'h1' },
              styles: {
                fontSize: '48px',
                fontWeight: '700',
                lineHeight: '1.2',
                color: '#1f2937',
                marginBottom: '24px',
              },
              children: [],
            },
            {
              id: uuidv4(),
              type: 'paragraph',
              name: 'Hero Text',
              props: { text: 'Build amazing websites with our visual builder. No coding required.' },
              styles: {
                fontSize: '20px',
                lineHeight: '1.6',
                color: '#6b7280',
                marginBottom: '32px',
              },
              children: [],
            },
            {
              id: uuidv4(),
              type: 'button',
              name: 'CTA Button',
              props: { text: 'Get Started', link: '#' },
              styles: {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 32px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                border: 'none',
              },
              children: [],
            },
          ],
        },
      ],
    };
    addNode(heroSection);

    // Add a footer
    const footer: BuilderNode = {
      id: uuidv4(),
      type: 'footer',
      name: 'Footer',
      props: { copyright: '© 2026 My Website. All rights reserved.' },
      styles: {
        padding: '40px 24px',
        backgroundColor: '#1f2937',
        color: '#ffffff',
        textAlign: 'center',
      },
      children: [],
    };
    addNode(footer);
  };

  // Viewport widths
  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  return (
    <div
      className="flex-1 overflow-auto bg-[#0f0f1e] flex justify-center"
      onClick={handleCanvasClick}
    >
      <div
        className="relative my-8 transition-all duration-300 ease-in-out"
        style={{
          width: viewportWidths[viewportMode],
          maxWidth: '100%',
          minHeight: 'calc(100vh - 120px)',
        }}
      >
        {/* Canvas frame with droppable */}
        <DroppableCanvas>
          {/* Empty state */}
          {(!page || page.nodes.length === 0) && (
            <div
              data-canvas="true"
              className="flex flex-col items-center justify-center min-h-[500px] text-center p-8"
            >
              <div className="w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Start Building Your Website</h3>
              <p className="text-sm text-gray-500 max-w-md mb-8">
                Drag components from the left sidebar, click to add them, or start with a template.
              </p>

              {/* Quick Start Button */}
              <button
                onClick={handleQuickStart}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 mb-6"
              >
                Start with Basic Template
              </button>

              {/* Instructions */}
              <div className="flex gap-8 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <span>Click components to add</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <path d="M5 9l4-4 4 4M9 5v14" />
                    </svg>
                  </div>
                  <span>Drag to reposition</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1" />
                    </svg>
                  </div>
                  <span>Edit in properties panel</span>
                </div>
              </div>
            </div>
          )}

          {/* Render nodes */}
          {page?.nodes.map((node) => (
            <ComponentRenderer key={node.id} node={node} />
          ))}
        </DroppableCanvas>
      </div>
    </div>
  );
}
