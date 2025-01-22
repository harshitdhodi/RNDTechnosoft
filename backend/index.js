const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const serveStatic = require('serve-static');
const path = require('path');
const cron = require('node-cron');
const { exportAndBackupAllCollectionsmonthly } = require("./controller/Backup")
require('dotenv').config();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const fs = require('fs').promises;
const http = require('http');
//dev branch 
const app = express();

app.use(cors({
    origin: true, // or specify your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['x-filename']
}));
app.use(cookieParser());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// API Routes first
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
app.use("/api/achievements", require('./routes/achievements'))
app.use("/api/counter", require('./routes/counter'))
app.use("/api/inquiries", require('./routes/inquiry'))
app.use("/api/mission", require('./routes/mission'))
app.use("/api/vision", require('./routes/vision'))
app.use("/api/corevalue", require('./routes/corevalue'))
app.use("/api/aboutcompany", require('./routes/aboutcompany'))
app.use("/api/careeroption", require('./routes/careeroption'))
app.use("/api/careerInquiries", require('./routes/careerinquiry'))
app.use("/api/footer", require('./routes/footer'))
app.use("/api/header", require('./routes/header'))
app.use("/api/globalpresence", require('./routes/globalpresence'))
app.use("/api/whatsappsettings", require('./routes/whatsappsettings'))
app.use("/api/googlesettings", require('./routes/googlesettings'))
app.use("/api/menulisting", require('./routes/menulisting'))
app.use("/api/infrastructure", require('./routes/infrastructure'))
app.use("/api/qualitycontrol", require('./routes/qualitycontrol'))
app.use("/api/sitemap", require('./routes/sitemap'))
app.use("/api/benefits", require('./routes/benefits'))
app.use('/api/herosection', require('./routes/heroSection'))
app.use('/api/serviceDetails', require('./routes/serviceDetails'))
app.use("/api/homehero", require('./routes/HomeHero'))
app.use("/api/homepage", require('./routes/homepage'))
app.use("/api/video", require('./routes/video'))
app.use("/api/serviceImages", require('./routes/serviceImage'))
app.use("/api/industryImages", require('./routes/industryimage'))
app.use("/api/packages", require('./routes/plan'))
app.use("/api/designProcess", require('./routes/designProcess'))
app.use("/api/content", require('./routes/content'))
app.use("/api/submenulisting", require('./routes/submenu'))
app.use("/api/industries", require('./routes/industries'))
app.use("/api/industiesHeroSection", require('./routes/industriesHeroSection'))
app.use("/api/industiesDetails", require('./routes/industriesdetails'))
app.use('/api/portfolio', require('./routes/portfoliocategory'))
app.use('/api/navbar', require('./routes/navbardata'))
app.use('/api/contactInfo', require('./routes/contactInfo'))
app.use('/api/icon', require('./routes/contactIcon'))
app.use('/api/address', require('./routes/address'))
app.use("/api/contactinquiries", require('./routes/contactinquiry'))
app.use("/api/colors", require('./routes/managecolor'))
app.use("/api/newsletter", require('./routes/newsletter'))
app.use("/api/card", require('./routes/cards'))
app.use("/api/home", require('./routes/homeanimation'))
app.use("/api/popupinquiry", require('./routes/popupinquiry'))
app.use("/api/herosectioninquiry", require('./routes/herosectioninquiry'))
app.use("/api/logotype", require('./routes/logotype'))
app.use("/api/packagedescription", require('./routes/packagedescription'))

// Swagger setup
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocs = require('./swaggerConfig');

// app.use(cors({
// origin: 'http://localhost:3000',
// credentials: true,
// exposedHeaders: ['x-filename']
// }));

cron.schedule('59 23 31 * *', () => {

    exportAndBackupAllCollectionsmonthly();
}, {
    scheduled: true,
    timezone: "Asia/Kolkata"
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Static and catch-all routes LAST
app.use(express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, path) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handler for CORS
app.use((err, req, res, next) => {
    if (err.message === 'CORS Error') {
        console.warn('CORS Warning:', err);
        // Continue despite CORS error
        next();
    } else {
        next(err);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 300 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
});

// Mongoose connection options
const mongooseOptions = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 2,
    maxIdleTimeMS: 30000,
    family: 4,
    retryWrites: true,
    w: 'majority'
};

// Resource limits configuration
const RESOURCE_LIMITS = {
    MAX_MEMORY_MB: 512, // 512MB max memory
    MAX_HEAP_MB: 256, // 256MB max heap
    IO_LIMIT_MB: 1, // 1MB/s IO limit
    PROCESS_LIMIT: 20// Entry processes limit
};

// Add memory management configurations
const MEMORY_CONFIG = {
    initialMemoryMB: 256,
    maximumMemoryMB: 512,
    wasmMemoryLimitMB: 256
};

// Add WebAssembly memory management
const configureWebAssembly = () => {
    try {
        // Configure WebAssembly memory limits with higher values
        const wasmMemory = new WebAssembly.Memory({
            initial: 16, // Minimum 16 pages (1MB per page = 16MB)
            maximum: 256 // Maximum 256 pages (256MB)
        });

        // Override WebAssembly instantiate
        const originalInstantiate = WebAssembly.instantiate;
        WebAssembly.instantiate = async function(...args) {
            try {
                // Add memory configuration to import object
                if (args[1] && typeof args[1] === 'object') {
                    args[1].env = {
                        ...args[1].env,
                        memory: wasmMemory
                    };
                }
                return await originalInstantiate.apply(this, args);
            } catch (error) {
                console.error('WebAssembly instantiation error:', error);

                // Force garbage collection
                if (global.gc) {
                    global.gc();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // Retry with adjusted memory
                try {
                    const adjustedMemory = new WebAssembly.Memory({
                        initial: 8, // Reduced to 8 pages (8MB)
                        maximum: 128 // Reduced to 128 pages (128MB)
                    });

                    if (args[1] && typeof args[1] === 'object') {
                        args[1].env = {
                            ...args[1].env,
                            memory: adjustedMemory
                        };
                    }
                    return await originalInstantiate.apply(this, args);
                } catch (retryError) {
                    console.error('WebAssembly retry failed:', retryError);
                    // If retry fails, continue without WebAssembly optimization
                    return originalInstantiate.apply(this, args);
                }
            }
        };
    } catch (error) {
        console.error('Error configuring WebAssembly:', error);
        // Continue without WebAssembly optimization
    }
};

// Performance logger implementation
const performanceLogger = {
    async logMetrics() {
        const used = process.memoryUsage();
        const metrics = {
            timestamp: new Date().toISOString(),
            heapUsed: Math.round(used.heapUsed / 1024 / 1024),
            heapTotal: Math.round(used.heapTotal / 1024 / 1024),
            rss: Math.round(used.rss / 1024 / 1024),
            external: Math.round(used.external / 1024 / 1024),
            cpuUsage: process.cpuUsage()
        };

        try {
            const logDir = path.join(__dirname, 'logs');
            await fs.mkdir(logDir, { recursive: true });
            await fs.appendFile(
                path.join(logDir, 'performance.log'),
                JSON.stringify(metrics) + '\n'
            );
        } catch (error) {
            console.error('Error logging metrics:', error);
        }
    }
};



// Enhanced database connection with retry mechanism
const connectWithRetry = async (retries = 5) => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, mongooseOptions);
        console.log("Connected to MongoDB");
        restartAttempts = 0;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        if (retries > 0) {
            console.log(`Retrying connection... (${retries} attempts remaining)`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return connectWithRetry(retries - 1);
        }
        throw error;
    }
};

// Server initialization function
async function startServer() {
    try {
        // Configure WebAssembly before server start
        configureWebAssembly();

        // Set Node.js memory limits
        const v8 = require('v8');
        v8.setFlagsFromString('--max_old_space_size=' + MEMORY_CONFIG.maximumMemoryMB);

        await connectWithRetry();

        const server = http.createServer(app);

        // Optimize server settings
        server.keepAliveTimeout = 30000;
        server.headersTimeout = 35000;
        server.maxHeadersCount = 100;

  

        // Enhanced graceful shutdown
        const gracefulShutdown = async () => {
          

            console.log("Starting graceful shutdown...");
            clearInterval(monitoringInterval);

            try {
                await new Promise((resolve) => {
                    server.close(resolve);
                    setTimeout(resolve, 10000);
                });
                console.log("HTTP server closed successfully");

                if (mongoose.connection.readyState !== 0) {
                    await mongoose.connection.close();
                    console.log("Database connection closed successfully");
                }

                console.log("Graceful shutdown completed");
                process.exit(0);
            } catch (error) {
                console.error("Error during shutdown:", error);
                process.exit(1);
            }
        };

        // Process termination handlers
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

        // Start the server
        return server.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });

    } catch (error) {
        console.error("Server initialization error:", error);
        if (restartAttempts < MAX_RESTART_ATTEMPTS) {
            restartAttempts++;
            console.log(`Attempting server restart... (Attempt ${restartAttempts}/${MAX_RESTART_ATTEMPTS})`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            return startServer();
        }
        throw error;
    }
}

// Initialize the server with error handling
startServer().catch(error => {
    console.error("Fatal error during server startup:", error);
});

// Add this before your routes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log('Request Headers:', req.headers);
    if (['POST', 'PUT'].includes(req.method)) {
        console.log('Request Body:', req.body);
    }
    
    // Log response
    const originalSend = res.send;
    res.send = function(data) {
        console.log(`Response Status: ${res.statusCode}`);
        console.log('Response:', data);
        originalSend.apply(res, arguments);
    };
    
    next();
});

// Update your navbar route registration
app.use('/api/navbar', (req, res, next) => {
    console.log('Navbar route accessed');
    require('./routes/navbardata')(req, res, next);
});

// Add this temporary route to check data
app.get('/api/debug/navbar', async (req, res) => {
    try {
        const data = await NavbarModel.find({});
        res.json({
            count: data.length,
            data: data
        });
    } catch (error) {
        res.json({
            error: error.message
        });
    }
});

// Enable garbage collection monitoring (requires --expose-gc flag)

// Add this before your routes
app.use((req, res, next) => {
    res.sendError = (error) => {
        console.error(`API Error: ${error.message}`);
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    };
    next();
});

// Update error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err : undefined
    });
});