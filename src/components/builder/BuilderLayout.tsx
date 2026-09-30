import { TopToolbar } from './toolbar/TopToolbar';
import { LeftSidebar } from './sidebar/LeftSidebar';
import { Canvas } from './canvas/Canvas';
import { RightSidebar } from './properties/RightSidebar';

export function BuilderLayout() {
  return (
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
  );
}
