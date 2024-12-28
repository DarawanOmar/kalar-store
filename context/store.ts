import { StaticImageData } from "next/image";
import { createGlobalState } from ".";
import { toast } from "sonner";

export type IndividualProductStore = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string | StaticImageData;
  date: string;
  color: string;
  description: string;
  amount: number;
  addQuantity: number;
};

type ProductsStore = {
  total_price: number;
  product: IndividualProductStore[];
};

export const useProductStore = createGlobalState<ProductsStore>(
  "product-store",
  {
    product: [],
    total_price: 0,
  }
);

export function useAddProduct(product: IndividualProductStore) {
  const { data } = useProductStore();
  const { ...rest } = product;
  if (rest.quantity < 1) return toast.error("ئەم پەرهەمە لە کۆگادا نەماوە");
  const addedProduct = { ...rest };
  const existingProduct = data?.product.find((p) => p.id === addedProduct.id);

  if (existingProduct) {
    existingProduct.addQuantity += 1;
  } else {
    data?.product.push({ ...addedProduct, addQuantity: 1 });
  }
  calculateTotalPrice();
}

export const calculateTotalPrice = () => {
  const { data, setData } = useProductStore();
  const totalPrice = data?.product.reduce((acc, item) => acc + item.price, 0);
  setData({ total_price: totalPrice });
};

// export const removeProduct = (id: string) => {
//   const { data, setData } = useProductStore();
//   const product = data?.product.filter((item) => item.id !== id);
//   setData({ product });
// };

// export const addProduct = (product: IndividualProductStore) => {
//   const { data, setData } = useProductStore();
//   if (!data) return;
//   const productExist = data.product.find((item) => item.id === product.id);
//   if (productExist) {
//     const newProduct = data.product.map((item) => {
//       if (item.id === product.id) {
//         return { ...item, quantity: item.quantity && item.quantity + 1 };
//       }
//       return item;
//     });
//   } else {
//     return setData({ product: [...data.product, { ...product, quantity: 1 }] });
//   }
// };

// export const increaseProduct = (id: string) => {
//   const { data, setData } = useProductStore();
//   const product = data?.product.map((item) => {
//     if (item.id === id) {
//       return { ...item, quantity: item.quantity && item.quantity + 1 };
//     }
//     return item;
//   });
//   setData({ product });
// };

// export const decreaseProduct = (id: string) => {
//   const { data, setData } = useProductStore();
//   const product = data?.product.map((item) => {
//     if (item.id === id) {
//       return { ...item, quantity: item.quantity && item.quantity - 1 };
//     }
//     return item;
//   });
//   setData({ product });
// };
