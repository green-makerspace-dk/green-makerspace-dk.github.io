# GitHub Actions - Gallery Automation

This directory contains GitHub Actions workflows and scripts for automating the Green Makerspace gallery system.

## 🔄 Automated Gallery Updates

### How It Works

1. **Trigger**: The workflow runs automatically when:
   - Images are added/removed from the `/gallery/` folder
   - The workflow file is modified
   - Manually triggered via GitHub Actions UI

2. **Process**:
   - Scans the `/gallery/` folder for image files
   - Generates metadata for each image (title, dimensions, file size)
   - Updates `gallery.html` with the new image data
   - Creates/updates `gallery/gallery-data.json` with image information
   - Commits changes back to the repository

3. **Result**: The gallery page automatically displays new images without manual code changes

### Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WebP
- BMP
- SVG

### File Structure
```
.github/
├── workflows/
│   └── update-gallery.yml     # GitHub Actions workflow
├── scripts/
│   └── update-gallery.js      # Node.js script for gallery processing
└── README.md                  # This file

gallery/
├── gallery-data.json          # Auto-generated image metadata
├── README.md                  # Gallery folder instructions
└── [image files]              # Your gallery images
```

## 🚀 Usage

### Adding Images
1. Upload image files to the `/gallery/` folder
2. Commit and push to GitHub
3. The workflow will automatically run and update the gallery
4. Changes will be committed back to the repository

### Manual Trigger
You can manually run the workflow from the GitHub Actions tab:
1. Go to your repository on GitHub
2. Click "Actions" tab
3. Select "Update Gallery" workflow
4. Click "Run workflow"

### Local Testing
To test the gallery update script locally:

```bash
# Install dependencies
npm install

# Run the gallery update script
npm run update-gallery
```

## 📝 Script Features

### Image Processing
- **Automatic Metadata**: Extracts image dimensions, format, and file size
- **Smart Titles**: Converts filenames to readable titles (e.g., `workshop-session-2024.jpg` → "Workshop Session 2024")
- **Sorting**: Orders images by date added (newest first)
- **Error Handling**: Gracefully handles corrupted or unsupported files

### Gallery Data
The script generates a `gallery-data.json` file with structure:
```json
{
  "lastUpdated": "2024-12-06T12:00:00.000Z",
  "totalImages": 5,
  "images": [
    {
      "src": "gallery/workshop-session.jpg",
      "title": "Workshop Session",
      "description": "Green Makerspace project",
      "filename": "workshop-session.jpg",
      "dateAdded": "2024-12-06T12:00:00.000Z",
      "width": 1200,
      "height": 800,
      "format": "jpeg",
      "size": 245760
    }
  ]
}
```

## 🔧 Configuration

### Workflow Settings
The workflow can be customized by editing `.github/workflows/update-gallery.yml`:

- **Trigger paths**: Change which folders trigger the workflow
- **Node.js version**: Update the Node.js version used
- **Dependencies**: Add or remove npm packages

### Script Settings
The update script can be configured by editing `.github/scripts/update-gallery.js`:

- **Image extensions**: Add support for new image formats
- **Metadata extraction**: Customize what information is extracted
- **Title generation**: Change how filenames become titles
- **Sorting**: Modify how images are ordered

## 🛠️ Troubleshooting

### Common Issues

1. **Workflow not triggering**:
   - Check that files are being added to the `/gallery/` folder
   - Ensure the workflow file syntax is correct
   - Verify repository permissions allow Actions to run

2. **Script errors**:
   - Check the Actions log for detailed error messages
   - Ensure image files are not corrupted
   - Verify all dependencies are properly installed

3. **Gallery not updating**:
   - Check that `gallery-data.json` is being created
   - Verify the gallery.html file is being updated
   - Clear browser cache to see changes

### Debug Mode
To enable verbose logging, add this to the workflow:
```yaml
- name: Debug gallery update
  run: DEBUG=* node .github/scripts/update-gallery.js
```

## 📊 Monitoring

The workflow provides detailed logs including:
- Number of images processed
- File sizes and dimensions
- Processing time
- Any errors encountered

Check the GitHub Actions tab to monitor workflow runs and troubleshoot issues.
