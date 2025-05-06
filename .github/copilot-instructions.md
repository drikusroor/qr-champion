# Copilot Instructions for QR Champion

## Project Overview

This project is a custom QR code generator that allows users to create and download QR codes with customizable options such as:

- URL
- Foreground and background colors
- Logo (via URL or image upload)
- Margin size
- Subtext below the QR code

The generated QR codes can be downloaded in PNG, JPG, or SVG format. The project is deployed to GitHub Pages using GitHub Actions.

## Tech Stack

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Styling**: Tailwind CSS
- **Libraries**:
  - `qrcode.react` for QR code generation
  - `html-to-image` for converting HTML to images
  - `downloadjs` for file downloads
- **CI/CD**: GitHub Actions

## Coding Standards and Conventions

1. **Code Style**:
   - Follow React and TypeScript best practices.
   - Use Tailwind CSS for styling.
   - Keep components modular and reusable.

2. **File Structure**:
   - Place assets in the `src/assets/` directory.
   - Use `src/` for all application code, with `App.tsx` as the main entry point.

3. **Development Workflow**:
   - Use `bun run dev` to start the development server.
   - Access the app at `http://localhost:5173/qr-champion/` during development.

4. **Production Build**:
   - Use `bun run build` to create a production-ready build.

5. **Testing and Debugging**:
   - Ensure all features work as expected before committing changes.
   - Use browser developer tools for debugging.

6. **Deployment**:
   - The project is automatically deployed to GitHub Pages via GitHub Actions.

## Additional Notes

- Ensure Node.js (v20 or above) and Bun are installed before starting development.
- Refer to the `README.md` for detailed setup and usage instructions.
