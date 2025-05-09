const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');
const { generateAllSitemaps } = require('./routes/mySitemap');
const { exportAndBackupAllCollectionsmonthly } = require('./controller/Backup');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({ 
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Update your sitemap route to use fs.promises correctly
app.get('/sitemap.xml', async (req, res) => {
    try {
      // Look for sitemap in both possible locations
      let filePath = path.join(__dirname, 'dist', 'sitemap.xml');
      
      try {
        // First try in dist directory
        await fs.access(filePath);
      } catch (error) {
        // If not found in dist, try in public directory
        filePath = path.join(__dirname, 'public', 'sitemap.xml');
        try {
          await fs.access(filePath);
        } catch (err) {
          console.error('Sitemap not found in either location:', err);
          return res.status(404).send('Sitemap not found');
        }
      }
      
      // Read the file
      const data = await fs.readFile(filePath);
      res.set('Content-Type', 'application/xml');
      res.send(data);
    } catch (err) {
      console.error('Error serving sitemap:', err);
      return res.status(500).send('Error serving sitemap');
    }
  });

  // Update your sitemap route to use fs.promises correctly
app.get('/sitemap1.xml', async (req, res) => {
    try {
      // Look for sitemap in both possible locations
      let filePath = path.join(__dirname, 'dist', 'sitemap1.xml');
      
      try {
        // First try in dist directory
        await fs.access(filePath);
      } catch (error) {
        // If not found in dist, try in public directory
        filePath = path.join(__dirname, 'public', 'sitemap1.xml');
        try {
          await fs.access(filePath);
        } catch (err) {
          console.error('Sitemap not found in either location:', err);
          return res.status(404).send('Sitemap not found');
        }
      }
      
      // Read the file
      const data = await fs.readFile(filePath);
      res.set('Content-Type', 'application/xml');
      res.send(data);
    } catch (err) {
      console.error('Error serving sitemap:', err);
      return res.status(500).send('Error serving sitemap');
    }
  });

app.get('/blog-sitemap.xml', async (req, res) => {
    try {
      // Look for sitemap in both possible locations
      let filePath = path.join(__dirname, 'dist', 'blog-sitemap.xml');
      
      try {
        // First try in dist directory
        await fs.access(filePath);
      } catch (error) {
        // If not found in dist, try in public directory
        filePath = path.join(__dirname, 'public', 'blog-sitemap.xml');
        try {
          await fs.access(filePath);
        } catch (err) {
          console.error('Sitemap not found in either location:', err);
          return res.status(404).send('Sitemap not found');
        }
      }
      
      // Read the file
      const data = await fs.readFile(filePath);
      res.set('Content-Type', 'application/xml');
      res.send(data);
    } catch (err) {
      console.error('Error serving sitemap:', err);
      return res.status(500).send('Error serving sitemap');
    }
  });

  
// Consolidated Sitemap Route (Before API, Static, and Catch-All Routes)
app.get('/:sitemapFile([\\w-]+\\.xml)', async (req, res) => {
    const sitemapFile = req.params.sitemapFile;
    console.log(`✅ Sitemap request received for: ${sitemapFile}`);

    const allowedSitemaps = [
        
        'industrial-category-sitemap.xml',
        'industrial-subcategory-sitemap.xml',
        'package-category-sitemap.xml',
        'package-subcategory-sitemap.xml',
        'package-subsubcategory-sitemap.xml',
        'portfolio-category-sitemap.xml',
        'service-subcategories-sitemap.xml',
        'service-subsubcategories-sitemap.xml',
    ];

    if (!allowedSitemaps.includes(sitemapFile)) {
        console.warn(`⛔ Unauthorized sitemap request: ${sitemapFile}`);
        return res.status(404).send('Sitemap not found');
    }

    try {
        let filePath = path.join(__dirname, 'dist', sitemapFile);
        console.log(`🔍 Trying to access: ${filePath}`);

        try {
            await fs.access(filePath);
        } catch (error) {
            console.warn(`❌ Not found in dist/, trying public/: ${sitemapFile}`);
            filePath = path.join(__dirname, 'public', sitemapFile);
            try {
                await fs.access(filePath);
            } catch (err) {
                console.error(`❌ Sitemap not found in either dist/ or public/: ${sitemapFile}`);
                return res.status(404).send('Sitemap not found');
            }
        }

        const data = await fs.readFile(filePath);
        res.set('Content-Type', 'application/xml');
        res.send(data);
    } catch (err) {
        console.error(`🚨 Error serving sitemap ${sitemapFile}:`, err);
        res.status(500).send('Error serving sitemap');
    }
});

// Cron Job for Daily Sitemap Generation
cron.schedule('0 0 * * *', async () => {
    try {
        console.log('Generating daily sitemaps via cron job');
        await generateAllSitemaps();
        console.log('Daily sitemap generation completed');
    } catch (error) {
        console.error('Error generating daily sitemaps:', error);
    }
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata',
});

// Cron Job for Monthly Backup
cron.schedule('59 23 31 * *', () => {
    exportAndBackupAllCollectionsmonthly();
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata',
});

// API Routes
app.get('/api/generate-sitemaps', async (req, res) => {
    try {
        await generateAllSitemaps();
        res.status(200).json({ message: 'Sitemaps generated successfully' });
    } catch (error) {
        console.error('Error generating sitemaps:', error);
        res.status(500).json({ error: 'Failed to generate sitemaps' });
    }
});

// Other API Routes
app.use('/api/product', require('./routes/product'));
app.use('/api/services', require('./routes/services'));
app.use('/api/news', require('./routes/news'));
app.use('/api/pageHeading', require('./routes/pageHeading'));
app.use('/api/image', require('./routes/image'));
app.use('/api/testimonial', require('./routes/testinomial'));
app.use('/api/faq', require('./routes/FAQ'));
app.use('/api/staff', require('./routes/ourStaff'));
app.use('/api/banner', require('./routes/Banner'));
app.use('/api/pageContent', require('./routes/pageContent'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/password', require('./routes/forgotpassword'));
app.use('/api/email', require('./routes/email'));
app.use('/api/logo', require('./routes/logo'));
app.use('/api/backup', require('./routes/backup'));
app.use('/api/aboutusPoints', require('./routes/aboutuspoints'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/counter', require('./routes/counter'));
app.use('/api/inquiries', require('./routes/inquiry'));
app.use('/api/mission', require('./routes/mission'));
app.use('/api/vision', require('./routes/vision'));
app.use('/api/corevalue', require('./routes/corevalue'));
app.use('/api/aboutcompany', require('./routes/aboutcompany'));
app.use('/api/careeroption', require('./routes/careeroption'));
app.use('/api/careerInquiries', require('./routes/careerinquiry'));
app.use('/api/footer', require('./routes/footer'));
app.use('/api/header', require('./routes/header'));
app.use('/api/globalpresence', require('./routes/globalpresence'));
app.use('/api/whatsappsettings', require('./routes/whatsappsettings'));
app.use('/api/googlesettings', require('./routes/googlesettings'));
app.use('/api/menulisting', require('./routes/menulisting'));
app.use('/api/infrastructure', require('./routes/infrastructure'));
app.use('/api/qualitycontrol', require('./routes/qualitycontrol'));
app.use('/api/sitemap', require('./routes/sitemap'));
app.use('/api/benefits', require('./routes/benefits'));
app.use('/api/herosection', require('./routes/heroSection'));
app.use('/api/serviceDetails', require('./routes/serviceDetails'));
app.use('/api/homehero', require('./routes/HomeHero'));
app.use('/api/homepage', require('./routes/homepage'));
app.use('/api/video', require('./routes/video'));
app.use('/api/serviceImages', require('./routes/serviceImage'));
app.use('/api/industryImages', require('./routes/industryimage'));
app.use('/api/packages', require('./routes/plan'));
app.use('/api/designProcess', require('./routes/designProcess'));
app.use('/api/content', require('./routes/content'));
app.use('/api/submenulisting', require('./routes/submenu'));
app.use('/api/industries', require('./routes/industries'));
app.use('/api/industiesHeroSection', require('./routes/industriesHeroSection'));
app.use('/api/industiesDetails', require('./routes/industriesdetails'));
app.use('/api/portfolio', require('./routes/portfoliocategory'));
app.use('/api/navbar', require('./routes/navbardata'));
app.use('/api/contactInfo', require('./routes/contactInfo'));
app.use('/api/icon', require('./routes/contactIcon'));
app.use('/api/address', require('./routes/address'));
app.use('/api/contactinquiries', require('./routes/contactinquiry'));
app.use('/api/colors', require('./routes/managecolor'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/card', require('./routes/cards'));
app.use('/api/home', require('./routes/homeanimation'));
app.use('/api/popupinquiry', require('./routes/popupinquiry'));
app.use('/api/herosectioninquiry', require('./routes/herosectioninquiry'));
app.use('/api/logotype', require('./routes/logotype'));
app.use('/api/packagedescription', require('./routes/packagedescription'));
app.use('/api/allData', require('./combineApi/combineRoute'));
app.use('/api/allData2', require('./combineApi/combineRoute2'));
app.use('/api/jobApplication', require('./routes/jobApplication'));
app.use('/api/cache', require('./routes/cache'));

// Swagger Setup
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swaggerConfig');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Static Files (After Sitemap and API Routes)
app.use(express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, filePath) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    },
}));

// Catch-All Route for SPA (Last)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : undefined,
    });
});

// Server Initialization
async function startServer() {
    try {
        await mongoose.connect(process.env.DATABASE_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 60000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });
        console.log('Connected to MongoDB');
        // generateAllSitemaps()
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Server initialization error:', error);
        process.exit(1);
    }
}

startServer();