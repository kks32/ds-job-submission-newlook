# MPM Form Vue.js Application

A Vue.js application that recreates the DesignSafe MPM (Material Point Method) form interface with Vuetify components.

## Project Structure

```
mpm/
├── public/
│   └── logo.png              # DesignSafe NSF logo
├── src/
│   ├── components/
│   │   └── MPMForm.vue       # Main form component
│   ├── App.vue               # Main app with header and navigation
│   └── main.js               # Vue app entry point
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.js            # Vite configuration
└── README.md                 # This file
```

## Features

- **4-step form wizard**: Inputs → Parameters → Configuration → Outputs
- **Responsive design** with Vuetify components
- **Real-time form validation** with error handling
- **Dynamic summary panel** showing current form state
- **DesignSafe-themed header** with logo integration
- **Complete navigation structure** matching the original design

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation & Setup

1. **Navigate to the project directory:**
   ```bash
   cd /Users/krishna/Downloads/mpm
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Development

### Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Dependencies

### Core Dependencies:
- **Vue 3** - Progressive JavaScript framework
- **Vuetify 3** - Vue.js UI library with Material Design components
- **@mdi/font** - Material Design Icons

### Development Dependencies:
- **Vite** - Fast build tool and dev server
- **ESLint** - Code linting and formatting

## Form Structure

### Step 1: Inputs
- Input Directory (file path selector)

### Step 2: Parameters  
- Input Script (required .json file)

### Step 3: Configuration
- Allocation (dropdown)
- Queue (dropdown)
- Maximum Job Runtime (numeric, max 120 minutes)
- Node Count (numeric)
- Cores Per Node (numeric)

### Step 4: Outputs
- Job Name (required)
- Archive System
- Archive Directory

## CSS Organization

The CSS is **embedded** in the Vue components using scoped styles:

- **App.vue**: Contains global header, navigation, and layout styles
- **MPMForm.vue**: Contains all form-specific styling

This approach provides:
- Component encapsulation
- No external CSS files to manage
- Automatic style scoping to prevent conflicts

## Key Features

### State Management
- Uses Vue 3 Composition API with `ref()` and `computed()`
- Reactive form validation
- Real-time summary panel updates

### Form Validation
- Required field validation
- File extension validation (.json for input script)
- Numeric range validation (runtime max 120 minutes)
- Custom validation rules for each field type

### Responsive Design
- Vuetify grid system for responsive layout
- Mobile-friendly form controls
- Adaptive spacing and typography

## Logo Integration

The `logo.png` file is automatically integrated into:
- Browser favicon
- Header branding section
- Maintains aspect ratio and proper sizing

## Customization

### Theme Colors
Modify the Vuetify theme in `src/main.js`:
```javascript
themes: {
  light: {
    colors: {
      primary: '#1976d2',     // Main blue
      secondary: '#424242',   // Gray
      success: '#4caf50',     // Green for submit button
      // ... other colors
    },
  },
}
```

### Form Fields
Add or modify form fields in `src/components/MPMForm.vue`:
- Update the `form` reactive object
- Add validation rules
- Update the template with new fields

## Browser Support

- Chrome/Chromium 87+
- Firefox 78+
- Safari 14+
- Edge 88+

## Troubleshooting

### Port already in use:
If port 3000 is busy, Vite will automatically use the next available port (3001, 3002, etc.)

### Build errors:
```bash
npm run lint
```

### Clear node_modules:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Production Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your web server

3. Ensure your server is configured to serve the `index.html` file for all routes

## License

This project recreates the DesignSafe interface for educational/development purposes.