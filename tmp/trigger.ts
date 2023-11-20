import { TriggerClient } from '@trigger.dev/sdk'

export const client = new TriggerClient({
  id: process.env.TRIGGER_API_ID!,
  apiKey: process.env.TRIGGER_API_KEY!,
  apiUrl: process.env.TRIGGER_API_URL!,
})

class NewOrderEvent {
  constructor({ 
    eventBusService,
  }) {

    eventBusService.subscribe("order.placed", this.newOrder)
  }

  newOrder = async (data) => {
		await client.sendEvent({
			name: "medusa.new.order",
			payload: { orderId: data.id }
		});
  }
}

export default NewOrderEvent