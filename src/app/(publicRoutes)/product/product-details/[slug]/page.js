export const dynamic = "force-dynamic";
import GalleryImages from "@/components/Products/GalleryImages/GalleryImages.js";
import RelatedProducts from "@/components/Products/RelatedProducts/RelatedProducts.js";
import { FindAProduct, ReviewsTotalBySlug } from "@/actions/actions";
import AddCartBtn from "@/components/Ui/Products/AddCartBtn/AddCartBtn";
import ProductSeenHistories from "@/components/Products/ProductSeenHistories/ProductSeenHistories";
import ConverterToHtml from "@/components/ConverterToHtml/ConverterToHtml";
import {
  Package,
  ShoppingCart,
  Truck,
  Shield,
  Star,
  StarHalf,
  Check,
  Tag,
  Leaf,
} from "lucide-react";
import Link from "next/link";
import SendReviews from "@/components/Products/ReviewSection/SendReviews/SendReviews";
import ShowReviews from "@/components/Products/ReviewSection/ShowReviews/ShowReviews";
import ShareButton from "@/components/ShareButton/ShareButton";
import Container from "@/components/Container/Container";

const ProductDetails = async ({ params }) => {
  const { slug } = await params;
  const product = await FindAProduct(slug);
  const { totalReviews, averageRating } = await ReviewsTotalBySlug({ slug });
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center bg-background">
        <div className="bg-surface p-12 rounded-2xl shadow-lg text-center border border-border">
          <div className="bg-error/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-error" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-text mb-2">
            Product Not Found
          </h2>
          <p className="text-text-secondary mb-6">
            দুঃখিত, এই পণ্যটি খুঁজে পাওয়া যায়নি
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-all duration-200"
          >
            <ShoppingCart className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Calculate discount percentage
  const discountPercentage = product.regularPrice
    ? Math.round(
        ((product.regularPrice - product.offerPrice) / product.regularPrice) *
          100
      )
    : 0;

  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="bg-background">
      <Container>
        {/* Breadcrumb */}
        <div className="py-4 md:py-6">
          <div className="">
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Link href="/" className="text-sm lg:text-base transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link
                href="/product/collections/all-products"
                className="text-sm lg:text-base transition-colors"
              >
                Shop
              </Link>
              <span>/</span>
              <Link
                href={`/product/collections/${product.category}`}
                className="text-sm lg:text-base transition-colors"
              >
                {product.category}
              </Link>
              <span>/</span>
              <span className="text-text font-normal text-sm lg:text-base">
                {product.productName}
              </span>
            </div>
          </div>
        </div>

        <div className="">
          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
            {/* Gallery Images */}
            <div className=" lg:sticky lg:top-24 lg:self-start">
              <GalleryImages product={JSON.stringify(product)} />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title & Category */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    {product.category}
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold text-text leading-tight">
                  {product.productName}
                </h1>
                <div className=" mt-2">
                  <ConverterToHtml html={product.shortDescriptions} />
                </div>

                <Link href="#reviews" className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    {[...Array(fullStars)].map((_, i) => (
                      <Star
                        key={`full-${i}`}
                        className="fill-accent-orange text-accent-orange"
                        width={16}
                        height={16}
                        strokeWidth={1.5}
                      />
                    ))}

                    {/* Half Star */}
                    {hasHalfStar && (
                      <StarHalf
                        className="fill-accent-orange text-accent-orange"
                        width={16}
                        height={16}
                        strokeWidth={1.5}
                      />
                    )}

                    {/* Empty Stars */}
                    {[...Array(emptyStars)].map((_, i) => (
                      <Star
                        key={`empty-${i}`}
                        className="text-border"
                        width={16}
                        height={16}
                        strokeWidth={1.5}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-text-secondary">
                    ({averageRating}) {totalReviews} reviews
                  </span>
                </Link>
              </div>

              {/* Price Section */}
              <div className="bg-linear-to-br from-primary/5 to-accent/5 p-6 rounded-2xl border border-primary/20">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl md:text-3xl font-bold text-text">
                    TK{product.offerPrice.toLocaleString()}
                  </span>
                  {product.regularPrice > product.offerPrice && (
                    <>
                      <span className="text-lg md:text-xl line-through text-text-muted">
                        TK{product.regularPrice.toLocaleString()}
                      </span>
                      <span className="px-3 py-1 bg-error text-white rounded-full text-sm font-bold">
                        {discountPercentage}% OFF
                      </span>
                    </>
                  )}
                </div>
                {product.regularPrice > product.offerPrice && (
                  <p className="text-success text-sm font-semibold">
                    You save TK
                    {(product.regularPrice - product.offerPrice)
                      .toFixed(2)
                      .toLocaleString()}
                  </p>
                )}
              </div>

              {/* Stock & Shipping Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-text" strokeWidth={2} />
                    <span className="text-sm font-semibold text-text">
                      Stock Status
                    </span>
                  </div>
                  {product.stock > 0 ? (
                    <div className="flex items-center gap-1">
                      <Check
                        className="w-4 h-4 text-success"
                        strokeWidth={2.5}
                      />
                      <span className="text-success font-semibold text-sm">
                        Available ({product.stock} items)
                      </span>
                    </div>
                  ) : (
                    <span className="text-error font-semibold text-sm">
                      Out of Stock
                    </span>
                  )}
                </div>

                <div className="bg-surface p-4 rounded-xl border border-border">
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-text" strokeWidth={2} />
                    <span className="text-sm font-semibold text-text">
                      Shipping
                    </span>
                  </div>
                  <span className="text-text-secondary font-semibold text-sm capitalize">
                    {product.shipping_fee}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <AddCartBtn
                  product={JSON.stringify(product)}
                  styles="w-full px-4 py-2 md:py-3 bg-text  text-white hover:bg-black transition-all duration-300 font-medium text-sm md:text-base shadow-md hover:shadow-lg flex items-center justify-center gap-2 group/btn"
                >
                  <ShoppingCart
                    className="w-4 h-4 group-hover/btn:scale-110 transition-transform"
                    strokeWidth={2}
                  />
                  <span className="">Add to Cart</span>
                </AddCartBtn>

                <div className="w-full">
                  {/* <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-border hover:border-primary text-text hover:text-primary rounded-xl transition-all duration-200 font-medium hover:bg-primary/5">
                  <Heart className="w-4 h-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Wishlist</span>
                </button> */}
                  {/* <button className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-border hover:border-primary text-text hover:text-primary rounded-xl transition-all duration-200 font-medium hover:bg-primary/5 w-full">
                  <Share2 className="w-4 h-4" strokeWidth={2} />
                  <span className="hidden sm:inline">Share</span>
                </button> */}
                  <ShareButton />
                </div>
              </div>
              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
                <div className="text-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <p className="text-xs text-text-secondary font-medium">
                    Secure Payment
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Truck className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <p className="text-xs text-text-secondary font-medium">
                    Fast Delivery
                  </p>
                </div>
                <div className="text-center">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <p className="text-xs text-text-secondary font-medium">
                    100% Natural
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-border mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-6 flex items-center gap-3">
              <div className="w-1 h-8 bg-primary rounded-full"></div>
              Product Description
            </h2>
            <div className="prose prose-sm md:prose-base max-w-none text-text-secondary leading-relaxed">
              <ConverterToHtml html={product.descriptions} className="" />
            </div>
          </div>

          {/* Related Products */}
          <div className="mb-12">
            <RelatedProducts slug={product?.category} />
          </div>

          {/* Recently Viewed */}
          <div>
            <ProductSeenHistories />
          </div>

          <div className="">
            <SendReviews product={JSON.stringify(product)} />
            <ShowReviews slug={JSON.stringify(product?.slug)} />
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductDetails;
