import { useState } from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Blogs from "../components/Blogs";
import SectionTitle from "../components/SectionTitle";
import Categories from "../components/Categories";
import ProductsSection from "../components/ProductsSection";

function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <>
      <Hero id="home" />

      <SectionTitle highlightText="Features" />
      <Features id="features" />

      <SectionTitle highlightText="Category" />
      <Categories id="categories" setSelectedCategory={setSelectedCategory} />

      <SectionTitle highlightText="SubCategories" />
      <ProductsSection id="products" selectedCategory={selectedCategory} />

      <SectionTitle highlightText="Blogs" />
      <Blogs id="blogs" />
    </>
  );
}

export default HomePage;