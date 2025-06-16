import { Request, Response } from "express";
import { ComandaAdapter } from "../intregrations/ComandaAdapter";
import initialMenuItems from "../data/menuData"; // Importa o menuData local como fallback

export const ProductController = {
  async getProducts(req: Request, res: Response) {
    try {
      // Tenta obter os produtos da API externa primeiro
      const products = await ComandaAdapter.getProductsFromExternalAPI();
      res.status(200).json(products);
    } catch (error: any) {
      // Se houver erro ou a API externa não tiver endpoint de produtos, usa o fallback local
      console.warn(
        "Não foi possível obter produtos da API externa. Usando menuData local como fallback. Erro:",
        error.message
      );
      res.status(200).json(initialMenuItems); // Sempre retorna 200 OK para o frontend, mas com dados de fallback
    }
  },
};
