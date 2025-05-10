// utils/generateMetaTags.js
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = "http://localhost:3021/";
const API_ENDPOINTS = {
  Service_Category: `${BASE_URL}api/services/getall`,
  Package_Category: `${BASE_URL}api/packages/getAll`,
  Industrial_Category: `${BASE_URL}api/industries/getAll`,
  Blog: `${BASE_URL}api/news/getAllNews`,
  Portfolio_Category: `${BASE_URL}api/portfolio/getAll`
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
 console.log("services",services.data)
    return {
      services: services.data || [],
      packages: packages.data?.data || [],
      industries: industries.data?.data || [],
      blogs: blogs.data?.data || [],
      portfolios: portfolios.data?.data || [],
    };
   
  } catch (err) {
    console.error('Error fetching meta data:', err.message);
    return { services: [], packages: [], industries: [], blogs: [], portfolios: [] };
  }
};

const matchMetaBySlug = (slug, datasets) => {
  for (const dataset of Object.values(datasets)) {
    const match = dataset.find(item => item.slug === slug);
    if (match) return match;
  }
  return null;
};

const generateMetaTags = async (req, res, next) => {
  if (
    req.path.startsWith('/api/') ||
    req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|map|webmanifest)$/) ||
    req.path === '/registerSW.js'
  ) return next();

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
    keywords: ' RND Technosoft, home',
    ogImage: '/path/to/default-image.jpg'
  };

  const currentPath = req.path.replace(/^\/|\/$/g, '');
  const metaDatasets = await fetchAllMetaData();
  const matchedMeta = matchMetaBySlug(currentPath, metaDatasets);

  if (matchedMeta) {
    metaInfo = {
      ...metaInfo,
      title: matchedMeta.metatitle || metaInfo.title,
      description: matchedMeta.metadescription || metaInfo.description,
      keywords: matchedMeta.metakeywords || metaInfo.keywords,
      ogImage: matchedMeta.photo?.[0] ? `/uploads/${matchedMeta.photo[0]}` : metaInfo.ogImage,
    };
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

  return res.send($.html());
};

module.exports = generateMetaTags;
