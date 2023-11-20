class OrderUpdatedSubscriber {
  constructor({ notificationService }) {
    notificationService.subscribe(
			"order.updated",
      "trigger-event"
    )
  }
  // ...
}

export default OrderUpdatedSubscriber