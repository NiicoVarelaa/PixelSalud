export function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    paymentId: params.get("payment_id") || null,
    status: params.get("status") || null,
    externalReference: params.get("external_reference") || null,
    merchantOrderId: params.get("merchant_order_id") || null,
  };
}
