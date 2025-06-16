import { Request, Response } from "express";
import { ComandaAdapter } from "../intregrations/ComandaAdapter";

export const OrderController = {
  async createOrder(req: Request, res: Response) {
    try {
      const orderData = req.body; // Recebe o payload do frontend

      // Validação básica (adicione mais validações conforme necessário)
      if (
        !orderData ||
        !orderData.comandaId ||
        !orderData.numeroMesa ||
        !orderData.itens ||
        orderData.itens.length === 0
      ) {
        return res
          .status(400)
          .json({ message: "Dados do pedido incompletos." });
      }

      // Envia o pedido para a API externa via ComandaAdapter
      const result = await ComandaAdapter.sendOrderToExternalAPI(orderData);

      // Retorna a resposta da API externa para o frontend
      res.status(200).json({
        message: "Pedido enviado com sucesso para o sistema do comércio.",
        data: result,
      });
    } catch (error: any) {
      console.error("Erro no OrderController.createOrder:", error.message);
      res.status(500).json({
        message: error.message || "Erro interno ao processar o pedido.",
      });
    }
  },
};
