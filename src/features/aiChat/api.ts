import { apiRequest, getApiErrorMessage } from "../../shared/api/httpClient";
import type { ApiResponse } from "../../shared/api/apiResponse";
import type {
  AiChatConversationTranscript,
  AiChatMessage,
  AiChatResponse,
  ProductChatCard,
  SendAiChatMessageRequest,
  SizeRecommendation,
  StartAiChatConversationRequest,
} from "./types";

export const AI_CHAT_ERROR_MESSAGE =
  "Em dang gap loi khi xu ly yeu cau. Anh/chi thu lai giup em nhe.";

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function readString(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function readNumber(value: unknown, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function readStringArray(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim()))
    : [];
}

function readArray(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function mapApiResponse<T>(
  response: ApiResponse<unknown>,
  data: T | null,
): ApiResponse<T> {
  return {
    ...response,
    data,
  };
}

function normalizeProductCard(value: unknown): ProductChatCard | null {
  if (!isRecord(value)) {
    return null;
  }

  const productId = readString(value.productId) || readString(value.id);
  const name = readString(value.name);

  if (!productId || !name) {
    return null;
  }

  return {
    type: readString(value.type, "PRODUCT"),
    productId,
    name,
    price: readNumber(value.price),
    imageUrl: readString(value.imageUrl) || readString(value.thumbnailUrl) || null,
    navigateUrl: readString(value.navigateUrl, `/products/${productId}`),
    availableSizes: readStringArray(value.availableSizes),
    availableColors: readStringArray(value.availableColors),
  };
}

function normalizeRecommendation(value: unknown): SizeRecommendation | null {
  if (!isRecord(value)) {
    return null;
  }

  const size = readString(value.size);

  if (!size) {
    return null;
  }

  return {
    size,
    confidence: readNumber(value.confidence),
    reason: readString(value.reason),
  };
}

export function normalizeAiChatResponse(value: unknown): AiChatResponse | null {
  if (!isRecord(value)) {
    return null;
  }

  const conversationId = readString(value.conversationId);
  const reply = readString(value.reply) || readString(value.content);

  if (!conversationId || !reply) {
    return null;
  }

  return {
    conversationId,
    reply,
    intent: readString(value.intent) || null,
    cards: readArray(value.cards)
      .map((item) => normalizeProductCard(item))
      .filter((item): item is ProductChatCard => Boolean(item)),
    suggestedReplies: readStringArray(value.suggestedReplies),
    recommendation: normalizeRecommendation(value.recommendation),
  };
}

function normalizeMessage(value: unknown): AiChatMessage | null {
  if (!isRecord(value)) {
    return null;
  }

  const content = readString(value.content) || readString(value.reply) || readString(value.message);

  if (!content) {
    return null;
  }

  const senderType = readString(value.senderType, "ASSISTANT").toUpperCase();

  return {
    id: readString(value.id) || undefined,
    senderType:
      senderType === "USER" || senderType === "SYSTEM" ? senderType : "ASSISTANT",
    content,
    intent: readString(value.intent) || null,
    cards: readArray(value.cards)
      .map((item) => normalizeProductCard(item))
      .filter((item): item is ProductChatCard => Boolean(item)),
    suggestedReplies: readStringArray(value.suggestedReplies),
    recommendation: normalizeRecommendation(value.recommendation),
    createdAt: readString(value.createdAt) || undefined,
  };
}

function normalizeTranscript(value: unknown): AiChatConversationTranscript | null {
  if (!isRecord(value)) {
    return null;
  }

  const conversationId = readString(value.conversationId);

  if (!conversationId) {
    return null;
  }

  return {
    conversationId,
    status: readString(value.status, "ACTIVE"),
    pageType: readString(value.pageType) || null,
    relatedProductId: readString(value.relatedProductId) || null,
    relatedOrderId: readString(value.relatedOrderId) || null,
    messages: readArray(value.messages)
      .map((item) => normalizeMessage(item))
      .filter((item): item is AiChatMessage => Boolean(item)),
  };
}

export function getAiChatErrorMessage(error: unknown) {
  const message = getApiErrorMessage(error);

  if (message.toLowerCase().includes("java core")) {
    return "Em chua lay duoc danh sach san pham luc nay. Anh/chi thu lai sau vai phut nhe.";
  }

  return message || AI_CHAT_ERROR_MESSAGE;
}

export async function startAiChatConversation(
  payload: StartAiChatConversationRequest,
) {
  const response = await apiRequest<unknown>({
    url: "/ai-chat/conversations",
    method: "POST",
    data: payload,
  });

  return mapApiResponse(response, normalizeAiChatResponse(response.data));
}

export async function sendAiChatMessage(
  conversationId: string,
  payload: SendAiChatMessageRequest,
) {
  const safeConversationId = conversationId.trim();

  if (!safeConversationId) {
    throw new Error("Conversation id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/ai-chat/conversations/${safeConversationId}/messages`,
    method: "POST",
    data: payload,
  });

  return mapApiResponse(response, normalizeAiChatResponse(response.data));
}

export async function getAiChatConversation(conversationId: string) {
  const safeConversationId = conversationId.trim();

  if (!safeConversationId) {
    throw new Error("Conversation id is required");
  }

  const response = await apiRequest<unknown>({
    url: `/ai-chat/conversations/${safeConversationId}`,
    method: "GET",
  });

  return mapApiResponse(response, normalizeTranscript(response.data));
}
