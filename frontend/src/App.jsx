import React from "react";
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
useLocation 
} from "react-router-dom";

// backend 
import Sidebar from './adminComponent/Sidebar';
import ServicesBack from './adminComponent/Pages/Services';
import CreateService from "./adminComponent/Pages/CreateService";
import EditService from './adminComponent/Pages/EditService';
import ServiceCategory from "./adminComponent/Pages/Servicecategory"
import CreateServiceCategory from "./adminComponent/Pages/CreateServiceCategory"
import EditServiceCategory from "./adminComponent/Pages/EditServiceCategory"

import PackageCategory from "./adminComponent/Pages/PackageCategory"
import CreatePackageCategory from "./adminComponent/Pages/CreatePackageCategory"
import EditPackageCategory from "./adminComponent/Pages/EditPackageCategory"


import IndustriesCategory from "./adminComponent/Pages/IndustriesCategory"
import CreateIndustriesCategory from "./adminComponent/Pages/CreateIndustriesCategory"
import EditIndustriesCategory from "./adminComponent/Pages/EditIndustrieesCategory"

import Industries from "./adminComponent/Pages/Industries"

import PortfolioCategory from "./adminComponent/Pages/PortfolioCategory"
import CreatePortfolioCategory from "./adminComponent/Pages/CreatePortfolioCategory"
import EditPortfolioCategory from "./adminComponent/Pages/EditPortfolioCategory"

import Portfolio from "./adminComponent/Pages/Portfolio";
import CreatePortfolio from "./adminComponent/Pages/CreatePortfolio";
import EditPortfolio from './adminComponent/Pages/EditPortfolio';


import News from "./adminComponent/Pages/News";
import CreateNews from "./adminComponent/Pages/CreateNews";
import EditNews from './adminComponent/Pages/EditNews';
import NewsCategory from "./adminComponent/Pages/NewsCategory"
import CreateNewsCategory from "./adminComponent/Pages/CreateNewsCategory"
import EditNewsCategory from "./adminComponent/Pages/EditNewsCategory"
import Testimonials from './adminComponent/Pages/Testimonials';
import CreateTestimonials from './adminComponent/Pages/CreateTestimonials';
import CreateTestimonialsSub from './adminComponent/Pages/CreateTestimonialSub'
import CreateTestimonialsSubSub from './adminComponent/Pages/CreateTestimonialSubSub'



import EditTestimonials from './adminComponent/Pages/EditTestimonials';
import FAQ from "./adminComponent/Pages/FAQ";
import CreateFAQ from "./adminComponent/Pages/CreateFAQ";
import EditFAQ from './adminComponent/Pages/EditFAQ';
import OurStaff from "./adminComponent/Pages/Staff";
import CreateStaff from "./adminComponent/Pages/CreateStaff";
import EditStaff from './adminComponent/Pages/EditStaff';
import Banner from "./adminComponent/Pages/Banner";
import CreateBanner from "./adminComponent/Pages/CreateBanner";
import EditBanner from "./adminComponent/Pages/EditBanner";
import ProductCategory from "./adminComponent/Pages/ProductCategory";
import CreateProductCategory from "./adminComponent/Pages/CreateCategory";
import EditCategory from "./adminComponent/Pages/EditCategory";
import PageContent from "./adminComponent/Pages/PageContent";
import CreatePageContent from "./adminComponent/Pages/CreatePageContent";
import Product from "./adminComponent/Pages/Product";
import CreateProduct from "./adminComponent/Pages/CreateProduct";
import EditProduct from "./adminComponent/Pages/EditProduct";

import Dashboard from "./adminComponent/Pages/Dashboard";
import Signup from "./adminComponent/Adminsignup"
import Login from "./adminComponent/Adminlogin";
import VerifyOTP from "./adminComponent/VerifyOTP";
import ResetPassword from "./adminComponent/ResetPassword";
import EditPageContent from './adminComponent/Pages/EditPageContent';
import ForgetPassword from './adminComponent/ForgotPassword';
import DatabaseManagement from './adminComponent/Pages/DatabaseManagement';
import ManagePassword from "./adminComponent/Pages/ManagePassword";
import Logo from "./adminComponent/Pages/Logo";
import Cookies from "js-cookie";
import CreateAboutUsPoints from './adminComponent/Pages/CreateAboutuspoints';
import EditAboutUsPoints from './adminComponent/Pages/EditAboutuspoints';
import Achievements from "./adminComponent/Pages/Achievements"
import CreateAchievements from "./adminComponent/Pages/CreateAchievements"
import EditAchievement from './adminComponent/Pages/EditAchievements';
import Counter from "./adminComponent/Pages/Counter"
import EditCounter from "./adminComponent/Pages/EditCounter"
import CreateCounter from "./adminComponent/Pages/CreateCounter"

import Inquiry from "./adminComponent/Pages/Inquiry"
import Mission from "./adminComponent/Pages/Mission"
import Vision from "./adminComponent/Pages/Vision"
import Corevalue from "./adminComponent/Pages/Corevalue"
import CreateCorevalue from "./adminComponent/Pages/CreateCorevalue"
import EditCorevalue from "./adminComponent/Pages/EditCorevalue"
import Aboutcompany from './adminComponent/Pages/Aboutcompany';
import Careeroption from "./adminComponent/Pages/Careeroptions"
import CreateCareeroption from "./adminComponent/Pages/CreateCareeroption"
import EditCareeroption from "./adminComponent/Pages/EditCareeroption"
import Careerinquiry from "./adminComponent/Pages/Careerinquiry"
import Footer from "./adminComponent/Pages/Footer"
import Header from "./adminComponent/Pages/Header"
import Globalpresence from "./adminComponent/Pages/GlobalPresence"
import WhatsappSettings from "./adminComponent/Pages/WhatsappSettings"
import GoogleSettings from "./adminComponent/Pages/GoogleSettings"
import Menulisting from "./adminComponent/Pages/Menulisting"
import CreateMenulisting from "./adminComponent/Pages/CreateMenulisting"
import EditMenulisting from "./adminComponent/Pages/EditMenulisting"

import Sitemap from "./adminComponent/Pages/Sitemap"
import CreateSitemap from "./adminComponent/Pages/CreateSitemap"
import EditSitemap from "./adminComponent/Pages/EditSitemap"
import Metadetails from "./adminComponent/Pages/Metadetails"
import EditMetadetails from "./adminComponent/Pages/EditMetadetails"
import ManageProfile from "./adminComponent/Pages/ManageProfile"
import MissionAndVision from './adminComponent/Pages/MissionAndVision';
import Benefits from "./adminComponent/Pages/Benefits"
import CreateBenefits from "./adminComponent/Pages/CreateBenefits"
import EditBenefits from "./adminComponent/Pages/EditBenefits"
import ManageColor from "./adminComponent/Pages/ManageColor"
import CreateServiceDetails from "./adminComponent/Pages/CreateServiceDetails"
import EditServiceDetails from "./adminComponent/Pages/EditServicePage";
import CreateServiceImage from "./adminComponent/Pages/CreateServiceImage"
import EditServiceImages from "./adminComponent/Pages/EditServiceImages"

import Navbar from "./components/NavBar";
import Homepage from "./pages/Homepage";
import MainPage from "./pages/Mainpage";
import HowItWorks from "./pages/HowItWorks";
import Pricing from "./pages/Pricing";
import Projects from "./pages/Projects";
import Templates from "./pages/Templates";
import WhatWeDo from "./pages/WhatWeDo";
import Website from "./pages/Website";
import AllReviews from "./components/WhatWeDo/AllReviews"
import ErrorBoundary from "./components/ErrorBound";
import HomeHerosection from "./adminComponent/Pages/HomeHerosection";
import Design from "./pages/Design"
import DynamicPage from "./pages/DynamicPages";
import SubSubBlogs from "./pages/Blogs/SubSubBlog";



import CreatePackage from "./adminComponent/Pages/CreatePackage"
import EditPackageForm from "./adminComponent/Pages/EditPackage";

import CreatePackageDescription from "./adminComponent/Pages/CreatePackageDescription"
import EditPackageDescription from "./adminComponent/Pages/EditPackageDescription"
import PackageDescription from "./adminComponent/Pages/PackageDescription";

import DesignProcessForm from "./adminComponent/Pages/CreateDesignProcess"

import EditDesignProcess from "./adminComponent/Pages/EditDesignProcess"

import EditWebSolutionDetails from "./adminComponent/Pages/WebSolution"
import SocialMedia from "./pages/SocialMedia";
import EditServicePage from "./adminComponent/Pages/EditEachCategory";
import AboutUs from "./pages/AboutUs";
import Collabration from "./pages/Collabration";
import GetInTouch from "./pages/Contact";
import Faq from "./pages/Faq";
import NewSubmenuListingForm from "./adminComponent/Pages/CreateSubMenu";
import EditSubmenuForm from "./adminComponent/Pages/EditSubMenu";
import PrivacyPolicy from "./components/CookiePolice";
import PrivacyPolicysss from "./components/PravicyPolice";
import TermsCondition from "./components/TermsCondition";
import WebsiteManagement from "./pages/WebsiteManagement";
import DynamicMetaTags from "./components/DynamicMetaTag";
import BlogSubSub from "./pages/Blogs/SubSubBlog";
import EditSubServicePage from "./adminComponent/Pages/EditEachSubcategory"
import EditSubSubServicePage from "./adminComponent/Pages/EditEachsubsubcategory"
import NewSubServiceForm from "./adminComponent/Pages/CreateSubServiceDetail";
import EditSubServiceDetails from "./adminComponent/Pages/EditSubServicePage";
import NewSubSubServiceForm from "./adminComponent/Pages/CreateSubSubServiceDetails";
import EditSubSubServiceDetails from "./adminComponent/Pages/EditSubSubServicePage";
import NewSubGalleryForm from "./adminComponent/Pages/CreateSubServiveImage";
import NewSubSubGalleryForm from "./adminComponent/Pages/CreateSubSubServiceImage";
import DesignSubProcessForm from "./adminComponent/Pages/CreateSubDesignProcess";
import DesignSubSubProcessForm from "./adminComponent/Pages/CreateSubSubDesignProcess";
import Packages from "./adminComponent/Pages/Package";
import EditIndustiresPage from "./adminComponent/Pages/EditEachIndustriesCategory";
import EditIndustiresSubPage from "./adminComponent/Pages/EditEachIndustriesSubCategory";
import EditIndustiresSubsubPage from "./adminComponent/Pages/EditEachIndustriesSubsubcategory";

import NewIndustriesForm from "./adminComponent/Pages/industriescomponent/main/CreateDetails";
import EditIndustriesForm from "./adminComponent/Pages/industriescomponent/main/EditDetails";

import NewIndustriesSubForm from "./adminComponent/Pages/industriescomponent/sub/CreateDetails";
import EditIndustriesSubForm from "./adminComponent/Pages/industriescomponent/sub/EditDetails";

import Homeanimation from "./adminComponent/Pages/Homeanimation/Homeanimation"
import EditHomeanimation from "./adminComponent/Pages/Homeanimation/EditHomeanimation"
import CreateHomeanimation from "./adminComponent/Pages/Homeanimation/CreateHomeanimation"


import NewIndustriesSubSubForm from "./adminComponent/Pages/industriescomponent/subsub/CreateDetails";
import EditIndustriesSubSubForm from "./adminComponent/Pages/industriescomponent/subsub/EditDetails";
import ContactUs from "./pages/ContactUs";
import ContactInfoData from './adminComponent/Pages/contactInfo/ContactInfo';
import CreateContactInfo from "./adminComponent/Pages/contactInfo/AddContactInfo";
import EditContactInfo from "./adminComponent/Pages/contactInfo/EditContactinfo";
import ContactInquiry from "./adminComponent/Pages/contactInfo/Contactinquiries";
import ManageSectionVisibility from "./adminComponent/Pages/ManageSectionVisibility";
import Newsletter from "./adminComponent/Pages/Newsletter"
import AddCard from "./adminComponent/Pages/Cards/AddCards"
import ShowCard from "./adminComponent/Pages/Cards/showCards"
import UpdateCard from "./adminComponent/Pages/Cards/UpdateCards";

import PopupInquiry from "./adminComponent/Pages/PopupInquiry"
import HerosectionInquiry from "./adminComponent/Pages/HerosectionInquiry"

import Thankyou from "./components/Thankyou"

import Career from "./pages/Career"
import Popup from "./components/Popup"
import Portfolios from "./pages/Portfolios"

import Logotype from "./adminComponent/Pages/Logotype"
import CreateLogoType from "./adminComponent/Pages/CreateLogotype"
import EditLogotype from "./adminComponent/Pages/EditLogotype";

import CreateIndustryImage from "./adminComponent/Pages/CreateIndustryImage"
import CreateSubIndustryImage from "./adminComponent/Pages/CreateSubIndustryImage"
import CreateSubSubIndustryImage from "./adminComponent/Pages/CreateSubSubIndustryImage"
import EditIndustryImage from "./adminComponent/Pages/EditIndustryImage"
import Loader from "../src/assets/loader.mp4"


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Adjust the time as needed

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  useEffect(() => {
    const token = Cookies.get('jwt');
    console.log(token)
    if (token) {
      setIsLoggedIn(true);
    } else {
      console.log("User is not logged in");
    }
  }, []);

  const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const token = Cookies.get("jwt");

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} />;
    }

    return children;
};
  return (

    <BrowserRouter>
      <DynamicMetaTags />
      {isLoading ? (
        // Show loading video while loading
        <>

<div className="flex justify-center items-center h-screen w-full bg-white">
        {/* <div className="loader border-t-4 border-blue-500 rounded-full w-16 h-16 animate-spin"></div> */}
      </div>
        </>
      ) : (
        <>
          {/* {!isLoggedIn && <Popup />} */}
          <Routes>
            <Route path="/" element={<MainPage />}>
                  <Route path="/" index element={
                    <>
                      <Popup />
                      <Homepage />
                    </>
                  }
                  />
                  <Route path="/:slug" element={<DynamicPage />} />
                  <Route path="/blog/:slug" element={<BlogSubSub />} />
                  <Route path="/all-reviews" element={<AllReviews />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/aboutus" element={<AboutUs />} />
                  <Route path="/collabration" element={<Collabration />} />
                  <Route path="/contact" element={<GetInTouch />} />
                  <Route path="/helpCenter" element={<Faq />} />
                  <Route path="/cookies-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-conditions" element={<TermsCondition />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicysss />} />
                  <Route path="/contact-us" element={<ContactUs />} />
                  <Route path="/career" element={<Career />} />
                  <Route path="/thankyou" element={<Thankyou />} />
                  <Route path="/portfolios" element={<Portfolios />} />
                </Route>
            {!isLoggedIn ? (
            <>
            <Route path="/login" element={<Login />} />
            <Route path="/resetpassword" element={<ResetPassword />} />
            <Route path="/verifyOTP" element={<VerifyOTP />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
        
            {/* Protected Routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </>
        
            ) : (
              <><Route path="/login" element={<Navigate to="/dashboard" />} /><Route path="/" element={<Sidebar />}>
                    <Route index element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/services" element={<ServicesBack />} />
                    <Route path="/ServiceCategory" element={<ServiceCategory />} />
                    <Route path="/ServiceCategory/CreateServiceCategory" element={<CreateServiceCategory />} />
                    <Route path="/ServiceCategory/editServiceCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditServiceCategory />} />

                    <Route path="/PackageCategory" element={<PackageCategory />} />
                    <Route path="/PackageCategory/CreatePackageCategory" element={<CreatePackageCategory />} />
                    <Route path="/PackageCategory/editPackageCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditPackageCategory />} />
                    <Route path="/package" element={<Packages />} />
                    <Route path="/package/createPackage" element={<CreatePackage />} />
                    <Route path="/package/editPackage/:packageId" element={<EditPackageForm />} />


                    <Route path="/package/createPackageDescription" element={<CreatePackageDescription />} />
                    <Route path="/package/editPackageDescription/:packageId" element={<EditPackageDescription />} />


                    <Route path="/IndustriesCategory" element={<IndustriesCategory />} />
                    <Route path="/IndustriesCategory/CreateIndustriesCategory" element={<CreateIndustriesCategory />} />
                    <Route path="/IndustriesCategory/editIndustriesCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditIndustriesCategory />} />

                    <Route path="/industries" element={<Industries />} />


                    <Route path="/PortfolioCategory" element={<PortfolioCategory />} />
                    <Route path="/PortfolioCategory/CreatePortfolioCategory" element={<CreatePortfolioCategory />} />
                    <Route path="/PortfolioCategory/editPortfolioCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditPortfolioCategory />} />


                    <Route path="/news" element={<News />} />
                    <Route path="/news/createNews" element={<CreateNews />} />
                    <Route path="/news/editNews/:slugs" element={<EditNews />} />

                    <Route path="/homeanimation" element={<Homeanimation />} />
                    <Route path="/homeanimation/createHomeanimation" element={<CreateHomeanimation />} />
                    <Route path="/homeanimation/editHomeanimation/:id" element={<EditHomeanimation />} />

                    <Route path="/portfolio" element={<Portfolio />} />
                    <Route path="/portfolio/createPortfolio" element={<CreatePortfolio />} />
                    <Route path="/portfolio/editPortfolio/:slugs" element={<EditPortfolio />} />


                    <Route path="/NewsCategory" element={<NewsCategory />} />
                    <Route path="/NewsCategory/CreateNewsCategory" element={<CreateNewsCategory />} />
                    <Route path="/NewsCategory/editNewsCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditNewsCategory />} />
                    <Route path="/testimonials" element={<Testimonials />} />
                    <Route path="/testimonials/createTestimonials" element={<CreateTestimonials />} />
                    <Route path="/testimonials/createTestimonials/:categoryId" element={<CreateTestimonials />} />
                    <Route path="/testimonials/createTestimonials/:categoryId/:subcategoryId" element={<CreateTestimonialsSub />} />
                    <Route path="/testimonials/createTestimonials/:categoryId/:subcategoryId/:subsubcategoryId" element={<CreateTestimonialsSubSub />} />

                    <Route path="/popup-inquiry" element={<PopupInquiry />} />
                    <Route path="/hero-inquiry" element={<HerosectionInquiry />} />

                    <Route path="/testimonials/editTestimonials/:id" element={<EditTestimonials />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/faq/createFAQ" element={<CreateFAQ />} />
                    <Route path="/faq/editFAQ/:id" element={<EditFAQ />} />
                    <Route path="/ourTeam" element={<OurStaff />} />
                    <Route path="/ourTeam/createTeam" element={<CreateStaff />} />
                    <Route path="/ourTeam/editTeam/:id" element={<EditStaff />} />
                    <Route path="/banner" element={<Banner />} />
                    <Route path="/banner/createBanner" element={<CreateBanner />} />
                    <Route path="/banner/editBanner/:id" element={<EditBanner />} />
                    <Route path="/ProductCategory" element={<ProductCategory />} />
                    <Route path="/ProductCategory/CreateProductCategory" element={<CreateProductCategory />} />
                    <Route path="/ProductCategory/editProductCategory/:categoryId/:subCategoryId?/:subSubCategoryId?" element={<EditCategory />} />
                    <Route path="/extrapages" element={<PageContent />} />
                    <Route path="/extrapages/createextrapages" element={<CreatePageContent />} />
                    <Route path="/extrapages/editextrapages/:id" element={<EditPageContent />} />
                    <Route path="/pageContent/createPoints" element={<CreateAboutUsPoints />} />
                    <Route path="/pageContent/editPoints/:id" element={<EditAboutUsPoints />} />
                    <Route path="/product" element={<Product />} />
                    <Route path="/product/createProduct" element={<CreateProduct />} />
                    <Route path="/product/editProduct/:slugs" element={<EditProduct />} />

                    <Route path="/manageLogo" element={<Logo />} />
                    <Route path="/DatabaseManagement" element={<DatabaseManagement />} />
                    <Route path="/managePassword" element={<ManagePassword />} />
                    <Route path="/manageProfile" element={<ManageProfile />} />
                    <Route path="/certificates" element={<Achievements />} />
                    <Route path="/certificates/createcertificates" element={<CreateAchievements />} />
                    <Route path="/certificates/editcertificates/:id" element={<EditAchievement />} />
                    <Route path="/counter" element={<Counter />} />
                    <Route path="/counter/editCounter/:id" element={<EditCounter />} />
                    <Route path="/counter/createCounter" element={<CreateCounter />} />
                    <Route path="/Inquiry" element={<Inquiry />} />
                    <Route path="/missionandvision" element={<MissionAndVision />} />
                    <Route path="/corevalue" element={<Corevalue />} />
                    <Route path="/corevalue/createCorevalue" element={<CreateCorevalue />} />
                    <Route path="/corevalue/editCorevalue/:id" element={<EditCorevalue />} />

                    <Route path="/Card" element={<ShowCard />} />
                    <Route path="/Card/createCard" element={<AddCard />} />
                    <Route path="/Card/editCard/:id" element={<UpdateCard />} />

                    <Route path="/aboutcompany" element={<Aboutcompany />} />
                    <Route path="/careeroption" element={<Careeroption />} />
                    <Route path="/careeroption/createCareerOption" element={<CreateCareeroption />} />
                    <Route path="/careeroption/editCareerOption/:id" element={<EditCareeroption />} />
                    <Route path="/careerinquiry" element={<Careerinquiry />} />
                    <Route path="/footer" element={<Footer />} />
                    <Route path="/header" element={<Header />} />
                    <Route path="/globalpresence" element={<Globalpresence />} />
                    <Route path="/whatsappSettings" element={<WhatsappSettings />} />
                    <Route path="/googleSettings" element={<GoogleSettings />} />
                    <Route path="/menulisting" element={<Menulisting />} />
                    <Route path="/menulisting/createMenulisting" element={<CreateMenulisting />} />
                    <Route path="/menulisting/editMenulisting/:id" element={<EditMenulisting />} />


                    <Route path="/sitemap" element={<Sitemap />} />
                    <Route path="/sitemap/createSitemap" element={<CreateSitemap />} />
                    <Route path="/sitemap/editSitemap/:id/:type" element={<EditSitemap />} />
                    <Route path="/metadetails" element={<Metadetails />} />
                    <Route path="/metadetails/editmetaDetails/:id/:type" element={<EditMetadetails />} />
                    <Route path="/benefits" element={<Benefits />} />
                    <Route path="/benefits/createBenefits" element={<CreateBenefits />} />
                    <Route path="/benefits/editBenefits/:id" element={<EditBenefits />} />
                    <Route path="/manageTheme" element={<ManageColor />} />

                    <Route path="/contactinfo" element={<ContactInfoData />} />
                    <Route path="/contactinfo/createContactinfo" element={<CreateContactInfo />} />
                    <Route path="/contactinfo/editContactinfo/:id" element={<EditContactInfo />} />
                    <Route path="/conatctinquiries" element={<ContactInquiry />} />
                    <Route path="/managesectionvisibility" element={<ManageSectionVisibility />} />

                    {/* made for me  */}

                    <Route path="/homehero" element={<HomeHerosection />} />
                    <Route path="/services/createService/:categoryId" element={<CreateServiceDetails />} />
                    <Route path="/services/createService/:categoryId/:subcategoryId" element={<NewSubServiceForm />} />
                    <Route path="/services/createService/:categoryId/:subcategoryId/:subsubcategoryId" element={<NewSubSubServiceForm />} />

                    <Route path="/services/edit-service/:categoryId" element={<EditServicePage />} />
                    <Route path="/services/edit-subcategory/:categoryId/:subcategoryId" element={<EditSubServicePage />} />
                    <Route path="/services/edit-subsubcategory/:categoryId/:subcategoryId/:subsubcategoryId" element={<EditSubSubServicePage />} />

                    <Route path="/services/editService/:categoryId" element={<EditServiceDetails />} />
                    <Route path="/services/editSubService/:categoryId" element={<EditSubServiceDetails />} />
                    <Route path="/services/editSubSubService/:categoryId" element={<EditSubSubServiceDetails />} />

                    <Route path="/services/createImage/:categoryId" element={<CreateServiceImage />} />
                    <Route path="/services/createImage/:categoryId/:subcategoryId" element={<NewSubGalleryForm />} />
                    <Route path="/services/createImage/:categoryId/:subcategoryId/:subsubcategoryId" element={<NewSubSubGalleryForm />} />

                    <Route path="/industries/createImage/:categoryId" element={<CreateIndustryImage />} />
                    <Route path="/industries/createImage/:categoryId/:subcategoryId" element={<CreateSubIndustryImage />} />
                    <Route path="/industries/createImage/:categoryId/:subcategoryId/:subsubcategoryId" element={<CreateSubSubIndustryImage />} />



                    <Route path="/services/editImages/:categoryId" element={<EditServiceImages />} />
                    <Route path="/industries/editImages/:categoryId" element={<EditIndustryImage />} />

                    {/* <Route path="/services/createPackage/:categoryId" element={<CreatePackage/>}/>
<Route path="/services/packages/:packageId" element={<EditPackageForm/>}/> */}
                    <Route path="/services/designProcess/:categoryId" element={<DesignProcessForm />} />
                    <Route path="/services/designProcess/:categoryId/:subcategoryId" element={<DesignSubProcessForm />} />
                    <Route path="/services/designProcess/:categoryId/:subcategoryId/:subsubcategoryId" element={<DesignSubSubProcessForm />} />

                    <Route path="/services/editDesignProcess/:processId" element={<EditDesignProcess />} />
                    <Route path="/extrapages/:contentType" element={<EditWebSolutionDetails />} />



                    <Route path="/menulisting/createSubmenu" element={<NewSubmenuListingForm />} />
                    <Route path="/menulisting/editSubmenu/:id" element={<EditSubmenuForm />} />



                    <Route path="/industries/edit-industries/:categoryId" element={<EditIndustiresPage />} />
                    <Route path="/industries/edit-subcategory/:categoryId/:subcategoryId" element={<EditIndustiresSubPage />} />
                    <Route path="/industries/edit-subsubcategory/:categoryId/:subcategoryId/:subsubcategoryId" element={<EditIndustiresSubsubPage />} />

                    <Route path="/industries/createIndustries/:categoryId" element={<NewIndustriesForm />} />
                    <Route path="/industries/editIndustries/:categoryId" element={<EditIndustriesForm />} />

                    <Route path="/industries/createIndustries/:categoryId/:subcategoryId" element={<NewIndustriesSubForm />} />
                    <Route path="/industries/editSubIndustries/:categoryId" element={<EditIndustriesSubForm />} />

                    <Route path="/industries/createIndustries/:categoryId/:subcategoryId/:subsubcategoryId" element={<NewIndustriesSubSubForm />} />
                    <Route path="/industries/editSubsubIndustries/:categoryId" element={<EditIndustriesSubSubForm />} />

                    <Route path="/newsletter" element={<Newsletter />} />

                    <Route path="/logotype" element={<Logotype />} />
                    <Route path="/logotype/createLogotype" element={<CreateLogoType />} />
                    <Route path="/logotype/editLogotype/:id" element={<EditLogotype />} />

                  </Route></>

            )}
          </Routes>
        </>

      )}
    </BrowserRouter>


  );
}

export default App;