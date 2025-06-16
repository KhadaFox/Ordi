import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Carrega as variáveis de ambiente

const EXTERNAL_API_BASE_URL =
  process.env.EXTERNAL_API_URL || "http://localhost:8080/api";
const EXTERNAL_API_KEY = process.env.EXTERNAL_API_KEY;

const externalApiClient = axios.create({
  baseURL: EXTERNAL_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Adicione a autenticação da API externa aqui, se necessária
    ...(EXTERNAL_API_KEY && { Authorization: `Bearer ${EXTERNAL_API_KEY}` }),
    // Exemplo: 'x-api-key': EXTERNAL_API_KEY, ou 'Authorization': `Basic ${btoa('user:pass')}`
  },
});

// Tipos básicos para garantir a estrutura
interface OrderItem {
  productId: string;
  variantId?: string;
  quantity: number;
  priceUnit: number;
  name: string;
  variantName?: string;
  observacoesItem?: string;
}

interface OrderData {
  comandaId: string;
  numeroMesa: string;
  itens: OrderItem[];
  observacoesGerais?: string;
  totalComanda: number;
}

// Tipo para a resposta de produto que seu frontend espera
interface FrontendProduct {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory: string;
  image?: string;
  price?: number;
  variantes?: {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
  }[];
}

export const ComandaAdapter = {
  /**
   * Envia dados do pedido para a API externa do sistema de comandas.
   * Adapta o formato dos dados do seu frontend para o formato esperado pela API externa.
   * @param orderData Dados do pedido do seu frontend.
   * @returns Resposta da API externa.
   */
  async sendOrderToExternalAPI(orderData: OrderData): Promise<any> {
    try {
      // Adapta o formato do seu `orderData` para o formato que a API do comércio espera
      const adaptedOrderData = {
        comanda_id: orderData.comandaId, // Exemplo: snake_case se a API externa usa
        numero_mesa: orderData.numeroMesa,
        itens_pedido: orderData.itens.map((item: OrderItem) => ({
          produto_id: item.productId,
          variante_id: item.variantId,
          quantidade: item.quantity,
          preco_unitario: item.priceUnit,
          nome_produto: item.name,
          nome_variante: item.variantName,
          observacoes: item.observacoesItem,
        })),
        observacoes_gerais: orderData.observacoesGerais,
        valor_total: orderData.totalComanda,
        // Adicione quaisquer outros campos que a API do comércio precise
      };

      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // *** MUDE AQUI O ENDPOINT DA API EXTERNA PARA ONDE ELA RECEBE PEDIDOS ***
      // Ex: '/pedidos', '/comandas/adicionar', '/v1/orders'
      const response = await externalApiClient.post(
        "/pedidos",
        adaptedOrderData
      ); // <<<< ATENÇÃO AQUI!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      return response.data;
    } catch (error: any) {
      console.error(
        "Erro ao enviar pedido para a API externa:",
        error.response?.data || error.message
      );
      throw new Error(
        `Falha ao enviar pedido para o sistema do comércio: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  /**
   * Tenta obter a lista de produtos da API externa.
   * Adapta o formato da resposta da API externa para o formato que seu frontend espera.
   * @returns Lista de produtos no formato esperado pelo frontend.
   */
  async getProductsFromExternalAPI(): Promise<FrontendProduct[]> {
    try {
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // *** MUDE AQUI O ENDPOINT DA API EXTERNA PARA ONDE ELA FORNECE PRODUTOS ***
      // Ex: '/cardapio', '/produtos', '/v1/products'
      const response = await externalApiClient.get("/cardapio"); // <<<< ATENÇÃO AQUI!
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      // Adapte a resposta da API externa para o formato que seu frontend espera (Menu.jsx)
      // Este é um exemplo, você precisará ajustar conforme a estrutura da resposta da API externa.
      const adaptedProducts: FrontendProduct[] = response.data.map(
        (product: any) => ({
          id: product.id || product.produto_id, // Use o ID que a API externa fornece
          name: product.nome || product.name,
          description: product.descricao || product.description,
          category: product.categoria || product.category,
          subcategory: product.subcategoria || product.subcategory,
          image: product.url_imagem || product.image_url || product.image,
          price: product.preco_unico || product.price, // Se for um produto sem variantes
          variantes: product.variantes
            ? product.variantes.map((v: any) => ({
                id: v.id || v.variante_id,
                name: v.nome || v.name,
                price: v.preco || v.price,
                description: v.descricao || v.description,
                image: v.url_imagem || v.image_url || v.image,
              }))
            : undefined, // Use undefined se não houver variantes
        })
      );
      return adaptedProducts;
    } catch (error: any) {
      console.error(
        "Erro ao obter produtos da API externa:",
        error.response?.data || error.message
      );
      // Aqui, você pode optar por relançar o erro ou retornar um array vazio/fallback
      throw new Error(
        `Falha ao obter produtos do sistema do comércio: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },
};
