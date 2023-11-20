class OrderRefundCreatedSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe(
      "order.refund_created", 
      "trigger-event"
    )
  }
  // ...
}

export default OrderRefundCreatedSubscriber