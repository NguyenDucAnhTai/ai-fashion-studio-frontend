export type AiChatPageType =
  | "PRODUCT_LIST"
  | "PRODUCT_DETAIL"
  | "CART"
  | "CHECKOUT"
  | "ORDER_LIST"
  | "ORDER_DETAIL"
  | "PROFILE"
  | "STAFF_CONSOLE";

export interface AiChatPageContext {
  type: AiChatPageType;
  url: string;
  productId: string | null;
  orderId: string | null;
}

export interface AiChatClientContext {
  currentFilters: Record<string, unknown>;
  visibleProductIds: string[];
  selectedSize: string | null;
  selectedColor: string | null;
}

export interface ProductChatCard {
  type: "PRODUCT" | string;
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  navigateUrl: string;
  availableSizes: string[];
  availableColors: string[];
}

export interface SizeRecommendation {
  size: string;
  confidence: number;
  reason: string;
}

export type AiChatSenderType = "USER" | "ASSISTANT" | "SYSTEM";

export interface AiChatMessage {
  id?: string;
  senderType: AiChatSenderType;
  content: string;
  intent?: string | null;
  cards?: ProductChatCard[];
  suggestedReplies?: string[];
  recommendation?: SizeRecommendation | null;
  createdAt?: string;
}

export interface StartAiChatConversationRequest {
  channel: "WEB";
  page: AiChatPageContext;
}

export interface SendAiChatMessageRequest {
  message: string;
  page: AiChatPageContext;
  clientContext: AiChatClientContext;
}

export interface AiChatResponse {
  conversationId: string;
  reply: string;
  intent?: string | null;
  cards: ProductChatCard[];
  suggestedReplies: string[];
  recommendation?: SizeRecommendation | null;
}

export interface AiChatConversationTranscript {
  conversationId: string;
  status: string;
  pageType?: string | null;
  relatedProductId?: string | null;
  relatedOrderId?: string | null;
  messages: AiChatMessage[];
}
