class OrderRefundCreatedFailedSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe(
      "order.refund_failed", 
      "trigger-event"
    )
  }
  // ...
}

export default OrderRefundCreatedFailedSubscriber