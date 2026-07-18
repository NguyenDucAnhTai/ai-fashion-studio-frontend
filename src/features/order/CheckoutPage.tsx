import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard } from "lucide-react";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../shared/components/Button";
import Container from "../../shared/components/Container";
import ErrorState from "../../shared/components/ErrorState";
import Input from "../../shared/components/Input";
import Loading from "../../shared/components/Loading";
import Textarea from "../../shared/components/Textarea";
import { DESIGN_STATUS } from "../../shared/constants/designStatus";
import { formatCurrency } from "../../shared/utils/formatCurrency";
import { useAuthStore } from "../auth/authStore";
import { useProductDetailQuery } from "../catalog/api";
import DesignPreview from "../design/DesignPreview";
import { useDesignDetailQuery } from "../design/api";
import {
  MISSING_CUSTOMER_MESSAGE,
  getOrderErrorMessage,
  useCreateOrderMutation,
} from "./api";
import {
  createCheckoutSchema,
  type CheckoutFormValues,
  type CheckoutInputValues,
} from "./schemas";

interface CheckoutLocationState {
  productId?: string;
  productVariantId?: string;
}

export default function CheckoutPage() {
  const { designId = "" } = useParams();
  const location = useLocation();
  const checkoutState = (location.state ?? null) as CheckoutLocationState | null;
  const navigate = useNavigate();
  const designQuery = useDesignDetailQuery(designId);
  const design = designQuery.data?.data;
  const userId = useAuthStore((state) => state.currentUser?.id ?? "");
  const productId = design?.productId ?? checkoutState?.productId ?? "";
  const productVariantId =
    design?.productVariantId ?? checkoutState?.productVariantId ?? "";
  const productQuery = useProductDetailQuery(productId);
  const product = productQuery.data?.data;
  const variant = useMemo(() => {
    return (
      product?.variants.find((item) => item.id === productVariantId) ?? null
    );
  }, [productVariantId, product?.variants]);
  const createOrder = useCreateOrderMutation(userId);
  const maxQuantity = Math.max(variant?.availableQuantity ?? 1, 1);
  const checkoutSchema = useMemo(() => createCheckoutSchema(maxQuantity), [maxQuantity]);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutInputValues, unknown, CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur",
    defaultValues: { receiverName: "", receiverPhone: "", shippingAddress: "", quantity: 1 },
  });
  const quantityValue = useWatch({ control, name: "quantity" });
  const quantity = Number(quantityValue || 1);
  const totalAmount = product && variant ? (product.basePrice + variant.priceAdjustment) * quantity : 0;
  const missingProductOrVariant = !productId || !productVariantId || (!variant && !productQuery.isLoading);
  const designMustBeSaved = Boolean(design && design.status !== DESIGN_STATUS.saved);

  const buildOrderDescription = (itemQuantity: number) => {
    const variantParts = [variant?.size, variant?.color, variant?.material]
      .filter(Boolean)
      .join(" / ");
    const designText = design?.name ? ` with design "${design.name}"` : "";
    const variantText = variantParts ? ` - ${variantParts}` : "";

    return `${itemQuantity} x ${product?.name ?? "Product"}${variantText}${designText}`;
  };

  const onSubmit = (values: CheckoutFormValues) => {
    if (!product || !variant || !userId) {
      return;
    }

    const orderItem = {
      productId: product.id,
      productVariantId: variant.id,
      ...(designId ? { designId } : {}),
      quantity: values.quantity,
    };

    createOrder.mutate(
      {
        items: [orderItem],
        Description: buildOrderDescription(values.quantity),
        receiverName: values.receiverName,
        receiverPhone: values.receiverPhone,
        shippingAddress: values.shippingAddress,
      },
      {
        onSuccess: (response) => {
          if (response.data?.orderId) {
            navigate("/orders/my", {
              state: {
                createdOrderId: response.data.orderId,
                message:
                  "Order created successfully. Please select the order to continue payment.",
              },
            });
          }
        },
      },
    );
  };

  if (designQuery.isLoading || productQuery.isLoading) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Loading label="Preparing checkout..." />
      </section>
    );
  }

  if (missingProductOrVariant || !product || !variant) {
    return (
      <section className="min-h-screen bg-beige-50 pt-28 pb-20">
        <Container>
          <ErrorState
            title="Checkout unavailable"
            description="Missing product or variant for checkout."
          />
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-beige-50 pt-28 pb-20 lg:pt-32">
      <Container>
        <div className="mb-8">
          <p className="text-sm font-semibold text-accent-600">Checkout</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-primary-950">
            {design ? "Confirm order from saved design" : "Confirm product order"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">
            {design
              ? "Orders use the saved design file. A draft must be saved before checkout so backend can lock it after payment."
              : "Review the selected product and shipping information. Creating this order calls the Orders API directly."}
          </p>
        </div>

        {designMustBeSaved && (
          <div className="mb-6 rounded-2xl border border-warning-500/20 bg-warning-50 px-4 py-3 text-sm text-warning-700">
            Only SAVED designs can be checked out. Return to the editor and save this design first.
          </div>
        )}

        {!userId && (
          <div className="mb-6 rounded-2xl border border-error-500/20 bg-error-50 px-4 py-3 text-sm text-error-700">
            {MISSING_CUSTOMER_MESSAGE}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_430px]">
          <div className="rounded-3xl border border-primary-100 bg-white p-5 shadow-soft">
            <DesignPreview
              imageUrl={design?.previewImageUrl ?? product.thumbnailUrl}
              name={design?.name ?? product.name}
              className="min-h-[440px]"
            />
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-beige-50 p-4">
                <p className="text-xs text-primary-400">Product</p>
                <p className="mt-1 text-sm font-semibold text-primary-950">{product.name}</p>
              </div>
              <div className="rounded-2xl bg-beige-50 p-4">
                <p className="text-xs text-primary-400">Variant</p>
                <p className="mt-1 text-sm font-semibold text-primary-950">{variant.size} / {variant.color}</p>
              </div>
              <div className="rounded-2xl bg-beige-50 p-4">
                <p className="text-xs text-primary-400">Material</p>
                <p className="mt-1 text-sm font-semibold text-primary-950">{variant.material}</p>
              </div>
            </div>
          </div>

          <form className="rounded-3xl border border-primary-100 bg-white p-6 shadow-soft" onSubmit={handleSubmit(onSubmit)} noValidate>
            <h2 className="text-lg font-semibold text-primary-950">Shipping information</h2>
            <div className="mt-5 space-y-4">
              <Input label="Receiver name" error={errors.receiverName?.message} {...register("receiverName")} />
              <Input label="Receiver phone" error={errors.receiverPhone?.message} {...register("receiverPhone")} />
              <Textarea label="Shipping address" error={errors.shippingAddress?.message} {...register("shippingAddress")} />
              <Input
                label="Quantity"
                type="number"
                min={1}
                max={maxQuantity}
                error={errors.quantity?.message}
                {...register("quantity")}
              />
            </div>

            <div className="mt-6 rounded-2xl bg-beige-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-primary-500">Unit price</span>
                <span className="font-semibold text-primary-950">{formatCurrency(product.basePrice + variant.priceAdjustment)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-primary-100 pt-3">
                <span className="text-sm font-semibold text-primary-950">Total</span>
                <span className="text-2xl font-semibold text-primary-950">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {createOrder.isError && (
              <p className="mt-4 rounded-2xl bg-error-50 px-4 py-3 text-sm text-error-700">
                {getOrderErrorMessage(createOrder.error)}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              className="mt-6 w-full"
              disabled={designMustBeSaved || missingProductOrVariant || !userId}
              loading={createOrder.isPending}
            >
              <CreditCard size={17} />
              {createOrder.isPending ? "Creating order..." : "Mua hàng"}
            </Button>
          </form>
        </div>
      </Container>
    </section>
  );
}
