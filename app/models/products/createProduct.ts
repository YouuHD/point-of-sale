import { productValidation } from "~/validations/products/productSchema";
import prisma from "../../../prisma/prisma";
import { BarCodeExist } from "~/use-cases/product/barCodeProductExists";

export const createProduct = async (data: {
  barCode: string;
  model?: string
  name: string;
  price: string;
  cost: string;
  stock: string;
  description?: string;
  category: string;
}) => {
  try {
    console.log("Datos de entrada:", data);
    productValidation.parse(data);

    const barCodeExist = await BarCodeExist(data.barCode);
    if (barCodeExist) {
      throw new Error("Ya existe un producto con este código de barras.");
    }

    const newProduct = await prisma.product.create({
      data: {
        category: {
          connect: {
            id: data.category,
          },
        },
        barCode: data.barCode,
        model: data.model,
        name: data.name,
        price: data.price,
        cost: data.cost,
        stock: data.stock,
        description: data.description,
      },
    });
    return newProduct;
  } catch (error: any) {
    console.error("Error al crear producto:", error);
    throw new Error(error.message || "Error al crear producto.");
  }
};
