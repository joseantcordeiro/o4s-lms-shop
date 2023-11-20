class OrderPlacedSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe(
      "order.placed", 
      "trigger-event"
    )
  }
  // ...
}

export default OrderPlacedSubscriber