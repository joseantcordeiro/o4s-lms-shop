class OrderCompletedSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe(
      "order.completed", 
      "trigger-event"
    )
  }
  // ...
}

export default OrderCompletedSubscriber