import {
  Bot,
  ChevronDown,
  MessageCircle,
  RefreshCw,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import {
  AI_CHAT_ERROR_MESSAGE,
  getAiChatConversation,
  getAiChatErrorMessage,
  sendAiChatMessage,
  startAiChatConversation,
} from "./api";
import type {
  AiChatClientContext,
  AiChatMessage,
  AiChatPageContext,
  ProductChatCard,
} from "./types";

const STORAGE_KEY = "afs_ai_chat_conversation_id";

function makeLocalMessageId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function buildAssistantMessage(response: {
  reply: string;
  intent?: string | null;
  cards?: ProductChatCard[];
  suggestedReplies?: string[];
  recommendation?: AiChatMessage["recommendation"];
}): AiChatMessage {
  return {
    id: makeLocalMessageId(),
    senderType: "ASSISTANT",
    content: response.reply,
    intent: response.intent ?? null,
    cards: response.cards ?? [],
    suggestedReplies: response.suggestedReplies ?? [],
    recommendation: response.recommendation ?? null,
    createdAt: new Date().toISOString(),
  };
}

function buildPageContext(pathname: string, search: string): AiChatPageContext | null {
  const url = `${pathname}${search}`;
  const productDetailMatch = /^\/products\/([^/]+)$/.exec(pathname);
  const orderDetailMatch = /^\/orders\/([^/]+)$/.exec(pathname);

  if (pathname === "/products") {
    return {
      type: "PRODUCT_LIST",
      url,
      productId: null,
      orderId: null,
    };
  }

  if (productDetailMatch?.[1]) {
    return {
      type: "PRODUCT_DETAIL",
      url,
      productId: productDetailMatch[1],
      orderId: null,
    };
  }

  if (pathname === "/checkout" || pathname.startsWith("/checkout/")) {
    return {
      type: "CHECKOUT",
      url,
      productId: null,
      orderId: null,
    };
  }

  if (pathname === "/orders/my") {
    return {
      type: "ORDER_LIST",
      url,
      productId: null,
      orderId: null,
    };
  }

  if (orderDetailMatch?.[1]) {
    return {
      type: "ORDER_DETAIL",
      url,
      productId: null,
      orderId: orderDetailMatch[1],
    };
  }

  if (pathname === "/profile" || pathname === "/profile/edit") {
    return {
      type: "PROFILE",
      url,
      productId: null,
      orderId: null,
    };
  }

  return null;
}

function buildClientContext(search: string): AiChatClientContext {
  return {
    currentFilters: Object.fromEntries(new URLSearchParams(search).entries()),
    visibleProductIds: [],
    selectedSize: null,
    selectedColor: null,
  };
}

function buildConversationStorageKey(page: AiChatPageContext) {
  const relatedId = page.productId || page.orderId || page.url || "general";
  return `${STORAGE_KEY}:${page.type}:${relatedId}`;
}

function ProductCardButton({ card, onOpen }: { card: ProductChatCard; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="mt-3 flex w-full gap-3 rounded-2xl border border-primary-100 bg-white p-3 text-left shadow-sm transition hover:border-primary-300 hover:shadow-medium"
    >
      <div className="h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-beige-100">
        {card.imageUrl ? (
          <img src={card.imageUrl} alt={card.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-primary-300">
            <Sparkles size={18} />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="line-clamp-2 text-sm font-semibold leading-5 text-primary-950">
          {card.name}
        </p>
        <p className="mt-1 text-sm font-semibold text-accent-700">
          {formatCurrency(card.price)}
        </p>
        {(card.availableSizes.length > 0 || card.availableColors.length > 0) && (
          <p className="mt-1 truncate text-xs text-primary-400">
            {[...card.availableSizes, ...card.availableColors].slice(0, 4).join(" / ")}
          </p>
        )}
      </div>
    </button>
  );
}

export default function AiChatWidget() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousContextKeyRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pageContext = useMemo(
    () => buildPageContext(location.pathname, location.search),
    [location.pathname, location.search],
  );
  const clientContext = useMemo(
    () => buildClientContext(location.search),
    [location.search],
  );
  const conversationStorageKey = useMemo(
    () => (pageContext ? buildConversationStorageKey(pageContext) : null),
    [pageContext],
  );
  const latestAssistantMessageId = useMemo(() => {
    return [...messages]
      .reverse()
      .find((message) => message.senderType === "ASSISTANT")?.id;
  }, [messages]);

  useEffect(() => {
    const currentPageType = pageContext?.type ?? null;

    if ((currentPageType === "PRODUCT_LIST" || currentPageType === "PRODUCT_DETAIL") &&
      previousContextKeyRef.current !== conversationStorageKey) {
      setIsOpen(true);
    }

    previousContextKeyRef.current = conversationStorageKey;
  }, [conversationStorageKey, pageContext?.type]);

  const startNewConversation = useCallback(async (context: AiChatPageContext) => {
    const response = await startAiChatConversation({
      channel: "WEB",
      page: context,
    });

    if (!response.data) {
      throw new Error(AI_CHAT_ERROR_MESSAGE);
    }

    localStorage.setItem(buildConversationStorageKey(context), response.data.conversationId);
    setConversationId(response.data.conversationId);
    setMessages([buildAssistantMessage(response.data)]);

    return response.data.conversationId;
  }, []);

  useEffect(() => {
    if (!pageContext || !conversationStorageKey) {
      return;
    }

    let ignore = false;
    const storageKey = conversationStorageKey;

    async function bootstrapChat() {
      if (!pageContext) {
        return;
      }

      setIsBootstrapping(true);
      setError(null);
      setConversationId(null);
      setMessages([]);

      try {
        const storedConversationId = localStorage.getItem(storageKey);

        if (storedConversationId) {
          const response = await getAiChatConversation(storedConversationId);

          if (!ignore && response.data) {
            setConversationId(response.data.conversationId);
            setMessages(response.data.messages);
            return;
          }

          localStorage.removeItem(storageKey);
        }

        if (!ignore) {
          await startNewConversation(pageContext);
        }
      } catch (chatError) {
        localStorage.removeItem(storageKey);

        if (!ignore) {
          setConversationId(null);
          setMessages([]);
          setError(getAiChatErrorMessage(chatError));
        }
      } finally {
        if (!ignore) {
          setIsBootstrapping(false);
        }
      }
    }

    void bootstrapChat();

    return () => {
      ignore = true;
    };
  }, [conversationStorageKey, pageContext, startNewConversation]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [isOpen, messages, isSending]);

  const ensureConversation = async () => {
    if (!pageContext) {
      throw new Error("Chat is not available on this page");
    }

    if (conversationId) {
      return conversationId;
    }

    return startNewConversation(pageContext);
  };

  const handleSendMessage = async (messageText: string) => {
    const safeMessage = messageText.trim();

    if (!safeMessage || isSending || !pageContext) {
      return;
    }

    const userMessage: AiChatMessage = {
      id: makeLocalMessageId(),
      senderType: "USER",
      content: safeMessage,
      createdAt: new Date().toISOString(),
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInputValue("");
    setIsSending(true);
    setError(null);

    try {
      const activeConversationId = await ensureConversation();
      const response = await sendAiChatMessage(activeConversationId, {
        message: safeMessage,
        page: pageContext,
        clientContext,
      });

      if (!response.data) {
        throw new Error(AI_CHAT_ERROR_MESSAGE);
      }

      const responseData = response.data;

      if (conversationStorageKey) {
        localStorage.setItem(conversationStorageKey, responseData.conversationId);
      }
      setConversationId(responseData.conversationId);
      setMessages((currentMessages) => [
        ...currentMessages,
        buildAssistantMessage(responseData),
      ]);
    } catch (chatError) {
      setError(getAiChatErrorMessage(chatError));
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: makeLocalMessageId(),
          senderType: "SYSTEM",
          content: AI_CHAT_ERROR_MESSAGE,
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSendMessage(inputValue);
  };

  const handleResetConversation = async () => {
    if (!pageContext || isBootstrapping) {
      return;
    }

    if (conversationStorageKey) {
      localStorage.removeItem(conversationStorageKey);
    }
    setConversationId(null);
    setMessages([]);
    setError(null);
    setIsBootstrapping(true);

    try {
      await startNewConversation(pageContext);
    } catch (chatError) {
      setError(getAiChatErrorMessage(chatError));
    } finally {
      setIsBootstrapping(false);
    }
  };

  const handleOpenProductCard = (card: ProductChatCard) => {
    if (/^https?:\/\//i.test(card.navigateUrl)) {
      window.location.assign(card.navigateUrl);
      return;
    }

    navigate(card.navigateUrl || `/products/${card.productId}`);
    setIsOpen(false);
  };

  if (!pageContext) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100vw-2rem)] max-w-[340px] flex-col items-end sm:bottom-5 sm:right-5">
      {isOpen && (
        <section className="mb-2 flex h-[min(560px,calc(100vh-6rem))] w-full flex-col overflow-hidden rounded-2xl border border-primary-100 bg-white shadow-[0_22px_70px_rgba(18,18,18,0.2)]">
          <header className="flex shrink-0 items-center justify-between border-b border-primary-100 bg-primary-950 px-3 py-2.5 text-white">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10">
                <Bot size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold">AI fashion assistant</h2>
                <p className="truncate text-xs text-white/65">
                  Product search, sizing, and order help
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={handleResetConversation}
                disabled={isBootstrapping || isSending}
                aria-label="Restart chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white disabled:opacity-40"
              >
                <RefreshCw size={15} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/75 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto bg-beige-50 px-3 py-3">
            {isBootstrapping && messages.length === 0 && (
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm text-primary-500 shadow-sm">
                <RefreshCw size={15} className="animate-spin" />
                Dang ket noi AI assistant...
              </div>
            )}

            {messages.length === 0 && !isBootstrapping && (
              <div className="rounded-2xl bg-white px-4 py-4 text-sm leading-6 text-primary-500 shadow-sm">
                Mo dau cuoc tro chuyen de tim san pham, hoi size, hoac xem huong dan don hang.
              </div>
            )}

            <div className="space-y-4">
              {messages.map((message) => {
                const isUser = message.senderType === "USER";
                const isSystem = message.senderType === "SYSTEM";

                return (
                  <div
                    key={message.id ?? `${message.senderType}-${message.createdAt}-${message.content}`}
                    className={isUser ? "flex justify-end" : "flex justify-start"}
                  >
                    <div className={isUser ? "max-w-[84%]" : "max-w-[92%]"}>
                      <div className="mb-1 flex items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-primary-400">
                        {isUser ? <UserRound size={12} /> : <Bot size={12} />}
                        {isUser ? "You" : isSystem ? "System" : "Assistant"}
                      </div>
                      <div
                        className={[
                          "rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm",
                          isUser
                            ? "bg-primary-950 text-white"
                            : isSystem
                              ? "bg-error-50 text-error-700"
                              : "border border-primary-100 bg-white text-primary-700",
                        ].join(" ")}
                      >
                        <p className="whitespace-pre-wrap break-words">{message.content}</p>

                        {message.recommendation && (
                          <div className="mt-3 rounded-2xl bg-accent-50 p-3 text-primary-800">
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-xs font-semibold uppercase tracking-wider text-primary-400">
                                Size de xuat
                              </span>
                              <span className="rounded-full bg-primary-950 px-3 py-1 text-sm font-semibold text-white">
                                {message.recommendation.size}
                              </span>
                            </div>
                            <p className="mt-2 text-xs leading-5 text-primary-600">
                              Do tin cay: {Math.round(message.recommendation.confidence * 100)}%
                            </p>
                            {message.recommendation.reason && (
                              <p className="mt-1 text-xs leading-5 text-primary-600">
                                {message.recommendation.reason}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {!isUser &&
                        message.cards?.map((card) => (
                          <ProductCardButton
                            key={`${message.id}-${card.productId}`}
                            card={card}
                            onOpen={() => handleOpenProductCard(card)}
                          />
                        ))}

                      {!isUser &&
                        message.id === latestAssistantMessageId &&
                        message.suggestedReplies &&
                        message.suggestedReplies.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.suggestedReplies.map((reply) => (
                              <button
                                key={reply}
                                type="button"
                                disabled={isSending}
                                onClick={() => handleSendMessage(reply)}
                                className="rounded-full border border-primary-200 bg-white px-3 py-2 text-xs font-semibold text-primary-700 transition hover:border-primary-900 hover:text-primary-950 disabled:opacity-50"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  </div>
                );
              })}
              {isSending && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-primary-100 bg-white px-4 py-3 text-sm text-primary-500 shadow-sm">
                    <span className="inline-flex items-center gap-2">
                      <RefreshCw size={14} className="animate-spin" />
                      Dang suy nghi...
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {error && (
            <div className="border-t border-warning-100 bg-warning-50 px-4 py-2 text-xs leading-5 text-warning-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex shrink-0 gap-2 border-t border-primary-100 bg-white p-2.5">
            <label className="min-w-0 flex-1">
              <span className="sr-only">Chat message</span>
              <input
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                placeholder="Nhap tin nhan..."
                disabled={isSending}
                className="h-10 w-full rounded-full border border-primary-100 bg-beige-50 px-3.5 text-sm text-primary-900 outline-none transition placeholder:text-primary-300 focus:border-primary-900 focus:bg-white focus:ring-2 focus:ring-primary-100 disabled:opacity-60"
              />
            </label>
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-950 text-white transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Send size={17} />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label={isOpen ? "Collapse chat" : "Open chat"}
        className="flex h-12 min-w-12 items-center justify-center gap-2 rounded-full bg-primary-950 px-3.5 text-sm font-semibold text-white shadow-[0_14px_36px_rgba(18,18,18,0.25)] transition hover:bg-primary-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400 focus-visible:ring-offset-2"
      >
        {isOpen ? <ChevronDown size={20} /> : <MessageCircle size={20} />}
        <span className="hidden sm:inline">AI chat</span>
      </button>
    </div>
  );
}
