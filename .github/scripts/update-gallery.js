#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const GALLERY_DIR = './gallery';
const GALLERY_HTML = './gallery.html';
const GALLERY_DATA_FILE = './gallery/gallery-data.json';

// Supported image extensions
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// Function to generate image metadata
async function generateImageMetadata(imagePath) {
    const filename = path.basename(imagePath);
    const nameWithoutExt = path.parse(filename).name;
    
    // Generate title from filename (replace hyphens/underscores with spaces, capitalize)
    const title = nameWithoutExt
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
    
    let metadata = {
        src: `gallery/${filename}`,
        title: title,
        description: 'Green Makerspace project',
        filename: filename,
        dateAdded: new Date().toISOString()
    };

    // Try to get image dimensions and other metadata
    try {
        if (path.extname(imagePath).toLowerCase() !== '.svg') {
            const imageInfo = await sharp(imagePath).metadata();
            metadata.width = imageInfo.width;
            metadata.height = imageInfo.height;
            metadata.format = imageInfo.format;
            metadata.size = fs.statSync(imagePath).size;
        }
    } catch (error) {
        console.warn(`Could not read metadata for ${filename}:`, error.message);
    }

    return metadata;
}

// Function to scan gallery directory
async function scanGalleryDirectory() {
    console.log('🔍 Scanning gallery directory...');
    
    if (!fs.existsSync(GALLERY_DIR)) {
        console.log('📁 Gallery directory does not exist, creating it...');
        fs.ensureDirSync(GALLERY_DIR);
        return [];
    }

    const files = fs.readdirSync(GALLERY_DIR);
    const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return IMAGE_EXTENSIONS.includes(ext) && !file.startsWith('.');
    });

    console.log(`📸 Found ${imageFiles.length} image(s): ${imageFiles.join(', ')}`);

    const galleryData = [];
    
    for (const file of imageFiles) {
        const filePath = path.join(GALLERY_DIR, file);
        try {
            const metadata = await generateImageMetadata(filePath);
            galleryData.push(metadata);
            console.log(`✅ Processed: ${file}`);
        } catch (error) {
            console.error(`❌ Error processing ${file}:`, error.message);
        }
    }

    // Sort by date added (newest first)
    galleryData.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));

    return galleryData;
}

// Function to update gallery.html (now just validates it exists)
async function updateGalleryHTML(galleryData) {
    console.log('📝 Checking gallery.html...');
    
    if (!fs.existsSync(GALLERY_HTML)) {
        console.error('❌ gallery.html not found!');
        return false;
    }

    console.log('✅ gallery.html exists and will load data from JSON file');
    return true;
}

// Function to save gallery data as JSON
async function saveGalleryData(galleryData) {
    console.log('💾 Saving gallery data...');
    
    const galleryInfo = {
        lastUpdated: new Date().toISOString(),
        totalImages: galleryData.length,
        images: galleryData
    };
    
    fs.writeFileSync(GALLERY_DATA_FILE, JSON.stringify(galleryInfo, null, 2));
    console.log(`✅ Saved ${galleryData.length} image(s) to gallery-data.json`);
}

// Main function
async function main() {
    console.log('🚀 Starting gallery update process...');
    
    try {
        // Scan gallery directory
        const galleryData = await scanGalleryDirectory();
        
        if (galleryData.length === 0) {
            console.log('📭 No images found in gallery directory');
            // Still update the HTML to show the "no images" message
            await updateGalleryHTML([]);
            await saveGalleryData([]);
        } else {
            // Update gallery.html
            const success = await updateGalleryHTML(galleryData);
            if (!success) {
                process.exit(1);
            }
            
            // Save gallery data
            await saveGalleryData(galleryData);
        }
        
        console.log('🎉 Gallery update completed successfully!');
        
        // Print summary
        console.log('\n📊 Summary:');
        console.log(`   Images processed: ${galleryData.length}`);
        console.log(`   Gallery HTML: Updated`);
        console.log(`   Data file: ${GALLERY_DATA_FILE}`);
        
        if (galleryData.length > 0) {
            console.log('\n🖼️  Images in gallery:');
            galleryData.forEach((img, index) => {
                console.log(`   ${index + 1}. ${img.title} (${img.filename})`);
            });
        }
        
    } catch (error) {
        console.error('❌ Error updating gallery:', error);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    scanGalleryDirectory,
    updateGalleryHTML,
    saveGalleryData,
    generateImageMetadata
};
