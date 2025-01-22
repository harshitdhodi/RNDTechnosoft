import React from 'react';

import MainBlog from './Blogs/MainBlog'
import BlogSub from './Blogs/SubBlog';
import BlogSubSub from './Blogs/SubSubBlog';
import ServiceMain from './Website'
import Package from './Design'
import Portfolios from './Projects'
import About from './AboutUs'
import Industries from './SocialMedia'
import GetInTouch from './Contact';
export const WebsiteMaintenance = () => <div>Website Maintenance Page sub category</div>;
export const WordPressMaintenance = () => <div>WordPress Maintenance Page sub sub category</div>;
export const MobileAppDevelopment = () => <div> App Development Page  main category </div>;
export const IOSDevelopment = () => <div>iOS Development Page sub category</div>;
export const AndroidDevelopment = () => <div>Android Development Page sub sub category</div>;
export const MainBlogs = () => <MainBlog/>;
export const SubBlogs = () => <BlogSub/>;
export const SubSubBlogs = () => <BlogSubSub/>;
export const MainService = () => <ServiceMain/>;
export const SubService = () => <ServiceMain/>;
export const SubSubService = () => <ServiceMain/>;

export const MainPackage = () => <Package/>;
export const SubPackage = () => <Package/>;
export const SubSubPackage = () => <Package/>;

export const ProjectSection = () => <Portfolios/>;
export const Aboutus = () => <About/>


export const MainIndustries = () => <Industries/>;
export const SubIndustries = () => <Industries/>;
export const SubSubIndustries = () => <Industries/>;