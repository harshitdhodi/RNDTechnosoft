const Product = require("../model/product")
const productCategory = require("../model/productCategory")
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path')
const ImportedFile = require("../model/importedFiles")


const insertProduct = async (req, res) => {
  try {
    const { title, price, alt,imgtitle, slug, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta, benefits, categories, subcategories, subSubcategories, url, priority, changeFreq, status } = req.body;
    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const catalogue = req.files['catalogue'] ? req.files['catalogue'][0].filename : '';

    const product = new Product({
      title,
      price,
      alt,
      imgtitle,
      slug,
      benefits,
      catalogue,
      metatitle,
      metadescription,
      metakeywords,
      metacanonical,
      metalanguage,
      metaschema,
      otherMeta,
      photo,
      url,
      changeFreq,
      priority,
      status,
      categories,
      subcategories,
      subSubcategories
    });
    await product.save();
    res.status(201).json({ message: 'Product inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting product' });
  }
}


const updateProduct = async (req, res) => {
  const { slugs } = req.query;
  const updateFields = req.body;

  try {
    // Fetch the existing product to get its current photos and catalogue
    const existingProduct = await Product.findOne({slug:slugs});

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Process new uploaded photos
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingProduct.photo, ...newPhotoPaths];
    } else {
      updateFields.photo = existingProduct.photo; // Keep existing photos if no new photos are uploaded
    }

    // Process new uploaded catalogue
    if (req.files && req.files['catalogue'] && req.files['catalogue'].length > 0) {
      updateFields.catalogue = req.files['catalogue'][0].filename;
    } else {
      updateFields.catalogue = existingProduct.catalogue; // Keep existing catalogue if no new catalogue is uploaded
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug: slugs },
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

const deleteProduct = async (req, res) => {
  const { slugs } = req.query;

  try {
    const product = await Product.findOne({slug:slugs});

    product.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    const deletedProduct = await Product.findOneAndDelete({slug:slugs});
  

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
};

const deletePhotoAndAltText = async (req, res) => {

  const { slugs, imageFilename, index } = req.params;
  try {
    // Find the service by ID
    const product = await Product.findOne({slug:slugs});

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the photo and its alt text
    product.photo = product.photo.filter(photo => photo !== imageFilename);
    product.alt.splice(index, 1);
    product.imgtitle.splice(index, 1);

    await product.save();

    const filePath = path.join(__dirname, '..', 'images', imageFilename);

        // Check if the file exists and delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }

    res.json({ message: 'Photo and alt text deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo and alt text:', error);
    res.status(500).json({ message: error.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5;
    const count = await Product.countDocuments();
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit);


    const productsWithCategoryName = await Promise.all(products.map(async (product) => {
      const category = await productCategory.findOne({ '_id': product.categories });
      const categoryName = category ? category.category : 'Uncategorized';
      return {
        ...product.toJSON(),
        categoryName
      };
    }));
    res.status(200).json({
      data: productsWithCategoryName,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving products:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};
const getSingleProduct = async (req, res) => {
  const { slugs } = req.query;

  try {
    const product = await Product.findOne({slug:slugs});

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


const getCategoryProducts = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const products = await Product.find({ categories: categoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this category' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubcategoryProducts = async (req, res) => {
  const { subcategoryId } = req.query;

  try {
    const products = await Product.find({ subcategories: subcategoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this subcategory' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubSubcategoryProducts = async (req, res) => {
  const { subSubcategoryId } = req.query;

  try {
    const products = await Product.find({ subSubcategories: subSubcategoryId });

    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found for this sub-subcategory' });
    }

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const countProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting services' });
  }
};

const exportProductsToExcel = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Products');

    // Add headers
    worksheet.addRow(['ID', 'Title', 'Price', 'Photo','Imgtitle', 'Alt', 'Status', 'Categories', 'Subcategories', 'Subsubcategories']);

    // Add data rows
    products.forEach(product => {
      worksheet.addRow([
        product._id.toString(),
        product.title,
        product.price,
        product.photo.join(', '),
        product.alt.join(', '),
        product.imgtitle.join(', '),
        product.status,
        product.categories.join(', '), // Convert array to comma-separated string
        product.subcategories.join(', '), // Convert array to comma-separated string
        product.subSubcategories.join(', ') // Convert array to comma-separated string
      ]);
    });

    // Generate a unique filename
    const filename = `products_${Date.now()}.xlsx`;

    // Set headers to trigger file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Write the Excel file to the response stream
    await workbook.xlsx.write(res);

    res.status(200).end();
  } catch (error) {
    console.error('Error exporting products:', error);
    res.status(500).json({ message: 'Failed to export products' });
  }
};

const importProducts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File not provided' });
    }

    const fileName = req.fileName;


    const importedFile = new ImportedFile({ fileName });
    await importedFile.save();
    const filePath = path.join(__dirname, '../files', fileName); // Use file.originalname to get the original filename
    const fileContents = fs.readFileSync(filePath);

    const workbook = XLSX.read(fileContents, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const products = jsonData.map(item => ({
      title: item.Title,
      photo: item.Photo ? item.Photo.split(',').map(photo => photo.trim()) : [],
      alt: item.Alt ? item.Alt.split(',').map(alt => alt.trim()) : [],
      imgtitle: item.Imgtitle ? item.Imgtitle.split(',').map(imgtitle => imgtitle.trim()) : [],

      price: item.Price,
      status: item.Status,
      categories: item.Categories,
      subcategories: item.Subcategories,
      subSubcategories: item.SubSubcategories
    }));

    await Product.insertMany(products);

    res.status(200).json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Failed to import data' });
  }
};

const fetchUrlPriorityFreq = async (req, res) => {
  try {
    // Get productId from request parameters
    const product = await Product.find({}).select('_id url priority changeFreq lastmod');
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchUrlmeta = async (req, res) => {
  try {
    // Get productId from request parameters
    const product = await Product.find({}).select('_id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

const editUrlPriorityFreq = async (req, res) => {
  try {
    const { id } = req.query; // Get productId from request parameters
    const { url, priority, changeFreq } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { url, priority, changeFreq, lastmod: Date.now() },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


const editUrlmeta = async (req, res) => {
  try {
    const { id } = req.query; // Get productId from request parameters
    const { url,metatitle,metadescription,metakeywords,metacanonical,metalanguage,metaschema,otherMeta} = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { url,metatitle,metadescription,metakeywords,metacanonical,metalanguage,metaschema,otherMeta },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
// const deleteUrlPriorityFreq = async (req, res) => {
//   try {
//     const { id } = req.query; // Get productId from request parameters

//     const updatedProduct = await Product.findByIdAndUpdate(
//       id,
//       { $unset: { url: "", priority: "", changeFreq: "" } },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     res.status(200).json({ message: "Url, priority, and freq deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Server error" });
//   }
// };

const fetchUrlPriorityFreqById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the product by ID and select specific fields
    const product = await Product.findById(id).select('url priority changeFreq');

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchUrlmetaById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the product by ID and select specific fields
    const product = await Product.findById(id).select('url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

downloadCatalogue = (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '../catalogues', filename);

  res.download(filePath, (err) => {
      if (err) {
          console.error(err);
          res.status(500).json({ message: 'File download failed' });
      }
  });
};

viewCatalogue = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '..', 'catalogues', filename);
  res.sendFile(filePath);
};


const getAllProductsFront = async (req, res) => {
  try {
    // Fetch all product categories
    const categories = await productCategory.find();
   
    if (!categories.length) {
      return res.status(404).json({ message: 'No product categories found' });
    }

    // Initialize an object to hold the final structure
    const result = {};

    // Process each category
    for (const category of categories) {
      const categoryName = category.category;
      result[categoryName] = {};

      if (category.subCategories && category.subCategories.length > 0) {
        // Category has subcategories
        for (const subCategory of category.subCategories) {
          const subCategoryName = subCategory.category;
          console.log(subCategoryName)
          const products = await Product.find({ subcategories: subCategory._id });
          
          if (products.length > 0) {
            result[categoryName][subCategoryName] = products;
          }
        }
      } else {
        // Category doesn't have subcategories
        const products = await Product.find({ category: category._id });
        
        if (products.length > 0) {
          result[categoryName] = products;
        }
      }
    }

    // Count total products
    const totalProducts = Object.values(result).reduce((total, cat) => {
      if (Array.isArray(cat)) {
        return total + cat.length;
      } else {
        return total + Object.values(cat).reduce((subTotal, subCat) => subTotal + subCat.length, 0);
      }
    }, 0);

    res.status(200).json({
      data: result,
      total: totalProducts,
    });

  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


module.exports = {getAllProductsFront,downloadCatalogue,viewCatalogue, insertProduct, updateProduct, deleteProduct, getAllProducts, getSingleProduct, getCategoryProducts, getSubcategoryProducts, getSubSubcategoryProducts, countProducts, deletePhotoAndAltText, exportProductsToExcel, importProducts, fetchUrlPriorityFreq, editUrlPriorityFreq, fetchUrlPriorityFreqById,fetchUrlmeta, editUrlmeta, fetchUrlmetaById } 
