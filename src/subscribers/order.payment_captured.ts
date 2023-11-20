class OrderPaymentCapturedSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe(
      "order.payment_captured", 
      "trigger-event"
    )
  }
  // ...
}

export default OrderPaymentCapturedSubscriber