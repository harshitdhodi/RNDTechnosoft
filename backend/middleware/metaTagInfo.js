const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = "https://www.rndtechnosoft.com/";
const API_ENDPOINTS = {
  Service_Category: `${BASE_URL}api/services/getall`,
  Package_Category: `${BASE_URL}api/packages/getAll`,
  Industrial_Category: `${BASE_URL}api/industries/getAll`,
  Blog: `${BASE_URL}api/news/getAllNews`,
  BlogDetails: `${BASE_URL}api/news/getNewsById`,
  Portfolio_Category: `${BASE_URL}api/portfolio/getAll`,
  Static_Meta: `${BASE_URL}api/staticMeta/get-meta`
};

const fetchAllMetaData = async () => {
  try {
    const [services, packages, industries, blogs, portfolios] = await Promise.all([
      axios.get(API_ENDPOINTS.Service_Category),
      axios.get(API_ENDPOINTS.Package_Category),
      axios.get(API_ENDPOINTS.Industrial_Category),
      axios.get(API_ENDPOINTS.Blog),
      axios.get(API_ENDPOINTS.Portfolio_Category)
    ]);

    return {
      services: services.data || [],
      packages: packages.data || [],
      industries: industries.data || [],
      blogs: blogs.data?.data || [],
      portfolios: portfolios.data || []
    };
  } catch (err) {
    console.error('Error fetching metadata:', err.message);
    return {
      services: [],
      packages: [],
      industries: [],
      blogs: [],
      portfolios: []
    };
  }
};

const fetchBlogBySlug = async (slug) => {
  try {
    const response = await axios.get(`${BASE_URL}api/news/getAllNews`);
    const blogs = response.data.data || [];
    const blog = blogs.find((item) => item.slug === slug);
    return blog || null;
  } catch (err) {
    console.error(`Error fetching blog data for slug ${slug}:`, err.message);
    return null;
  }
};

const fetchStaticMeta = async (path) => {
  console.log(path)
  try {
    // Use the exact path, default to '/' for empty path
    const slug = path || '/';
    console.log(`Fetching static meta for slug: ${slug}`);
    const response = await axios.get(`${API_ENDPOINTS.Static_Meta}?path=${encodeURIComponent(slug)}`);
    console.log('Static meta API response:', response.data.data);
    const staticPages = Array.isArray(response.data.data) ? response.data.data : [];
    const matchedPage = staticPages.find(page => page.pageSlug === slug);
    console.log('Matched static page:', matchedPage);
    return matchedPage || null;
  } catch (err) {
    console.error(`Error fetching static meta for path ${path}:`, err.message);
    return null;
  }
};

// Helper function to generate meta info for a matched item (category pages)
const generateMetaInfo = (item, categoryName, defaultImage) => ({
  title: item.metatitle || `Professional ${categoryName} | RND Technosoft`,
  description: item.metadescription || `Discover RND Technosoft's ${categoryName.toLowerCase()} solutions for your business.`,
  keywords: item.metakeywords || `${categoryName.toLowerCase()}, RND Technosoft`,
  ogImage: item.photo ? `/uploads/${item.photo}` : defaultImage
});

// Helper function to generate meta info for static pages
const generateStaticMetaInfo = (item, defaultImage) => {
  const metaInfo = {
    title: item.metaTitle || 'RND Technosoft - Home',
    description: item.metaDescription || 'Welcome to RND Technosoft, your trusted source for high-quality chemical products.',
    keywords: item.metaKeyword !== undefined && item.metaKeyword !== '' ? item.metaKeyword : 'RND Technosoft, home',
    ogImage: item.photo ? `/uploads/${item.photo}` : defaultImage
  };
  console.log('Generated static meta info:', metaInfo);
  return metaInfo;
};

const generateMetaTags = async (req, res, next) => {
 

  // Skip for API routes, static assets, or service worker
  if (
    req.path.startsWith('/api/') ||
    req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map|webmanifest)$/) ||
    req.path === '/registerSW.js'
  ) {
    return next();
  }

  const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('index.html not found at:', indexPath);
    return next();
  }

  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const $ = cheerio.load(indexHtml);

  let metaInfo = {
    title: 'RND Technosoft - Home',
    description: 'Welcome to RND Technosoft, your trusted source for high-quality chemical products.',
    keywords: 'RND Technosoft, home',
    ogImage: '/path/to/default-image.jpg'
  };

  const currentPath = req.path.replace(/^\/|\/$/g, '');
  console.log('Processed currentPath:', currentPath);

  const metaDatasets = await fetchAllMetaData();

  // Check if the current path is a blog post
  if (currentPath.startsWith('blog/')) {
    const blogSlug = currentPath.replace('blog/', '');
    const blogData = await fetchBlogBySlug(blogSlug);
    if (blogData) {
      metaInfo = {
        title: blogData.metatitle || metaInfo.title,
        description: blogData.metadescription || metaInfo.description,
        keywords: blogData.metakeywords || metaInfo.keywords,
        ogImage: blogData.photo?.[0] ? `/uploads/${blogData.photo[0]}` : metaInfo.ogImage
      };
    } else {
      metaInfo = {
        title: 'Blog Not Found - RND Technosoft',
        description: 'The blog post you are looking for could not be found.',
        keywords: 'blog, not found, RND Technosoft',
        ogImage: metaInfo.ogImage
      };
    }
  } else {
    // Check for matches in categories, subcategories, and sub-subcategories
    const categories = [
      { name: 'services', data: metaDatasets.services },
      { name: 'packages', data: metaDatasets.packages },
      { name: 'industries', data: metaDatasets.industries },
      { name: 'portfolios', data: metaDatasets.portfolios }
    ];

    let matched = false;

    for (const category of categories) {
      let matchedItem = category.data.find(item => item.slug === currentPath);
      if (matchedItem) {
        metaInfo = generateMetaInfo(matchedItem, category.name, metaInfo.ogImage);
        matched = true;
        break;
      }

      let matchedSubcategory = null;
      for (const item of category.data) {
        if (Array.isArray(item.subCategories) && item.subCategories.length > 0) {
          matchedSubcategory = item.subCategories.find(sub => sub.slug === currentPath);
          if (matchedSubcategory) {
            metaInfo = generateMetaInfo(matchedSubcategory, category.name, metaInfo.ogImage);
            matched = true;
            break;
          }
        }
      }
      if (matched) break;

      let matchedSubSubcategory = null;
      for (const item of category.data) {
        if (item.subCategories) {
          for (const subcategory of item.subCategories) {
            if (Array.isArray(subcategory.subSubCategory) && subcategory.subSubCategory.length > 0) {
              matchedSubSubcategory = subcategory.subSubCategory.find(subSub => subSub.slug === currentPath);
              if (matchedSubSubcategory) {
                metaInfo = generateMetaInfo(matchedSubSubcategory, category.name, metaInfo.ogImage);
                matched = true;
                break;
              }
            }
          }
          if (matchedSubSubcategory) break;
        }
      }
      if (matched) break;
    }

    // If no category match, try fetching static page metadata
    if (!matched) {
      const staticMeta = await fetchStaticMeta(currentPath);
      if (staticMeta) {
        metaInfo = generateStaticMetaInfo(staticMeta, metaInfo.ogImage);
      } else {
        console.log('No static meta found, using default meta info');
      }
    }
  }

  $('title').text(metaInfo.title);
  const setOrCreateMeta = (selector, attrName, value, type = 'name') => {
    if (!value) return;
    let metaTag = $(`meta[${type}="${selector}"]`);
    if (metaTag.length) {
      metaTag.attr(attrName, value);
    } else {
      $('head').append(`<meta ${type}="${selector}" ${attrName}="${value}">`);
    }
  };

  setOrCreateMeta('description', 'content', metaInfo.description);
  setOrCreateMeta('keywords', 'content', metaInfo.keywords);
  setOrCreateMeta('og:title', 'content', metaInfo.title, 'property');
  setOrCreateMeta('og:description', 'content', metaInfo.description, 'property');
  if (metaInfo.ogImage) {
    setOrCreateMeta('og:image', 'content', metaInfo.ogImage, 'property');
  }
  setOrCreateMeta('twitter:card', 'content', 'summary_large_image');
  setOrCreateMeta('twitter:title', 'content', metaInfo.title);
  setOrCreateMeta('twitter:description', 'content', metaInfo.description);

  const canonicalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl.split('?')[0]}`;
  let canonicalLink = $('link[rel="canonical"]');
  if (canonicalLink.length) {
    canonicalLink.attr('href', canonicalUrl);
  } else {
    $('head').append(`<link rel="canonical" href="${canonicalUrl}">`);
  }

  res.set({
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
    'Surrogate-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-Accel-Expires': '0',
    'Vary': '*'
  });

  const finalHtml = $.html();
  return res.send(finalHtml);
};

module.exports = generateMetaTags;