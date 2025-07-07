# Raj Swarnim Portfolio

A modern, responsive portfolio website showcasing AI/ML expertise and professional experience.

## 🚀 GitHub Pages Deployment

This portfolio is configured for automatic deployment to GitHub Pages. Follow these steps:

### Initial Setup

1. **Fork/Clone this repository** to your GitHub account
2. **Update the repository name** in `vite.config.github.ts`:
   ```typescript
   base: "/your-repo-name/", // Replace with your actual repo name
   ```
3. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Select "GitHub Actions" as the source

### Automatic Deployment

The site will automatically deploy when you:
- Push to the `main` branch
- The GitHub Actions workflow will build and deploy your site
- Your portfolio will be available at: `https://yourusername.github.io/your-repo-name/`

### Manual Deployment

You can also trigger deployment manually:
1. Go to the "Actions" tab in your GitHub repository
2. Select "Deploy to GitHub Pages" workflow
3. Click "Run workflow"

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Customization

1. **Update personal information** in `client/src/data/resume-data.ts`
2. **Add your projects** and experience details
3. **Customize styling** in `client/src/index.css`
4. **Add your resume PDF** to the assets folder

## 🌐 Features

- Responsive design optimized for all devices
- Clean, minimal GitHub Pages style
- Smooth scrolling navigation
- Project showcase with detailed descriptions
- Skills visualization
- Professional contact section

## 📄 License

MIT License - feel free to use this template for your own portfolio!