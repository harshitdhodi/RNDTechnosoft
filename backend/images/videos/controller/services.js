const Service = require("../model/service");
const ServiceCategory = require("../model/serviceCategory");
const ExcelJS = require('exceljs');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const ImportedFile = require("../model/importedFiles");

const insertService = async (req, res) => {
  try {
    const { title, details,alt,slug, metatitle, metadescription, metakeywords, metacanonical, metalanguage, metaschema, otherMeta,categories, subcategories, subSubcategories, url, priority, changeFreq, status} = req.body;
    const photo = req.files['photo'] ? req.files['photo'].map(file => file.filename) : [];
    const service = new Service({
      title,
      details,
      photo,
      alt,
      slug,
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
    await service.save();
    res.status(201).json({ message: 'Service inserted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting service' });
  }
};

const updateService = async (req, res) => {
  const { slugs } = req.query;
  const updateFields = req.body;

  try {
    // Fetch the existing service to get its current photos and alt texts
    const existingService = await Service.findOne({slug:slugs});

    if (!existingService) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Process new uploaded photos and their alt texts
    if (req.files && req.files['photo'] && req.files['photo'].length > 0) {
      const newPhotoPaths = req.files['photo'].map(file => file.filename); // Using filename to get the stored file names
      updateFields.photo = [...existingService.photo, ...newPhotoPaths];
  
    } else {
      updateFields.photo = existingService.photo; // Keep existing photos if no new photos are uploaded
    }

    const updatedService = await Service.findOneAndUpdate(
      { slug: slugs },
      updateFields,
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedService);
  } catch (error) {
    consol.log(error)
    res.status(500).json({ message: 'Server error', error });
  }
};


const deleteService = async (req, res) => {
  const {slugs} = req.query;

  try {
    const service = await Service.findOne({slug:slugs}); 
    
    service.photo.forEach(filename => {
      const filePath = path.join(__dirname, '../images', filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete file synchronously if it exists
      } else {
        console.warn(`File not found: ${filename}`);
      }
    });

    const deletedService = await Service.findOneAndDelete({slug:slugs});

    if (!deletedService) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const deletePhotoAndAltText = async (req, res) => {

  const { slugs, imageFilename, index } = req.params;


  try {
    // Find the service by ID
    const service = await Service.findOne({slug:slugs});

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Remove the photo and its alt text
    service.photo = service.photo.filter(photo => photo !== imageFilename);
    service.alt.splice(index, 1);

    await service.save();

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

const getAllServices = async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const limit = 5; // Number of records per page

    // Get total count of services
    const count = await Service.countDocuments();

    // Fetch services with pagination
    const services = await Service.find()
      .skip((page - 1) * limit) // Skip records for previous pages
      .limit(limit);

    // Map over each service to find and append the category name
    const servicesWithCategoryName = await Promise.all(services.map(async (service) => {
      // Find the category based on the service's categoryId
      const category = await ServiceCategory.findOne({ '_id': service.categories });

      // Extract the category name
      const categoryName = category ? category.category : 'Uncategorized';

      // Append the category name to the service object
      return {
        ...service.toJSON(),
        categoryName
      };
    }));

    // Send the services with category names and pagination details in the response
    res.status(200).json({
      data: servicesWithCategoryName,
      total: count,
      currentPage: page,
      hasNextPage: count > page * limit
    });
  } catch (error) {
    console.error("Error retrieving services:", error);
    let errorMessage = 'Server error';
    if (error.name === 'CastError') {
      errorMessage = 'Invalid query parameter format';
    }
    res.status(500).json({ message: errorMessage, error });
  }
};


const getSingleService = async (req, res) => {
  const { slugs } = req.query;

  try {
    const service = await Service.findOne({slug:slugs});

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getCategoryServices = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const services = await Service.find({ categories: categoryId });

    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found for this category' });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubcategoryServices = async (req, res) => {
  const { subcategoryId } = req.query;

  try {
    const services = await Service.find({ subcategories: subcategoryId });

    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found for this subcategory' });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const getSubSubcategoryServices = async (req, res) => {
  const { subSubcategoryId } = req.query;

  try {
    const services = await Service.find({ subSubcategories: subSubcategoryId });

    if (services.length === 0) {
      return res.status(404).json({ message: 'No services found for this sub-subcategory' });
    }

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const countServices = async (req, res) => {
  try {
    const count = await Service.countDocuments();
    res.status(200).json({ total: count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error counting services' });
  }
};

const exportServicesToExcel = async (req, res) => {
  try {
    const services = await Service.find(); // Fetch all services

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Services');

    // Add headers
    worksheet.addRow(['ID', 'Title', 'Details', 'Photo','Alt','Icons', 'Status', 'Categories', 'Subcategories', 'Subsubcategories','Created At','Updated At']);

    // Add data rows
    services.forEach(service => {
      worksheet.addRow([
        service._id.toString(),
        service.title,
        service.details,
        service.photo.join(', '),
        service.alt.join(', '),
        service.icons,
        service.status,
        service.categories.join(', '), // Convert array to comma-separated string
        service.subcategories.join(', '), // Convert array to comma-separated string
        service.subSubcategories.join(', '), // Convert array to comma-separated string
        service.createdAt.toISOString(),
        service.updatedAt.toISOString(),
      ]);
    });

    // Generate a unique filename
    const filename = `services_${Date.now()}.xlsx`;

    // Set headers to trigger file download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    // Write the Excel file to the response stream
    await workbook.xlsx.write(res);

    res.status(200).end();
  } catch (error) {
    console.error('Error exporting services:', error);
    res.status(500).json({ message: 'Failed to export services' });
  }
};


const importServices = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File not provided' });
    }

    const fileName = req.fileName;
  

    const importedFile = new ImportedFile({ fileName });
    await importedFile.save();
    const filePath = path.join(__dirname, '../files', fileName);
    const fileContents = fs.readFileSync(filePath);

    const workbook = XLSX.read(fileContents, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const services = jsonData.map(item => ({
      title: item.Title,
      photo: item.Photo ? item.Photo.split(',').map(photo => photo.trim()) : [],
      alt: item.Alt ? item.Alt.split(',').map(alt => alt.trim()) : [],
      icons: item.Icon,
      details: item.Details,
      status: item.Status,
      categories: item.Categories,
      subcategories: item.Subcategories,
      subSubcategories: item.SubSubcategories
    }));

    await Service.insertMany(services);

    res.status(200).json({ message: 'Data imported successfully' });
  } catch (error) {
    console.error('Error importing data:', error);
    res.status(500).json({ message: 'Failed to import data' });
  }
};


const fetchUrlPriorityFreq = async (req, res) => {
  try {
    // Get serviceId from request parameters
    const service = await Service.find({}).select('_id url priority changeFreq lastmod');
    if (!service) {
      return res.status(404).json({ error: "service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const fetchUrlmeta = async (req, res) => {
  try {
    // Get serviceId from request parameters
    const service = await Service.find({}).select('_id url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');
    if (!service) {
      return res.status(404).json({ error: "service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}


const editUrlPriorityFreq = async (req, res) => {
  try {
    const { id } = req.query; // Get serviceId from request parameters
    const { url, priority, changeFreq } = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { url, priority, changeFreq, lastmod: Date.now() },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ error: "service not found" });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const editUrlmeta = async (req, res) => {
  try {
    const { id } = req.query; // Get productId from request parameters
    const { url,metatitle,metadescription,metakeywords,metacanonical,metalanguage,metaschema,otherMeta} = req.body;

    const updatedService = await Service.findByIdAndUpdate(
      id,
      { url,metatitle,metadescription,metakeywords,metacanonical,metalanguage,metaschema,otherMeta },
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

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

const fetchUrlPriorityFreqById = async (req, res) => {
  try {
    const { id } = req.query; // Extract id from query parameters

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    // Find the service by ID and select specific fields
    const service = await Service.findById(id).select('url priority changeFreq ');

    if (!service) {
      return res.status(404).json({ error: "service not found" });
    }

    res.status(200).json(service);
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

    // Find the Service by ID and select specific fields
    const service = await Service.findById(id).select('url metatitle metadescription metakeywords metacanonical metalanguage metaschema otherMeta');

    if (!service) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { insertService, updateService, deleteService, getAllServices, getSingleService, getCategoryServices, getSubcategoryServices, getSubSubcategoryServices, countServices, deletePhotoAndAltText, exportServicesToExcel, importServices,fetchUrlPriorityFreq, editUrlPriorityFreq, fetchUrlPriorityFreqById,fetchUrlmeta, editUrlmeta, fetchUrlmetaById};
