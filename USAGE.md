# WebCraft - Visual Website Builder

## 🚀 How to Use

### Getting Started
1. **Start with a Template**: Click the "Start with Basic Template" button on the empty canvas to instantly create a basic page with navbar, hero section, and footer.

2. **Add Components**: 
   - **Click** any component in the left sidebar to add it to your page
   - **Drag** components from the sidebar and drop them onto the canvas or into containers

3. **Edit Components**:
   - **Click** any element on the canvas to select it
   - Use the **right sidebar** to edit properties (text, colors, spacing, etc.)
   - Changes appear instantly on the canvas

4. **Organize Your Page**:
   - Use the **Layers tab** (left sidebar) to see the structure of your page
   - Drag components to reorder them
   - Nest components inside containers (sections, containers, rows, columns)

### Key Features

#### Left Sidebar Tabs
- **Elements**: Browse and add components (Layout, Basic, Content, Navigation, Forms)
- **Layers**: View and manage the component tree structure
- **Pages**: Create and manage multiple pages
- **Assets**: Upload and manage images (coming soon)

#### Top Toolbar
- **Viewport Switcher**: Toggle between Desktop, Tablet, and Mobile views
- **Undo/Redo**: Revert or reapply changes
- **Save**: Save your work
- **Preview**: Preview your website (coming soon)
- **Publish**: Publish your website (coming soon)

#### Right Sidebar (Properties Panel)
When you select a component, you can edit:
- **Content**: Text, labels, links
- **Typography**: Font family, size, weight, alignment
- **Colors**: Text color, background color
- **Layout**: Display, flexbox, grid, dimensions
- **Spacing**: Padding, margin
- **Border**: Width, style, color, radius
- **Effects**: Opacity, shadows
- **Background**: Color, image, size

### Component Types

#### Layout
- **Section**: Full-width container for grouping content
- **Container**: Centered content wrapper with max-width
- **Row**: Horizontal flex container
- **Columns**: Grid layout (2 columns by default)
- **Spacer**: Vertical spacing
- **Divider**: Horizontal line separator

#### Basic
- **Heading**: H1-H6 headings
- **Paragraph**: Text blocks
- **Text**: Inline text
- **Button**: Clickable buttons with links
- **Image**: Image placeholders
- **Video**: Video embeds
- **Icon**: Icons

#### Content
- **Card**: Card component with title and description
- **Feature**: Feature showcase
- **Testimonial**: Customer testimonials
- **Pricing**: Pricing cards
- **FAQ**: Frequently asked questions
- **Gallery**: Image galleries
- **Team**: Team member cards
- **Logo Grid**: Logo showcase

#### Navigation
- **Navbar**: Top navigation bar
- **Breadcrumb**: Breadcrumb navigation
- **Footer**: Page footer

#### Forms
- **Input**: Text input fields
- **Textarea**: Multi-line text areas
- **Select**: Dropdown selects
- **Checkbox**: Checkboxes
- **Contact Form**: Complete contact form

### Tips

1. **Nesting**: Drop components inside sections, containers, rows, or columns to create complex layouts
2. **Responsive**: Switch viewport modes to see how your design adapts
3. **Selection**: Click empty canvas area to deselect all components
4. **Quick Actions**: Use the toolbar that appears when you select a component to duplicate, copy, or delete
5. **Visual Feedback**: Drop zones highlight when you drag components over them

### Keyboard Shortcuts (Coming Soon)
- `Ctrl/Cmd + Z`: Undo
- `Ctrl/Cmd + Y`: Redo
- `Ctrl/Cmd + C`: Copy
- `Ctrl/Cmd + V`: Paste
- `Delete`: Delete selected component

## 🎨 Building Your First Website

1. Click "Start with Basic Template" to get a starter page
2. Click on the heading to select it
3. Edit the text in the right sidebar
4. Add more sections by clicking "Section" in the Elements tab
5. Add a container inside the section
6. Add headings, text, buttons, and images inside the container
7. Customize colors, spacing, and typography in the properties panel
8. Switch to tablet/mobile view to check responsiveness
9. Keep building until you're happy with your design!

## 🛠️ Technical Details

- Built with React + TypeScript
- Uses @dnd-kit for drag-and-drop
- Zustand for state management
- Tailwind CSS for styling
- Component-based architecture with JSON tree structure

---

**Ready to build? Start by clicking "Start with Basic Template" or add components from the left sidebar!**
