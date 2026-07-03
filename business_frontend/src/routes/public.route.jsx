import { Route } from "react-router-dom";

import SearchResults from "../pages/search/SearchResults";
import CategoryListing from "../pages/search/CategoryListing";
import SubCategory from "../pages/search/SubCategory";
import CityListing from "../pages/search/CityListing";
import AreaListing from "../pages/search/AreaListing";
import NearMe from "../pages/search/NearMe";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import OTPVerification from "../pages/auth/OTPVerification";
import Profile from "../pages/auth/Profile";
import Favorites from "../pages/auth/Favorites";

import TopRatedBusinesses from "../pages/conversion/TopRatedBusinesses";
import TrendingServices from "../pages/conversion/TrendingServices";
import CompareBusinesses from "../pages/conversion/CompareBusinesses";
import InstantHire from "../pages/conversion/InstantHire";

import Home from "../pages/Home"
import About from "../pages/About"
import Contact from "../pages/Contact"
import Faq from "../pages/Faq"
import Insights from "../pages/Insights"

import HelpCenterPage from "../pages/Help"
import CategoryPage from "../pages/categories/CategoryPage"
import TypeCatagory from "../pages/categories/pages/TypeCategory";
import ProductListing from "../pages/categories/pages/ProductListing";
import ProductDetails from "../pages/categories/pages/ProductDetails";
import BookService from "../pages/categories/pages/BookService";
import LeadConfirmation from "../pages/categories/pages/LeadConfirmation";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsConditions from "../pages/TermsConditions";


const PublicRoutes = () => {
  return (
    <>
      <Route path="/" element={<Home />} />

      <Route path="/search" element={<SearchResults />} />
      <Route path="/categories" element={<CategoryListing />} />
      <Route path="/category/:categoryName" element={<SubCategory />} />
      <Route path="/city/:cityName" element={<CityListing />} />
      <Route path="/area/:areaName" element={<AreaListing />} />
      <Route path="/near-me" element={<NearMe />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-otp" element={<OTPVerification />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-favorites" element={<Favorites />} />

      <Route path="/top-rated-businesses" element={<TopRatedBusinesses />} />
      <Route path="/trending-services" element={<TrendingServices />} />
      <Route path="/compare-businesses" element={<CompareBusinesses />} />
      <Route path="/instant-hire" element={<InstantHire />} />

        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<Faq/>}/>
        <Route path="/insight" element={<Insights/>}/>
        <Route path="/category" element={<CategoryPage/>}/>
        <Route path="/help" element={<HelpCenterPage/>}/>
        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
        <Route path="/terms" element={<TermsConditions/>}/>
        <Route path="/typeCatagory" element={<TypeCatagory/>}/>
        <Route path="/products" element={<ProductListing/>}/>
        <Route path="/product-details/:id" element={<ProductDetails/>}/>
        <Route path="/book-service" element={<BookService/>} />
        <Route path="/lead-confirmation" element={<LeadConfirmation/>}/>

      
    </>
  );
};

export default PublicRoutes;