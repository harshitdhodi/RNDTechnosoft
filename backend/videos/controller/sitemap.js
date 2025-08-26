const Sitemap = require('../model/sitemap');
const fs = require('fs');
const path = require('path');

const generateSitemapXML = (sitemaps) => {
  const lastmod = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).replace(',', '');
  // const baseUrl = 'https://yourwebsite.com'; // Replace with your website URL
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  sitemaps.forEach((sitemap) => {
    xml += '  <url>\n';
    xml += `    <loc>${sitemap.url}</loc>\n`;
    xml += `    <lastmod>${lastmod}</lastmod>\n`;
    if (sitemap.changeFreq) {
      xml += `    <changefreq>${sitemap.changeFreq}</changefreq>\n`;
    }
    if (sitemap.priority) {
      xml += `    <priority>${sitemap.priority}</priority>\n`;
    }
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
};

exports.generateMainSitemap = async (req, res) => {
  const { dataSitemaps } = req.body;
  console.log(req.body)

  try {
    const xmlContent = generateSitemapXML(dataSitemaps);
    const sitemapPath = path.join(__dirname, '..', 'dist',  'sitemap.xml');

    // Ensure the public directory exists
    fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });

    // Write the XML content to the file
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');

    res.status(200).json({ message: "Sitemap generated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate sitemap." });
  }
};

exports.generateProductSitemap = async (req, res) => {
  const { productSitemaps } = req.body;
  console.log(req.body)

  try {
    const xmlContent = generateSitemapXML(productSitemaps);
    const sitemapPath = path.join(__dirname, '..', 'dist',  'sitemap.xml');

    // Ensure the public directory exists
    fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });

    // Write the XML content to the file
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');

    res.status(200).json({ message: "Sitemap generated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate sitemap." });
  }
};

exports.generateServiceSitemap = async (req, res) => {
  const { serviceSitemaps } = req.body;
  console.log(req.body)

  try {
    const xmlContent = generateSitemapXML(serviceSitemaps);
    const sitemapPath = path.join(__dirname, '..', 'dist',  'sitemap.xml');

    // Ensure the public directory exists
    fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });

    // Write the XML content to the file
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');

    res.status(200).json({ message: "Sitemap generated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate sitemap." });
  }
};

exports.generatePackageSitemap = async (req, res) => {
  const { packageSitemaps } = req.body;
  console.log(req.body)

  try {
    const xmlContent = generateSitemapXML(packageSitemaps);
    const sitemapPath = path.join(__dirname, '..', 'dist',  'sitemap.xml');

    // Ensure the public directory exists
    fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });

    // Write the XML content to the file
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');

    res.status(200).json({ message: "Sitemap generated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate sitemap." });
  }
};


exports.generateNewsSitemap = async (req, res) => {
  const { newsSitemaps } = req.body;
  console.log(req.body)

  try {
    const xmlContent = generateSitemapXML(newsSitemaps);
    const sitemapPath = path.join(__dirname, '..', 'dist',  'sitemap.xml');

    // Ensure the public directory exists
    fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });

    // Write the XML content to the file
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');

    res.status(200).json({ message: "Sitemap generated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate sitemap." });
  }
};

exports.createSitemap = async (req, res) => {
  const { url, changeFreq, priority, metatitle, metalanguage, metadescription, metakeywords, metacanonical, metaschema, otherMeta } = req.body;
  try {
    // Check if the URL already exists
    const existingSitemap = await Sitemap.findOne({ url });
    if (existingSitemap) {
      return res.status(400).json({ message: 'URL already exists in the sitemap.' });
    }

    // Create a new sitemap entry
    const newSitemap = new Sitemap({
      url,
      changeFreq,
      priority,
      metatitle,
      metadescription,
      metakeywords,
      metalanguage,
      metacanonical,
      metaschema,
      otherMeta
    });

    // Save the sitemap entry to the database
    await newSitemap.save();

    res.status(201).json({ message: 'Sitemap entry created successfully.', sitemap: newSitemap });
  } catch (error) {
    console.error('Error creating sitemap:', error);
    res.status(500).json({ message: 'Internal Server Error.' });
  }
};


exports.fetchUrlPriorityFreq = async (req, res) => {
  try {
    // Get serviceId from request parameters
    const sitemap = await Sitemap.find({}).select('_id url priority changeFreq lastmod');
    if (!sitemap) {
      return res.status(404).json({ error: "sitemap not found" });
    }
    res.status(200).json(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.fetchUrlmeta = async (req, res) => {
  try {
    // Get serviceId from request parameters
    const sitemap = await Sitemap.find({}).select('_id url metattitle metadescription metacanonical metalanguage');
    if (!sitemap) {
      return res.status(404).json({ error: "sitemap not found" });
    }
    res.status(200).json(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


exports.editUrlPriorityFreq = async (req, res) => {
  try {
    const { id } = req.query; // Get serviceId from request parameters
    const { url, priority, changeFreq } = req.body;

    const updatedSitemap = await Sitemap.findByIdAndUpdate(
      id,
      { url, priority, changeFreq, lastmod: Date.now() },
      { new: true }
    );

    if (!updatedSitemap) {
      return res.status(404).json({ error: "service not found" });
    }

    res.status(200).json(updatedSitemap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



// const deleteUrlPriorityFreq = async (req, res) => {
//   try {
//     const { id } = req.query; // Get serviceId from request parameters

//     const updatedService = await Service.findByIdAndUpdate(
//       id,
//       { $unset: { url: "", priority: "", changeFreq: "" } },
//       { new: true }
//     );

//     if (!updatedService) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.status(200).json({ message: "Url, priority, and freq deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

exports.fetchUrlPriorityFreqById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the service by ID and select specific fields
    const sitemap = await Sitemap.findById(id).select('url priority changeFreq ');

    if (!sitemap) {
      return res.status(404).json({ error: "service not found" });
    }

    res.status(200).json(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};



exports.fetchSitemaps = async (req, res) => {
  try {
    const sitemaps = await Sitemap.find({}).select('_id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');
    if (!sitemaps) {
      return res.status(404).json({ error: "Sitemaps not found" });
    }
    res.status(200).json(sitemaps);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.fetchSitemapById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const sitemap = await Sitemap.findById(id).select('url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');

    if (!sitemap) {
      return res.status(404).json({ error: "Sitemap not found" });
    }

    res.status(200).json(sitemap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateSitemapById = async (req, res) => {
  try {
    const { id } = req.query; // Get sitemapId from request parameters
    const { url, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta } = req.body;

    const updatedSitemap = await Sitemap.findByIdAndUpdate(
      id,
      {
        url,
        metatitle,
        metadescription,
        metakeywords,
        metacanonical,
        metalanguage,
        metaschema,
        otherMeta,
      },
      { new: true }
    );

    if (!updatedSitemap) {
      return res.status(404).json({ error: "Sitemap not found" });
    }

    res.status(200).json(updatedSitemap);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.generateSitemapIndex = async (req, res) => {
  try {
    const sitemaps = [
      { url: 'http://localhost:3000/sitemap-main.xml' },
      // { url: 'http://localhost:3000/sitemap-product.xml' },
      { url: 'http://localhost:3000/sitemap-service.xml' },
      { url: 'http://localhost:3000/sitemap-package.xml' },
      { url: 'http://localhost:3000/sitemap-news.xml' },
    ];

    const xmlContent = generateSitemapXML(sitemaps);
    const sitemapPath = path.join(__dirname, '..', 'dist',  'sitemap.xml');

    // Ensure the public directory exists
    fs.mkdirSync(path.dirname(sitemapPath), { recursive: true });

    // Write the XML content to the file
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');

    res.status(200).json({ message: "Sitemap index generated successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate sitemap index." });
  }
};