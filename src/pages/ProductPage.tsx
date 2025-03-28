import PageTransition from "../components/PageTransition";
import { Products } from "../components/Products";

function ProductPage() {
  return (
    <div className="min-h-screen bg-[#FFFBE9]">
      <Products />
    </div>
  );
}

export default PageTransition(ProductPage);
