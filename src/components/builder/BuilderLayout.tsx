import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { TopToolbar } from './toolbar/TopToolbar';
import { LeftSidebar } from './sidebar/LeftSidebar';
import { Canvas } from './canvas/Canvas';
import { RightSidebar } from './properties/RightSidebar';
import { useEditorStore } from '../../store/editorStore';
import { componentRegistry } from '../../lib/component-registry';
import type { ComponentType, BuilderNode } from '../../types/builder';
import { v4 as uuidv4 } from 'uuid';
import { getIcon } from './sidebar/LeftSidebar';

export function BuilderLayout() {
  const { addNode, setDragging } = useEditorStore();
  const [activeDragType, setActiveDragType] = useState<ComponentType | null>(null);

  // Configure sensors for better drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const data = active.data.current;
    
    if (data?.from === 'sidebar') {
      setActiveDragType(data.type as ComponentType);
      setDragging(true);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveDragType(null);
    setDragging(false);

    // Check if dropped on a valid target
    if (!over) return;

    const dragData = active.data.current;
    const dropData = over.data.current;

    // Only handle drops from sidebar
    if (dragData?.from !== 'sidebar') return;

    const componentType = dragData.type as ComponentType;
    const def = componentRegistry[componentType];
    if (!def) return;

    // Create new node
    const newNode: BuilderNode = {
      id: uuidv4(),
      type: componentType,
      name: def.label,
      props: { ...def.defaultProps },
      styles: { ...def.defaultStyles },
      children: [],
    };

    // Determine where to drop
    if (dropData?.type === 'dropzone') {
      // Dropped on a container's drop zone
      addNode(newNode, dropData.parentId);
    } else if (dropData?.type === 'canvas') {
      // Dropped on the canvas root
      addNode(newNode);
    }
  };

  const handleDragCancel = () => {
    setActiveDragType(null);
    setDragging(false);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="h-screen w-screen flex flex-col bg-[#0f0f1e] overflow-hidden">
        {/* Top Toolbar */}
        <TopToolbar />

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <LeftSidebar />

          {/* Center Canvas */}
          <Canvas />

          {/* Right Sidebar */}
          <RightSidebar />
        </div>
      </div>

      {/* Drag Overlay - shows what's being dragged */}
      <DragOverlay>
        {activeDragType && <DragOverlayContent type={activeDragType} />}
      </DragOverlay>
    </DndContext>
  );
}

// Drag overlay content
function DragOverlayContent({ type }: { type: ComponentType }) {
  const def = componentRegistry[type];
  if (!def) return null;
  const Icon = getIcon(def.icon);

  return (
    <div className="flex items-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-lg shadow-xl shadow-blue-500/30 text-sm font-medium pointer-events-none">
      <Icon size={16} />
      <span>{def.label}</span>
    </div>
  );
}
