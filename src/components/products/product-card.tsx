import Link from "next/link";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import { array } from "zod";
import AddToCartButton from "./add-to-cart-button";

type Product = {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  image?: string | null;
};

export default function ProductCard({ product }: { product: Product }) {
  const productdiscount = Math.round(product.productPrice * 1.8);
  return (
    <div className="m-10 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      <Link
        href={`/products/${product.id}`}
        className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <Image
          src={product.image || "/placeholder.jpg"}
          alt={product.productName}
          width={400}
          height={300}
          className="w-full h-full object-cover"
          priority
        />
        <span className="absolute top-0 left-0 m-2 rounded-full bg-black px-2 text-center text-sm font-medium text-white">
          20% OFF
        </span>
      </Link>
      <div className="mt-2 px-5 pb-5">
        <div>
          <h5 className="text-xl tracking-tight text-slate-900">
            {product.productName}
          </h5>
        </div>
        <div className="mt-2 mb-5 flex  items-center justify-between">
          <p>
            <span className="text-xl font-bold text-slate-900">
              ${product.productPrice}
            </span>
            <span className="text-xs text-slate-900 line-through">
              ${productdiscount}
            </span>
          </p>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((_, index) => (
              <svg
                key={index}
                aria-hidden="true"
                className="h-4 w-4 text-yellow-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}

            <span className="mr-2 ml-1 rounded bg-yellow-400 px-2.5 py-0.5 text-xs font-semibold">
              5.0
            </span>
          </div>
        </div>
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
