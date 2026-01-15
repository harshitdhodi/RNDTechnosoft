const fs = require("fs");
const path = require("path");
const axios = require("axios");
const Sitemap = require("../model/sitemap");
// Base configuration
const BASE_URL = "https://www.rndtechnosoft.com/";
const Service_Category = `${BASE_URL}api/services/getall`;
const Package_Category = `${BASE_URL}api/packages/getAll`;
const Industrial_Category = `${BASE_URL}api/industries/getAll`;
const Blog = `${BASE_URL}api/news/getAllNews`
const Portfolio_Category = `${BASE_URL}api/portfolio/getAll`
const SITEMAP_API_URL = `${BASE_URL}api/sitemap/get`;
// Directory to store sitemaps
const PUBLIC_DIR = path.join(__dirname, "..", "public");

// Generate package categroy sitemap
const generatePackageCategorySitemap = async () => {
    try {
        const response = await axios.get(Package_Category);
        const packages = Array.isArray(response.data) ? response.data : [];

        if (!Array.isArray(packages)) {
            throw new Error('Package API did not return an array');
        }

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        packages.forEach((pkg, index) => {
            const lastModified = pkg.lastmod || pkg.updatedAt;
            const category = pkg.category && typeof pkg.category === 'string' ? pkg.category : null;

            if (!pkg.slug || !lastModified) {
                console.warn(`Skipping invalid package at index ${index}:`, pkg);
                return;
            }

            // Add package URL
            const packageUrl = encodeURI(`${BASE_URL}${pkg.slug}`);
            xmlContent += `  <url>\n`;
            xmlContent += `    <loc>${packageUrl}</loc>\n`;
            xmlContent += `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>\n`;
            xmlContent += `    <changefreq>weekly</changefreq>\n`;
            xmlContent += `    <priority>0.8</priority>\n`;
            xmlContent += `  </url>\n`;

            // Add category URL
            if (category && category.trim() !== '') {
                const categoryUrl = encodeURI(`${BASE_URL}${category.toLowerCase().replace(/\s+/g, '-')}`);
                xmlContent += `  <url>\n`;
                xmlContent += `    <loc>${categoryUrl}</loc>\n`;
                xmlContent += `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>\n`;
                xmlContent += `    <changefreq>weekly</changefreq>\n`;
                xmlContent += `    <priority>0.7</priority>\n`;
                xmlContent += `  </url>\n`;
            }
        });

        xmlContent += `</urlset>\n`;

        if (!fs.existsSync(PUBLIC_DIR)) {
            console.log('Creating public directory:', PUBLIC_DIR);
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }

        const sitemapPath = path.join(PUBLIC_DIR, 'package-category-sitemap.xml');
        console.log('Writing package category sitemap to:', sitemapPath);
        fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

        console.log('Package category sitemap generated successfully as package-category-sitemap.xml');

        await Sitemap.findOneAndUpdate(
            { name: 'package-category-sitemap.xml' },
            { timestamp: Date.now(), priority: 0.8 },
            { upsert: true, new: true }
        );

        console.log('Package category sitemap record updated in the database');
    } catch (error) {
        console.error('Error generating package category sitemap:', error.message);
        if (error.response) {
            console.error('API Response Data:', error.response.data);
            console.error('API Response Status:', error.response.status);
        }
        throw error;
    }
};

// Generate package sub categroy sitemap
const generatePackageSubCategorySitemap = async () => {
    try {
        const response = await axios.get(Package_Category);
        const packages = Array.isArray(response.data) ? response.data : [];

        if (!Array.isArray(packages)) {
            throw new Error('Package API did not return an array');
        }

        console.log(`Processing ${packages.length} package entries`);

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        packages.forEach((pkg, index) => {
            const lastModified = pkg.lastmod; // Use lastmod from the data
            const subCategories = Array.isArray(pkg.subCategories) ? pkg.subCategories : [];
            console.log(subCategories);

            if (!lastModified) {
                console.warn(`Skipping invalid package at index ${index}:`, pkg);
                return;
            }

            // Only process subcategory URLs (skip package/category URL)
            subCategories.forEach((subcat) => {
                if (subcat.slug) {
                    const subcatUrl = encodeURI(`${BASE_URL}${subcat.slug}`); // Use subcat.url or construct from slug
                    xmlContent += `  <url>\n`;
                    xmlContent += `    <loc>${subcatUrl}</loc>\n`;
                    xmlContent += `    <lastmod>${new Date(subcat.lastmod || lastModified).toISOString()}</lastmod>\n`; // Use subcat lastmod or fallback to package lastmod
                    xmlContent += `    <changefreq>${subcat.changeFreq || 'weekly'}</changefreq>\n`; // Use subcat changeFreq or default
                    xmlContent += `    <priority>${subcat.priority || 0.7}</priority>\n`; // Use subcat priority or default
                    xmlContent += `  </url>\n`;
                }
            });
        });

        xmlContent += `</urlset>\n`;

        if (!fs.existsSync(PUBLIC_DIR)) {
            console.log('Creating public directory:', PUBLIC_DIR);
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }

        const sitemapPath = path.join(PUBLIC_DIR, 'package-subcategory-sitemap.xml');
        console.log('Writing package subcategory sitemap to:', sitemapPath);
        fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

        console.log('Package subcategory sitemap generated successfully as package-subcategory-sitemap.xml');

        await Sitemap.findOneAndUpdate(
            { name: 'package-subcategory-sitemap.xml' },
            { timestamp: Date.now(), priority: 0.8 },
            { upsert: true, new: true }
        );

        console.log('Package subcategory sitemap record updated in the database');
    } catch (error) {
        console.error('Error generating package subcategory sitemap:', error.message);
        if (error.response) {
            console.error('API Response Data:', error.response.data);
            console.error('API Response Status:', error.response.status);
        }
        throw error;
    }
};

const generatePackageSubSubCategorySitemap = async () => {
    try {
        // Fetch data from the API
        const response = await axios.get('http://localhost:3021/api/packages/getAll');
        const packages = Array.isArray(response.data) ? response.data : [];
console.log(packages)
        if (!Array.isArray(packages)) {
            throw new Error('API did not return an array');
        }

        console.log(`Processing ${packages.length} package entries`);

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Process packages
        packages.forEach((pkg, index) => {
            const subCategories = Array.isArray(pkg. subCategories) ? pkg. subCategories : [];

            if (subCategories.length === 0) {
                console.log(`No subcategories found for package at index ${index}: ${pkg.slug || 'no-slug'}`);
                return;
            }

            // Process subcategories to find sub-subcategories
            subCategories.forEach((subcat) => {
                const subSubCategories = Array.isArray(subcat.subSubCategory) ? subcat.subSubCategory : [];

                if (subSubCategories.length === 0) {
                    console.log(`No sub-subcategories found for subcategory in package ${pkg.slug || 'no-slug'}`);
                    return;
                }

                // Add sub-subcategory URLs
                subSubCategories.forEach((subsubcat) => {
                    if (subsubcat.slug && subsubcat.lastmod) {
                        const subsubcatUrl = encodeURI(`${BASE_URL}${subsubcat.slug}`);
                        xmlContent += `  <url>\n`;
                        xmlContent += `    <loc>${subsubcatUrl}</loc>\n`;
                        xmlContent += `    <lastmod>${new Date(subsubcat.lastmod).toISOString()}</lastmod>\n`;
                        xmlContent += `    <changefreq>weekly</changefreq>\n`;
                        xmlContent += `    <priority>0.6</priority>\n`;
                        xmlContent += `  </url>\n`;
                    } else {
                        console.warn(`Skipping invalid sub-subcategory in package ${pkg.slug || 'no-slug'}:`, subsubcat);
                    }
                });
            });
        });

        xmlContent += `</urlset>\n`;

        if (!fs.existsSync(PUBLIC_DIR)) {
            console.log('Creating public directory:', PUBLIC_DIR);
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }

        const sitemapPath = path.join(PUBLIC_DIR, 'package-subsubcategory-sitemap.xml');
        console.log('Writing package subsubcategory sitemap to:', sitemapPath);
        fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

        console.log('Package subsubcategory sitemap generated successfully as package-subsubcategory-sitemap.xml');

        await Sitemap.findOneAndUpdate(
            { name: 'package-subsubcategory-sitemap.xml' },
            { timestamp: Date.now(), priority: 0.8 },
            { upsert: true, new: true }
        );

        console.log('Package subsubcategory sitemap record updated in the database');
    } catch (error) {
        console.error('Error generating package subsubcategory sitemap:', error.message);
        if (error.response) {
            console.error('API Response Data:', error.response.data);
            console.error('API Response Status:', error.response.status);
        }
        throw error;
    }
};
// Generate Service categroy sitemap
const generateServiceCategorySitemap = async () => {
  try {
      console.log('Fetching blog data from:', Service_Category);
      const response = await axios.get(Service_Category);
      const blogs = Array.isArray(response.data) ? response.data : [];

      if (!Array.isArray(blogs)) {
          throw new Error('Blog API did not return an array');
      }

      console.log(`Processing ${blogs.length} blog entries`);

      let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      blogs.forEach((blog, index) => {
        const lastModified = blog.updatedAt || blog.lastmod?.['$date'];
        if (!blog.slug || !lastModified) {
            console.warn(`Skipping invalid blog at index ${index}:`, blog);
            return;
        }
        const encodedUrl = encodeURI(`${BASE_URL}${blog.slug}`);
        xmlContent += `  <url>\n`;
        xmlContent += `    <loc>${encodedUrl}</loc>\n`;
        xmlContent += `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>\n`;
        xmlContent += `    <changefreq>weekly</changefreq>\n`;
        xmlContent += `    <priority>0.98</priority>\n`;
        xmlContent += `  </url>\n`;
    });
    

      xmlContent += `</urlset>`;

      if (!fs.existsSync(PUBLIC_DIR)) {
          console.log('Creating public directory:', PUBLIC_DIR);
          fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      }

      const sitemapPath = path.join(PUBLIC_DIR, 'blog-sitemap.xml');
      console.log('Writing blog sitemap to:', sitemapPath);
      fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

      console.log('Blog sitemap generated successfully as blog-sitemap.xml');

      await Sitemap.findOneAndUpdate(
          { name: 'blog-sitemap.xml' },
          { timestamp: Date.now(), priority: 0.98 },
          { upsert: true, new: true }
      );

      console.log('Blog sitemap record updated in the database');
  } catch (error) {
      console.error('Error generating blog sitemap:', error.message);
      if (error.response) {
          console.error('API Response Data:', error.response.data);
          console.error('API Response Status:', error.response.status);
      }
      throw error;
  }
};

// Generate chemical sitemap
const generateServiceSubCategorySitemap = async () => {
  try {
    console.log('Fetching service category data from:', Service_Category);
    const response = await axios.get(Service_Category);
    const serviceCategories = Array.isArray(response.data) ? response.data : [];

    if (!Array.isArray(serviceCategories)) {
      throw new Error('Service Category API did not return an array');
    }

    console.log(`Processing ${serviceCategories.length} service categories`);

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Iterate through each service category and its subcategories
    serviceCategories.forEach((category, catIndex) => {
      const subCategories = Array.isArray(category.subCategories) ? category.subCategories : [];
      console.log(`Processing ${subCategories.length} subcategories for category: ${category.category}`);

      subCategories.forEach((subCategory, subCatIndex) => {
        if (!subCategory.slug || !subCategory.lastmod) {
          console.warn(`Skipping invalid subcategory at category index ${catIndex}, subcategory index ${subCatIndex}:`, subCategory);
          return;
        }

        // Validate the lastmod['$date'] field
        const lastModDate = subCategory.lastmod['$date'];
        let formattedDate;
        try {
          const date = new Date(lastModDate);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date');
          }
          formattedDate = date.toISOString();
        } catch (e) {
          console.warn(`Invalid lastmod date for subcategory at category index ${catIndex}, subcategory index ${subCatIndex}: ${lastModDate}. Using current date as fallback.`);
          formattedDate = new Date().toISOString(); // Fallback to current date
        }

        xmlContent += `<url>\n`;
        xmlContent += `<loc>${BASE_URL}${subCategory.slug}</loc>\n`;
        xmlContent += `<lastmod>${formattedDate}</lastmod>\n`;
        xmlContent += `<changefreq>weekly</changefreq>\n`;
        xmlContent += `<priority>0.8</priority>\n`;
        xmlContent += `</url>\n`;
      });
    });

    xmlContent += `</urlset>`;

    if (!fs.existsSync(PUBLIC_DIR)) {
      console.log('Creating public directory:', PUBLIC_DIR);
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, 'service-subcategories-sitemap.xml');
    console.log('Writing service subcategories sitemap to:', sitemapPath);
    fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

    console.log('Service subcategories sitemap generated successfully as service-subcategories-sitemap.xml');

    await Sitemap.findOneAndUpdate(
      { name: 'service-subcategories-sitemap.xml' },
      { timestamp: Date.now(), priority: 0.8 },
      { upsert: true, new: true }
    );

    console.log('Service subcategories sitemap record updated in the database');
  } catch (error) {
    console.error('Error generating service subcategories sitemap:', error.message);
    if (error.response) {
      console.error('API Response Data:', error.response.data);
      console.error('API Response Status:', error.response.status);
    }
    throw error;
  }
};

// Generate main sitemap
const generateServiceSubSubCategorySitemap = async () => {
  try {
    console.log('Fetching service category data from:', Service_Category);
    const response = await axios.get(Service_Category);
    const serviceCategories = Array.isArray(response.data) ? response.data : [];

    if (!Array.isArray(serviceCategories)) {
      throw new Error('Service Category API did not return an array');
    }

    console.log(`Processing ${serviceCategories.length} service categories`);

    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Iterate through each service category, its subcategories, and sub-subcategories
    serviceCategories.forEach((category, catIndex) => {
      const subCategories = Array.isArray(category.subCategories) ? category.subCategories : [];
      console.log(`Processing ${subCategories.length} subcategories for category: ${category.category}`);

      subCategories.forEach((subCategory, subCatIndex) => {
        const subSubCategories = Array.isArray(subCategory.subSubCategory) ? subCategory.subSubCategory : [];
        console.log(`Processing ${subSubCategories.length} sub-subcategories for subcategory: ${subCategory.category || 'unknown'}`);

        subSubCategories.forEach((subSubCategory, subSubCatIndex) => {
          if (!subSubCategory.slug || !subSubCategory.lastmod) {
            console.warn(`Skipping invalid sub-subcategory at category index ${catIndex}, subcategory index ${subCatIndex}, sub-subcategory index ${subSubCatIndex}:`, subSubCategory);
            return;
          }

          // Validate the lastmod['$date'] field
          const lastModDate = subSubCategory.lastmod['$date'];
          let formattedDate;
          try {
            const date = new Date(lastModDate);
            if (isNaN(date.getTime())) {
              throw new Error('Invalid date');
            }
            formattedDate = date.toISOString();
          } catch (e) {
            console.warn(`Invalid lastmod date for sub-subcategory at category index ${catIndex}, subcategory index ${subCatIndex}, sub-subcategory index ${subSubCatIndex}: ${lastModDate}. Using current date as fallback.`);
            formattedDate = new Date().toISOString(); // Fallback to current date
          }

          xmlContent += `  <url>\n`;
          xmlContent += `    <loc>${BASE_URL}${subSubCategory.slug}</loc>\n`;
          xmlContent += `    <lastmod>${formattedDate}</lastmod>\n`;
          xmlContent += `    <changefreq>weekly</changefreq>\n`;
          xmlContent += `    <priority>0.7</priority>\n`;
          xmlContent += `  </url>\n`;
        });
      });
    });

    xmlContent += `</urlset>`;

    if (!fs.existsSync(PUBLIC_DIR)) {
      console.log('Creating public directory:', PUBLIC_DIR);
      fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    }

    const sitemapPath = path.join(PUBLIC_DIR, 'service-subsubcategories-sitemap.xml');
    console.log('Writing service sub-subcategories sitemap to:', sitemapPath);
    fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

    console.log('Service sub-subcategories sitemap generated successfully as service-subsubcategories-sitemap.xml');

    await Sitemap.findOneAndUpdate(
      { name: 'service-subsubcategories-sitemap.xml' },
      { timestamp: Date.now(), priority: 0.7 },
      { upsert: true, new: true }
    );

    console.log('Service sub-subcategories sitemap record updated in the database');
  } catch (error) {
    console.error('Error generating service sub-subcategories sitemap:', error.message);
    if (error.response) {
      console.error('API Response Data:', error.response.data);
      console.error('API Response Status:', error.response.status);
    }
    throw error;
  }
};

// Middleware to serve sitemaps
const generateStaticPagesSitemap = async () => {
  try {
      console.log('Generating static pages sitemap');

      const staticPages = [
        { slug: '', priority: 1.0 },
          { slug: 'about-us', priority: 0.8 },
          { slug: 'contact-us', priority: 0.7 },
          { slug: 'cookies-policy', priority:0.6},
          { slug: 'privacy-policy', priority:0.4},
          { slug:'terms-conditions', priority:0.2},
          {slug:'helpCenter', priority:0.9},
          {slug:'blogs', priority:0.3},
          {slug:'contact', priority:0.5}
      ];

      let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      staticPages.forEach((page) => {
          xmlContent += `  <url>\n`;
          xmlContent += `    <loc>${BASE_URL}${page.slug}</loc>\n`;
          xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
          xmlContent += `    <changefreq>monthly</changefreq>\n`;
          xmlContent += `    <priority>${page.priority}</priority>\n`;
          xmlContent += `  </url>\n`;
      });

      xmlContent += `</urlset>`;

      if (!fs.existsSync(PUBLIC_DIR)) {
          console.log('Creating public directory:', PUBLIC_DIR);
          fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      }

      const sitemapPath = path.join(PUBLIC_DIR, 'sitemap1.xml');
      console.log('Writing static pages sitemap to:', sitemapPath);
      fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

      console.log('Static pages sitemap generated successfully as sitemap1.xml');

      await Sitemap.findOneAndUpdate(
          { name: 'sitemap1.xml' },
          { timestamp: Date.now(), priority: 0.8 }, // Store priority
          { upsert: true, new: true }
      );

      console.log('Static pages sitemap record updated in the database');
  } catch (error) {
      console.error('Error generating static pages sitemap:', error.message);
      throw error;
  }
};

// Generate industrial categroy sitemap
const generateIndustrialCategorySitemap = async () => {
    try {
        const response = await axios.get(Industrial_Category);
        const packages = Array.isArray(response.data) ? response.data : [];

        if (!Array.isArray(packages)) {
            throw new Error('Package API did not return an array');
        }

        console.log(`Processing ${packages.length} package entries`);

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Track URLs that have already been added to avoid duplicates
        const addedUrls = new Set();

        packages.forEach((pkg, index) => {
            const lastModified = pkg.lastmod || pkg.updatedAt;
            const category = pkg.category && typeof pkg.category === 'string' ? pkg.category : null;

            if (!pkg.slug || !lastModified) {
                console.warn(`Skipping invalid package at index ${index}:`, pkg);
                return;
            }

            // Ensure slug is properly formatted (no trailing dashes)
            const cleanSlug = pkg.slug.replace(/-+$/g, '');
            
            // Add package URL
            const packageUrl = encodeURI(`${BASE_URL}${cleanSlug}`);
            
            // Only add if we haven't added this URL before
            if (!addedUrls.has(packageUrl)) {
                xmlContent += `  <url>\n`;
                xmlContent += `    <loc>${packageUrl}</loc>\n`;
                xmlContent += `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>\n`;
                xmlContent += `    <changefreq>weekly</changefreq>\n`;
                xmlContent += `    <priority>0.8</priority>\n`;
                xmlContent += `  </url>\n`;
                
                // Mark this URL as added
                addedUrls.add(packageUrl);
            }

            // Add category URL only if it differs from package URL and is valid
            if (category && category.trim() !== '') {
                const categorySlug = category.toLowerCase()
                    .replace(/\s+/g, '-')       // Replace spaces with dashes
                    .replace(/-+$/g, '')        // Remove trailing dashes
                    .replace(/-+/g, '-');       // Replace multiple dashes with single dash
                
                const categoryUrl = encodeURI(`${BASE_URL}${categorySlug}`);
                
                // Check if category URL is different from package URL and not added before
                if (categoryUrl !== packageUrl && !addedUrls.has(categoryUrl)) {
                    xmlContent += `  <url>\n`;
                    xmlContent += `    <loc>${categoryUrl}</loc>\n`;
                    xmlContent += `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>\n`;
                    xmlContent += `    <changefreq>weekly</changefreq>\n`;
                    xmlContent += `    <priority>0.7</priority>\n`;
                    xmlContent += `  </url>\n`;
                    
                    // Mark this category URL as added
                    addedUrls.add(categoryUrl);
                } else {
                    console.log(`Skipping duplicate category URL: ${categoryUrl}`);
                }
            }
        });

        xmlContent += `</urlset>\n`;

        if (!fs.existsSync(PUBLIC_DIR)) {
            console.log('Creating public directory:', PUBLIC_DIR);
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }

        const sitemapPath = path.join(PUBLIC_DIR, 'industrial-category-sitemap.xml');
        console.log('Writing industrial category sitemap to:', sitemapPath);
        fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

        console.log('Industrial category sitemap generated successfully as industrial-category-sitemap.xml');

        await Sitemap.findOneAndUpdate(
            { name: 'industrial-category-sitemap.xml' },
            { timestamp: Date.now(), priority: 0.8 },
            { upsert: true, new: true }
        );

        console.log('Industrial category sitemap record updated in the database');
    } catch (error) {
        console.error('Error generating industrial category sitemap:', error.message);
        if (error.response) {
            console.error('API Response Data:', error.response.data);
            console.error('API Response Status:', error.response.status);
        }
        throw error;
    }
};

// Generate industrial subcategory sitemap
const generateIndustrialSubcategorySitemap = async () => {
    try {
        const response = await axios.get(Industrial_Category);
        const industries = Array.isArray(response.data) ? response.data : [];

        if (!Array.isArray(industries)) {
            throw new Error('Industry API did not return an array');
        }

        console.log(`Processing ${industries.length} industry entries`);

        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Track URLs that have already been added to avoid duplicates
        const addedUrls = new Set();

        industries.forEach((industry, index) => {
            // Process each subcategory in the industry
            if (industry.subCategories && Array.isArray(industry.subCategories)) {
                industry.subCategories.forEach(subcategory => {
                    const lastModified = subcategory.lastmod || industry.lastmod;
                    
                    if (!subcategory.slug || !lastModified) {
                        console.warn(`Skipping invalid subcategory in industry ${industry.category}:`, subcategory);
                        return;
                    }

                    // Ensure slug is properly formatted (no trailing dashes)
                    const cleanSlug = subcategory.slug.replace(/-+$/g, '');
                    
                    // Use the provided URL if available, otherwise construct it
                    const subcategoryUrl = subcategory.url || encodeURI(`${BASE_URL}${cleanSlug}`);
                    
                    // Only add if we haven't added this URL before
                    if (!addedUrls.has(subcategoryUrl)) {
                        xmlContent += `  <url>\n`;
                        xmlContent += `    <loc>${subcategoryUrl}</loc>\n`;
                        xmlContent += `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>\n`;
                        xmlContent += `    <changefreq>${subcategory.changeFreq || 'weekly'}</changefreq>\n`;
                        xmlContent += `    <priority>${subcategory.priority || 0.7}</priority>\n`;
                        xmlContent += `  </url>\n`;
                        
                        // Mark this URL as added
                        addedUrls.add(subcategoryUrl);
                        console.log(`Added subcategory URL: ${subcategoryUrl}`);
                    } else {
                        console.log(`Skipping duplicate subcategory URL: ${subcategoryUrl}`);
                    }
                });
            } else {
                console.log(`No subcategories found for industry: ${industry.category}`);
            }
        });

        xmlContent += `</urlset>\n`;

        if (!fs.existsSync(PUBLIC_DIR)) {
            console.log('Creating public directory:', PUBLIC_DIR);
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }

        const sitemapPath = path.join(PUBLIC_DIR, 'industrial-subcategory-sitemap.xml');
        console.log('Writing industrial subcategory sitemap to:', sitemapPath);
        fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

        console.log(`Industrial subcategory sitemap generated successfully with ${addedUrls.size} URLs as industrial-subcategory-sitemap.xml`);

        await Sitemap.findOneAndUpdate(
            { name: 'industrial-subcategory-sitemap.xml' },
            { timestamp: Date.now(), priority: 0.8, urlCount: addedUrls.size },
            { upsert: true, new: true }
        );

        console.log('Industrial subcategory sitemap record updated in the database');
    } catch (error) {
        console.error('Error generating industrial subcategory sitemap:', error.message);
        if (error.response) {
            console.error('API Response Data:', error.response.data);
            console.error('API Response Status:', error.response.status);
        }
        throw error;
    }
};

// Generate industrial subcategory sitemap
const generateBlogSitemap = async () => {
    try {
        // Fetch blog posts data from API
        const response = await axios.get(Blog);
        console.log('Response data structure:', response.data.data);
        
        // Check if response.data.data exists and is an array
        const blogPosts = Array.isArray(response.data.data) ? response.data.data : [];

        if (!Array.isArray(blogPosts)) {
            throw new Error('Blog API did not return an array in data property');
        }

        console.log(`Processing ${blogPosts.length} blog posts`);

        // Initialize XML content
        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

        // Track URLs that have already been added to avoid duplicates
        const addedUrls = new Set();
        let urlCount = 0;

        // Process each blog post
        for (const post of blogPosts) {
            // Skip invalid entries (posts without slugs)
            if (!post.slug) {
                console.warn(`Skipping blog post without slug:`, post.title || 'Untitled post');
                continue;
            }

            // Get the last modified date or fallback to createdAt/current date
            const lastModified = post.lastmod || post.updatedAt || post.createdAt || new Date().toISOString();
            
            // Clean slug by removing trailing dashes
            const cleanSlug = post.slug.replace(/-+$/g, '');
            
            // Use provided URL or construct one from slug
            const postUrl = post.url || `blog/${cleanSlug}`;
            
            // Ensure we have a properly formatted URL
            const fullUrl = postUrl.startsWith('http') 
                ? postUrl 
                : `${BASE_URL}${postUrl.startsWith('/') ? postUrl : '/' + postUrl}`;
            
            // Skip duplicates
            if (addedUrls.has(fullUrl)) {
                console.log(`Skipping duplicate blog post URL: ${fullUrl}`);
                continue;
            }
            
            // Add URL to sitemap
            xmlContent += `  <url>\n`;
            xmlContent += `    <loc>https://www.rndtechnosoft.com/blog/${cleanSlug}</loc>\n`;
            xmlContent += `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>\n`;
            xmlContent += `    <changefreq>${post.changeFreq || 'weekly'}</changefreq>\n`;
            xmlContent += `    <priority>${post.priority || 0.7}</priority>\n`;
            xmlContent += `  </url>\n`;
            
            // Mark URL as added
            addedUrls.add(fullUrl);
            urlCount++;
            
            if (urlCount % 100 === 0) {
                console.log(`Processed ${urlCount} URLs so far...`);
            }
        }

        xmlContent += `</urlset>\n`;

        // Create directory if it doesn't exist
        if (!fs.existsSync(PUBLIC_DIR)) {
            console.log('Creating public directory:', PUBLIC_DIR);
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }

        // Write sitemap to file
        const sitemapFile = 'blog-sitemap.xml';
        const sitemapPath = path.join(PUBLIC_DIR, sitemapFile);
        console.log('Writing blog sitemap to:', sitemapPath);
        fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });

        console.log(`Blog sitemap generated successfully with ${addedUrls.size} URLs as ${sitemapFile}`);

        // Update database record
        await Sitemap.findOneAndUpdate(
            { name: sitemapFile },
            { 
                timestamp: Date.now(), 
                priority: 0.8, 
                urlCount: addedUrls.size,
                lastGenerated: new Date().toISOString(),
                type: 'blog'
            },
            { upsert: true, new: true }
        );

        console.log('Blog sitemap record updated in the database');
        return { success: true, urlCount: addedUrls.size };
    } catch (error) {
        console.error('Error generating blog sitemap:', error.message);
        if (error.response) {
            console.error('API Response Data:', error.response.data);
            console.error('API Response Status:', error.response.status);
        }
        throw error;
    }
};


// Generate Service categroy sitemap
const generatePortfolioCategorySitemap = async () => {
    try {
      console.log('Fetching portfolio category data from:', Portfolio_Category);
      const response = await axios.get(`http://localhost:3021/api/portfolio/getAll`);
      const categories = Array.isArray(response.data) ? response.data : [];
      console.log('Categories fetched:', categories.length);
  
      if (!Array.isArray(categories)) {
        throw new Error('Portfolio Category API did not return an array');
      }
  
      console.log(`Processing ${categories.length} portfolio categories`);
  
      let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xmlContent += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
      categories.forEach((category, index) => {
        // Check if lastmod exists as a string or as an object with $date property
        const lastModified = category.updatedAt || 
                            (typeof category.lastmod === 'string' ? category.lastmod : 
                             category.lastmod?.['$date']);
                             
        if (!category.slug || !lastModified) {
          console.warn(`Skipping invalid category at index ${index}:`, category);
          return;
        }
  
        // Add main category to sitemap
        const encodedUrl = encodeURI(`${BASE_URL}${category.slug}`);
        xmlContent += `  <url>\n`;
        xmlContent += `    <loc>${encodedUrl}</loc>\n`;
        xmlContent += `    <lastmod>${new Date(lastModified).toISOString()}</lastmod>\n`;
        xmlContent += `    <changefreq>${category.changeFreq || 'weekly'}</changefreq>\n`;
        xmlContent += `    <priority>${category.priority || '0.98'}</priority>\n`;
        xmlContent += `  </url>\n`;
        
        // Process subcategories if they exist
        if (Array.isArray(category.subCategories) && category.subCategories.length > 0) {
          category.subCategories.forEach((subCat, subIndex) => {
            if (!subCat.slug) {
              console.warn(`Skipping invalid subcategory at index ${index}.${subIndex}:`, subCat);
              return;
            }
            
            const subLastMod = subCat.updatedAt || 
                             (typeof subCat.lastmod === 'string' ? subCat.lastmod : 
                              subCat.lastmod?.['$date']);
            
            if (!subLastMod) {
              console.warn(`Skipping subcategory without lastmod at index ${index}.${subIndex}:`, subCat);
              return;
            }
            
            const subEncodedUrl = encodeURI(`${BASE_URL}${subCat.slug}`);
            xmlContent += `  <url>\n`;
            xmlContent += `    <loc>${subEncodedUrl}</loc>\n`;
            xmlContent += `    <lastmod>${new Date(subLastMod).toISOString()}</lastmod>\n`;
            xmlContent += `    <changefreq>${subCat.changeFreq || 'weekly'}</changefreq>\n`;
            xmlContent += `    <priority>${subCat.priority || '0.95'}</priority>\n`;
            xmlContent += `  </url>\n`;
            
            // Process sub-subcategories if they exist
            if (Array.isArray(subCat.subSubCategory) && subCat.subSubCategory.length > 0) {
              subCat.subSubCategory.forEach((subSubCat, subSubIndex) => {
                if (!subSubCat.slug) {
                  console.warn(`Skipping invalid sub-subcategory at index ${index}.${subIndex}.${subSubIndex}:`, subSubCat);
                  return;
                }
                
                const subSubLastMod = subSubCat.updatedAt || 
                                   (typeof subSubCat.lastmod === 'string' ? subSubCat.lastmod : 
                                    subSubCat.lastmod?.['$date']);
                
                if (!subSubLastMod) {
                  console.warn(`Skipping sub-subcategory without lastmod at index ${index}.${subIndex}.${subSubIndex}:`, subSubCat);
                  return;
                }
                
                const subSubEncodedUrl = encodeURI(`${BASE_URL}${subSubCat.slug}`);
                xmlContent += `  <url>\n`;
                xmlContent += `    <loc>${subSubEncodedUrl}</loc>\n`;
                xmlContent += `    <lastmod>${new Date(subSubLastMod).toISOString()}</lastmod>\n`;
                xmlContent += `    <changefreq>${subSubCat.changeFreq || 'weekly'}</changefreq>\n`;
                xmlContent += `    <priority>${subSubCat.priority || '0.90'}</priority>\n`;
                xmlContent += `  </url>\n`;
              });
            }
          });
        }
      });
  
      xmlContent += `</urlset>`;
  
      if (!fs.existsSync(PUBLIC_DIR)) {
        console.log('Creating public directory:', PUBLIC_DIR);
        fs.mkdirSync(PUBLIC_DIR, { recursive: true });
      }
  
      const sitemapPath = path.join(PUBLIC_DIR, 'portfolio-category-sitemap.xml');
      console.log('Writing portfolio category sitemap to:', sitemapPath);
      fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });
  
      console.log('Portfolio category sitemap generated successfully as portfolio-category-sitemap.xml');
  
      // If using a database to track sitemaps
      if (typeof Sitemap !== 'undefined') {
        await Sitemap.findOneAndUpdate(
          { name: 'portfolio-category-sitemap.xml' },
          { timestamp: Date.now(), priority: 0.98 },
          { upsert: true, new: true }
        );
        console.log('Portfolio category sitemap record updated in the database');
      }
    } catch (error) {
      console.error('Error generating portfolio category sitemap:', error.message);
      if (error.response) {
        console.error('API Response Data:', error.response.data);
        console.error('API Response Status:', error.response.status);
      }
      throw error;
    }
  }; 
  
// Generate main sitemap
const generateMainSitemap = async () => {
    try {
        console.log('Generating main sitemap with specific entries in the desired order');
  
        let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
        xmlContent += `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
        // Add the required <sitemap> entries in the desired sequence
        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/sitemap1.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;
   
        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/blog-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;
  
        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/industrial-category-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;

        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/industrial-subcategory-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;

        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/package-category-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;

        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/package-subcategory-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;


        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/package-subsubcategory-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;
  
        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/portfolio-category-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;

        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/service-subcategories-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;


        xmlContent += `  <sitemap>\n`;
        xmlContent += `    <loc>https://www.rndtechnosoft.com/service-subsubcategories-sitemap.xml</loc>\n`;
        xmlContent += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
        xmlContent += `  </sitemap>\n`;
        
        xmlContent += `</sitemapindex>`;
  
        if (!fs.existsSync(PUBLIC_DIR)) {
            console.log('Creating public directory:', PUBLIC_DIR);
            fs.mkdirSync(PUBLIC_DIR, { recursive: true });
        }
  
        const sitemapPath = path.join(PUBLIC_DIR, 'sitemap.xml');
        console.log('Writing main sitemap to:', sitemapPath);
        fs.writeFileSync(sitemapPath, xmlContent, { encoding: 'utf8' });
  
        console.log('Main sitemap generated successfully as sitemap.xml');
  
        await Sitemap.findOneAndUpdate(
            { name: 'sitemap.xml' },
            { timestamp: Date.now(), priority: 0.5 },
            { upsert: true, new: true }
        );
  
        console.log('Main sitemap record updated in the database');
    } catch (error) {
        console.error('Error generating main sitemap:', error.message);
        throw error;
    }
  };
// Generate all sitemaps
const generateAllSitemaps = async () => {
   
    await generatePackageSubCategorySitemap();
   await generatePackageCategorySitemap();
  await generateServiceCategorySitemap();
  await generateServiceSubCategorySitemap();
  await generateServiceSubSubCategorySitemap(); 
await generatePackageSubSubCategorySitemap();
await generateIndustrialCategorySitemap();
await generateIndustrialSubcategorySitemap();
await generateBlogSitemap();
await generatePortfolioCategorySitemap();
await generateMainSitemap();
await generateStaticPagesSitemap();
};


// Add the new function to the exports
module.exports = {
 generatePackageSubCategorySitemap,
  generateServiceCategorySitemap,
  generateServiceSubCategorySitemap,
  generateServiceSubSubCategorySitemap,
  generateAllSitemaps,
  generatePackageCategorySitemap, // Export the new function
generatePackageSubSubCategorySitemap,
generateIndustrialCategorySitemap,
generateIndustrialSubcategorySitemap,
generateBlogSitemap,
generatePortfolioCategorySitemap,
generateMainSitemap,
generateStaticPagesSitemap
};

