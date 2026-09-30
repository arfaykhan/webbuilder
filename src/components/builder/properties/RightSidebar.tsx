import { useEditorStore } from '../../../store/editorStore';
import { componentRegistry } from '../../../lib/component-registry';
import type { BuilderNode } from '../../../types/builder';
import {
  Type,
  Layout,
  Palette,
  Square,
  Move,
  Image,
  Sparkles,
  Monitor,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { useState } from 'react';

// ============================================================
// Property Input Components
// ============================================================
function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-gray-400 font-medium">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1e1e36] border border-[#2a2a4a] rounded-md px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-gray-400 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1e1e36] border border-[#2a2a4a] rounded-md px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500 transition-colors appearance-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberInput({
  label,
  value,
  unit,
  onChange,
}: {
  label: string;
  value: string;
  unit?: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-gray-400 font-medium">{label}</label>
      <div className="flex items-center gap-1">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#1e1e36] border border-[#2a2a4a] rounded-md px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
        />
        {unit && (
          <span className="text-[10px] text-gray-500 min-w-[20px]">{unit}</span>
        )}
      </div>
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] text-gray-400 font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 rounded border border-[#2a2a4a] cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-[#1e1e36] border border-[#2a2a4a] rounded-md px-2.5 py-1.5 text-xs text-white outline-none focus:border-blue-500 transition-colors"
        />
      </div>
    </div>
  );
}

function SpacingInput({
  label,
  values,
  onChange,
}: {
  label: string;
  values: { top: string; right: string; bottom: string; left: string };
  onChange: (side: string, val: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] text-gray-400 font-medium">{label}</label>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-0.5">
          <span className="text-[10px] text-gray-500">Top</span>
          <input
            type="text"
            value={values.top}
            onChange={(e) => onChange('top', e.target.value)}
            className="w-full bg-[#1e1e36] border border-[#2a2a4a] rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-gray-500">Right</span>
          <input
            type="text"
            value={values.right}
            onChange={(e) => onChange('right', e.target.value)}
            className="w-full bg-[#1e1e36] border border-[#2a2a4a] rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-gray-500">Bottom</span>
          <input
            type="text"
            value={values.bottom}
            onChange={(e) => onChange('bottom', e.target.value)}
            className="w-full bg-[#1e1e36] border border-[#2a2a4a] rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] text-gray-500">Left</span>
          <input
            type="text"
            value={values.left}
            onChange={(e) => onChange('left', e.target.value)}
            className="w-full bg-[#1e1e36] border border-[#2a2a4a] rounded px-2 py-1 text-xs text-white outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Section Panel
// ============================================================
function SectionPanel({ title, icon: Icon, children, defaultOpen = true }: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[#2a2a4a]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 w-full px-3 py-2.5 text-xs font-medium text-gray-300 hover:text-white transition-colors"
      >
        <Icon size={14} className="text-gray-500" />
        <span className="flex-1 text-left">{title}</span>
        <span className={`text-[10px] text-gray-500 transition-transform ${isOpen ? 'rotate-90' : ''}`}>
          ▶
        </span>
      </button>
      {isOpen && <div className="px-3 pb-3 space-y-3">{children}</div>}
    </div>
  );
}

// ============================================================
// Properties Panel
// ============================================================
function PropertiesPanel() {
  const { project, currentPageId, selectedNodeId, updateNodeProps, updateNodeStyles } = useEditorStore();
  const page = project.pages.find((p) => p.id === currentPageId);
  if (!page || !selectedNodeId) return null;

  // Find selected node in tree
  function findNode(nodes: BuilderNode[], id: string): BuilderNode | null {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = findNode(node.children, id);
      if (found) return found;
    }
    return null;
  }

  const node = findNode(page.nodes, selectedNodeId);
  if (!node) return null;

  const def = componentRegistry[node.type];

  return (
    <div className="space-y-0">
      {/* Component header */}
      <div className="px-3 py-3 border-b border-[#2a2a4a]">
        <div className="flex items-center gap-2">
          <Settings size={14} className="text-blue-400" />
          <span className="text-xs font-medium text-white">{def?.label || node.type}</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-1">ID: {node.id.slice(0, 8)}</p>
      </div>

      {/* Content section */}
      <SectionPanel title="Content" icon={Type}>
        {node.type === 'heading' && (
          <>
            <TextInput
              label="Text"
              value={(node.props.text as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { text: val })}
            />
            <SelectInput
              label="HTML Tag"
              value={(node.props.tag as string) || 'h2'}
              options={[
                { label: 'H1', value: 'h1' },
                { label: 'H2', value: 'h2' },
                { label: 'H3', value: 'h3' },
                { label: 'H4', value: 'h4' },
                { label: 'H5', value: 'h5' },
                { label: 'H6', value: 'h6' },
              ]}
              onChange={(val) => updateNodeProps(node.id, { tag: val })}
            />
          </>
        )}
        {(node.type === 'paragraph' || node.type === 'text') && (
          <TextInput
            label="Text"
            value={(node.props.text as string) || ''}
            onChange={(val) => updateNodeProps(node.id, { text: val })}
          />
        )}
        {node.type === 'button' && (
          <>
            <TextInput
              label="Button Text"
              value={(node.props.text as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { text: val })}
            />
            <TextInput
              label="Link URL"
              value={(node.props.link as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { link: val })}
            />
          </>
        )}
        {node.type === 'image' && (
          <>
            <TextInput
              label="Image URL"
              value={(node.props.src as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { src: val })}
            />
            <TextInput
              label="Alt Text"
              value={(node.props.alt as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { alt: val })}
            />
          </>
        )}
        {node.type === 'navbar' && (
          <>
            <TextInput
              label="Brand Name"
              value={(node.props.brand as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { brand: val })}
            />
          </>
        )}
        {node.type === 'footer' && (
          <TextInput
            label="Copyright Text"
            value={(node.props.copyright as string) || ''}
            onChange={(val) => updateNodeProps(node.id, { copyright: val })}
          />
        )}
        {node.type === 'card' && (
          <>
            <TextInput
              label="Title"
              value={(node.props.title as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { title: val })}
            />
            <TextInput
              label="Description"
              value={(node.props.description as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { description: val })}
            />
          </>
        )}
        {node.type === 'input' && (
          <>
            <TextInput
              label="Label"
              value={(node.props.label as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { label: val })}
            />
            <TextInput
              label="Placeholder"
              value={(node.props.placeholder as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { placeholder: val })}
            />
          </>
        )}
        {node.type === 'textarea' && (
          <>
            <TextInput
              label="Label"
              value={(node.props.label as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { label: val })}
            />
            <TextInput
              label="Placeholder"
              value={(node.props.placeholder as string) || ''}
              onChange={(val) => updateNodeProps(node.id, { placeholder: val })}
            />
          </>
        )}
      </SectionPanel>

      {/* Typography section */}
      {(node.type === 'heading' || node.type === 'paragraph' || node.type === 'text' || node.type === 'button') && (
        <SectionPanel title="Typography" icon={Type} defaultOpen={false}>
          <SelectInput
            label="Font Family"
            value={node.styles.fontFamily || 'inherit'}
            options={[
              { label: 'Default', value: 'inherit' },
              { label: 'Inter', value: 'Inter, sans-serif' },
              { label: 'Roboto', value: 'Roboto, sans-serif' },
              { label: 'Open Sans', value: 'Open Sans, sans-serif' },
              { label: 'Poppins', value: 'Poppins, sans-serif' },
              { label: 'Montserrat', value: 'Montserrat, sans-serif' },
              { label: 'Playfair Display', value: 'Playfair Display, serif' },
            ]}
            onChange={(val) => updateNodeStyles(node.id, { fontFamily: val })}
          />
          <NumberInput
            label="Font Size"
            value={node.styles.fontSize || ''}
            unit="px"
            onChange={(val) => updateNodeStyles(node.id, { fontSize: val })}
          />
          <SelectInput
            label="Font Weight"
            value={node.styles.fontWeight || '400'}
            options={[
              { label: 'Thin (100)', value: '100' },
              { label: 'Light (300)', value: '300' },
              { label: 'Regular (400)', value: '400' },
              { label: 'Medium (500)', value: '500' },
              { label: 'Semi Bold (600)', value: '600' },
              { label: 'Bold (700)', value: '700' },
              { label: 'Extra Bold (800)', value: '800' },
            ]}
            onChange={(val) => updateNodeStyles(node.id, { fontWeight: val })}
          />
          <NumberInput
            label="Line Height"
            value={node.styles.lineHeight || ''}
            onChange={(val) => updateNodeStyles(node.id, { lineHeight: val })}
          />
          <NumberInput
            label="Letter Spacing"
            value={node.styles.letterSpacing || ''}
            unit="px"
            onChange={(val) => updateNodeStyles(node.id, { letterSpacing: val })}
          />
          <SelectInput
            label="Text Align"
            value={node.styles.textAlign || 'left'}
            options={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
              { label: 'Justify', value: 'justify' },
            ]}
            onChange={(val) => updateNodeStyles(node.id, { textAlign: val })}
          />
        </SectionPanel>
      )}

      {/* Colors section */}
      <SectionPanel title="Colors" icon={Palette} defaultOpen={false}>
        <ColorInput
          label="Text Color"
          value={node.styles.color || ''}
          onChange={(val) => updateNodeStyles(node.id, { color: val })}
        />
        <ColorInput
          label="Background Color"
          value={node.styles.backgroundColor || ''}
          onChange={(val) => updateNodeStyles(node.id, { backgroundColor: val })}
        />
      </SectionPanel>

      {/* Layout section */}
      <SectionPanel title="Layout" icon={Layout} defaultOpen={false}>
        <SelectInput
          label="Display"
          value={node.styles.display || ''}
          options={[
            { label: 'Default', value: '' },
            { label: 'Block', value: 'block' },
            { label: 'Flex', value: 'flex' },
            { label: 'Grid', value: 'grid' },
            { label: 'Inline', value: 'inline' },
            { label: 'Inline Flex', value: 'inline-flex' },
            { label: 'Inline Block', value: 'inline-block' },
          ]}
          onChange={(val) => updateNodeStyles(node.id, { display: val })}
        />
        {(node.styles.display === 'flex' || node.styles.display === 'inline-flex') && (
          <>
            <SelectInput
              label="Direction"
              value={node.styles.flexDirection || 'row'}
              options={[
                { label: 'Row', value: 'row' },
                { label: 'Column', value: 'column' },
                { label: 'Row Reverse', value: 'row-reverse' },
                { label: 'Column Reverse', value: 'column-reverse' },
              ]}
              onChange={(val) => updateNodeStyles(node.id, { flexDirection: val })}
            />
            <SelectInput
              label="Justify Content"
              value={node.styles.justifyContent || 'flex-start'}
              options={[
                { label: 'Start', value: 'flex-start' },
                { label: 'Center', value: 'center' },
                { label: 'End', value: 'flex-end' },
                { label: 'Space Between', value: 'space-between' },
                { label: 'Space Around', value: 'space-around' },
                { label: 'Space Evenly', value: 'space-evenly' },
              ]}
              onChange={(val) => updateNodeStyles(node.id, { justifyContent: val })}
            />
            <SelectInput
              label="Align Items"
              value={node.styles.alignItems || 'stretch'}
              options={[
                { label: 'Stretch', value: 'stretch' },
                { label: 'Start', value: 'flex-start' },
                { label: 'Center', value: 'center' },
                { label: 'End', value: 'flex-end' },
              ]}
              onChange={(val) => updateNodeStyles(node.id, { alignItems: val })}
            />
            <NumberInput
              label="Gap"
              value={node.styles.gap || ''}
              unit="px"
              onChange={(val) => updateNodeStyles(node.id, { gap: val })}
            />
          </>
        )}
        <NumberInput
          label="Width"
          value={node.styles.width || ''}
          onChange={(val) => updateNodeStyles(node.id, { width: val })}
        />
        <NumberInput
          label="Max Width"
          value={node.styles.maxWidth || ''}
          onChange={(val) => updateNodeStyles(node.id, { maxWidth: val })}
        />
        <NumberInput
          label="Height"
          value={node.styles.height || ''}
          onChange={(val) => updateNodeStyles(node.id, { height: val })}
        />
        <NumberInput
          label="Min Height"
          value={node.styles.minHeight || ''}
          onChange={(val) => updateNodeStyles(node.id, { minHeight: val })}
        />
      </SectionPanel>

      {/* Spacing section */}
      <SectionPanel title="Spacing" icon={Move} defaultOpen={false}>
        <SpacingInput
          label="Padding"
          values={{
            top: node.styles.paddingTop || '',
            right: node.styles.paddingRight || '',
            bottom: node.styles.paddingBottom || '',
            left: node.styles.paddingLeft || '',
          }}
          onChange={(side, val) => {
            const key = `padding${side.charAt(0).toUpperCase() + side.slice(1)}`;
            updateNodeStyles(node.id, { [key]: val });
          }}
        />
        <SpacingInput
          label="Margin"
          values={{
            top: node.styles.marginTop || '',
            right: node.styles.marginRight || '',
            bottom: node.styles.marginBottom || '',
            left: node.styles.marginLeft || '',
          }}
          onChange={(side, val) => {
            const key = `margin${side.charAt(0).toUpperCase() + side.slice(1)}`;
            updateNodeStyles(node.id, { [key]: val });
          }}
        />
      </SectionPanel>

      {/* Border section */}
      <SectionPanel title="Border" icon={Square} defaultOpen={false}>
        <NumberInput
          label="Border Width"
          value={node.styles.borderWidth || ''}
          unit="px"
          onChange={(val) => updateNodeStyles(node.id, { borderWidth: val })}
        />
        <SelectInput
          label="Border Style"
          value={node.styles.borderStyle || 'none'}
          options={[
            { label: 'None', value: 'none' },
            { label: 'Solid', value: 'solid' },
            { label: 'Dashed', value: 'dashed' },
            { label: 'Dotted', value: 'dotted' },
          ]}
          onChange={(val) => updateNodeStyles(node.id, { borderStyle: val })}
        />
        <ColorInput
          label="Border Color"
          value={node.styles.borderColor || ''}
          onChange={(val) => updateNodeStyles(node.id, { borderColor: val })}
        />
        <NumberInput
          label="Border Radius"
          value={node.styles.borderRadius || ''}
          unit="px"
          onChange={(val) => updateNodeStyles(node.id, { borderRadius: val })}
        />
      </SectionPanel>

      {/* Effects section */}
      <SectionPanel title="Effects" icon={Sparkles} defaultOpen={false}>
        <NumberInput
          label="Opacity"
          value={node.styles.opacity || '1'}
          onChange={(val) => updateNodeStyles(node.id, { opacity: val })}
        />
        <TextInput
          label="Box Shadow"
          value={node.styles.boxShadow || ''}
          onChange={(val) => updateNodeStyles(node.id, { boxShadow: val })}
        />
      </SectionPanel>

      {/* Responsive section */}
      <SectionPanel title="Responsive" icon={Monitor} defaultOpen={false}>
        <p className="text-[10px] text-gray-500">
          Switch viewport mode in the toolbar to set responsive styles. Styles set in each viewport will override desktop styles.
        </p>
      </SectionPanel>

      {/* Background section */}
      <SectionPanel title="Background" icon={Image} defaultOpen={false}>
        <ColorInput
          label="Background Color"
          value={node.styles.backgroundColor || ''}
          onChange={(val) => updateNodeStyles(node.id, { backgroundColor: val })}
        />
        <TextInput
          label="Background Image"
          value={node.styles.backgroundImage || ''}
          onChange={(val) => updateNodeStyles(node.id, { backgroundImage: val })}
        />
        <SelectInput
          label="Background Size"
          value={node.styles.backgroundSize || 'cover'}
          options={[
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Auto', value: 'auto' },
          ]}
          onChange={(val) => updateNodeStyles(node.id, { backgroundSize: val })}
        />
      </SectionPanel>
    </div>
  );
}

// ============================================================
// Right Sidebar
// ============================================================
export function RightSidebar() {
  const { selectedNodeId } = useEditorStore();

  return (
    <aside className="w-72 bg-[#16162a] border-l border-[#2a2a4a] flex flex-col shrink-0 overflow-hidden">
      {/* Header */}
      <div className="h-10 flex items-center px-3 border-b border-[#2a2a4a]">
        <span className="text-xs font-medium text-gray-400">Properties</span>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {selectedNodeId ? (
          <PropertiesPanel />
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-center px-4">
            <div className="w-10 h-10 rounded-lg bg-[#1e1e36] border border-[#2a2a4a] flex items-center justify-center mb-3">
              <Settings size={18} className="text-gray-600" />
            </div>
            <p className="text-xs text-gray-500">
              Select an element to edit its properties
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
