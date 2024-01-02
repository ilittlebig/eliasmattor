import { Product, useCart } from '@/hooks/cart'
import { useToast } from '@/contexts/toastContext'
import LoadingInformation from './loading'
import Button from '@/components/button'
import currencyFormatter from '@/utils/currencyFormatter'

type ProductInformationProps = {
  product: Product | null
}

const ProductInformation = ({ product }: ProductInformationProps) => {
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();
  const formattedPrice = currencyFormatter(product ? product.price : 0, "SEK");

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showToast({
      name: product.name,
      price: product.price,
      image: "/rug1.png"
    });
  };

  return (
    <div className="flex flex-col gap-y-8 lg:w-[40%] w-full">
      {product ? (
        <>
	  <div className="flex flex-col gap-y-6 px-4">
	    <div className="flex flex-col gap-y-1">
	      <h1 className="text-3xl font-bold">
	        {product.name}
	      </h1>
	      <h3 className="text-lg text-gray-600">
	        Dimensioner: {product.dimensions}
	      </h3>
	      <h3 className="text-lg text-gray-600">
	        Material: {product.material}
	      </h3>
	    </div>

	    <h3 className="text-lg text-gray-600">
	      {product.description}
	    </h3>
	    <h3 className="text-xl font-medium">{formattedPrice}</h3>
	  </div>

	  <div className="flex flex-col gap-y-2 fixed bottom-0 left-0 sticky py-3 bg-white">
	    <div className="px-4">
	      <Button
		actionText="Lägg Till"
		onClick={() => handleAddToCart(product)}
		fill
	      />
	    </div>
	  </div>
	</>
      ) : (
        <LoadingInformation />
      )}
    </div>
  )
}

export default ProductInformation;
