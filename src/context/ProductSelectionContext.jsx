// ye page home page mese sectcetegory name product page me send krta he
import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [selectedProductName, setSelectedProductName] = useState(null);

  return (
    <ProductContext.Provider value={{ selectedProductName, setSelectedProductName }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);