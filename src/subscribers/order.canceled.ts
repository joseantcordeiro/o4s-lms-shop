class OrderCanceledSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe(
      "order.canceled", 
      "trigger-event"
    )
  }
  // ...
}

export default OrderCanceledSubscriber