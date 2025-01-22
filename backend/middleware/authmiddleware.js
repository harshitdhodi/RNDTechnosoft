const jwt=require("jsonwebtoken");

const requireAuth = async (req,res,next)=>{
    
    try{
        const token = req.cookies.jwt;
       
            if(!token){
                console.log("can't redirect to another page:anauthorized user")
                throw new Error("Unauthenticated user");
            }
            const decodeToken = await jwt.verify(token,"secret");
            req.newAdmin = decodeToken.id;
            next();
}
    catch(err){
        console.log(err)
        console.log("cant redirect to another page : invalid user");
        res.sendStatus(403);
    }
};

const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.newAdmin; // Access admin ID from req object set by middleware
    const { email, firstname, lastname } = req.body;
    let photo;

    if (req.file) {
      photo = req.file.filename;

      // Optionally, you may want to delete the old photo from the server if a new one is uploaded
      const admin = await Admin.findById(adminId);
      if (admin.photo) {
        const oldPhotoPath = path.join(__dirname, '../logos', admin.photo);
        if (fs.existsSync(oldPhotoPath)) {
          fs.unlinkSync(oldPhotoPath);
        }
      }
    }

    const updatedData = { email, firstname, lastname };
    if (photo) {
      updatedData.photo = photo;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updatedData, { new: true });

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }

    return res.status(200).json({ success: true, message: 'Profile updated successfully', admin: updatedAdmin });
  } catch (error) {
    console.error('Error updating admin profile:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};



module.exports={requireAuth};