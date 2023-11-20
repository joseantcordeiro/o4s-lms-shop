class OrderPaymentCapturedFailedSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe(
      "order.payment_capture_failed", 
      "trigger-event"
    )
  }
  // ...
}

export default OrderPaymentCapturedFailedSubscriber