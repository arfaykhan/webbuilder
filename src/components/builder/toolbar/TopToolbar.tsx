import {
  Undo2,
  Redo2,
  Eye,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Rocket,
  ChevronLeft,
  Check,
  Loader2,
} from 'lucide-react';
import { useEditorStore } from '../../../store/editorStore';
import type { ViewportMode } from '../../../types/builder';

export function TopToolbar() {
  const {
    project,
    viewportMode,
    setViewportMode,
    saveStatus,
    setSaveStatus,
    setProjectName,
  } = useEditorStore();

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 1000);
  };

  const viewportButtons: { mode: ViewportMode; icon: typeof Monitor; label: string }[] = [
    { mode: 'desktop', icon: Monitor, label: 'Desktop' },
    { mode: 'tablet', icon: Tablet, label: 'Tablet' },
    { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
  ];

  return (
    <header className="h-14 bg-[#1a1a2e] border-b border-[#2a2a4a] flex items-center justify-between px-4 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ChevronLeft size={18} />
        </button>
        <div className="w-px h-6 bg-[#2a2a4a]" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">W</span>
          </div>
          <input
            type="text"
            value={project.name}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-transparent text-white text-sm font-medium border-none outline-none hover:bg-[#2a2a4a] px-2 py-1 rounded transition-colors w-40"
          />
        </div>
      </div>

      {/* Center section - Viewport switcher */}
      <div className="flex items-center gap-1 bg-[#0f0f1e] rounded-lg p-1">
        {viewportButtons.map(({ mode, icon: Icon, label }) => (
          <button
            key={mode}
            onClick={() => setViewportMode(mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewportMode === mode
                ? 'bg-[#3b82f6] text-white shadow-lg shadow-blue-500/20'
                : 'text-gray-400 hover:text-white hover:bg-[#2a2a4a]'
            }`}
            title={label}
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Save status */}
        <div className="flex items-center gap-1.5 text-xs mr-2">
          {saveStatus === 'saved' && (
            <span className="flex items-center gap-1 text-green-400">
              <Check size={12} />
              Saved
            </span>
          )}
          {saveStatus === 'saving' && (
            <span className="flex items-center gap-1 text-yellow-400">
              <Loader2 size={12} className="animate-spin" />
              Saving...
            </span>
          )}
          {saveStatus === 'unsaved' && (
            <span className="text-gray-500">Unsaved changes</span>
          )}
        </div>

        <div className="w-px h-6 bg-[#2a2a4a]" />

        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a4a] rounded-lg transition-colors"
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a4a] rounded-lg transition-colors"
          title="Redo"
        >
          <Redo2 size={16} />
        </button>
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a4a] rounded-lg transition-colors"
          title="Preview"
        >
          <Eye size={16} />
        </button>
        <button
          onClick={handleSave}
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a4a] rounded-lg transition-colors"
          title="Save"
        >
          <Save size={16} />
        </button>
        <button
          className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2a4a] rounded-lg transition-colors"
          title="Export"
        >
          <Download size={16} />
        </button>
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20">
          <Rocket size={14} />
          Publish
        </button>
      </div>
    </header>
  );
}
