import { 
  AbstractNotificationService, 
  OrderService,
} from '@medusajs/medusa'
import { EntityManager } from 'typeorm'
import { TriggerClient } from '@trigger.dev/sdk'

export const client = new TriggerClient({
  id: process.env.TRIGGER_API_ID!,
  apiKey: process.env.TRIGGER_API_KEY!,
  apiUrl: process.env.TRIGGER_API_URL!,
})

class TriggerEventService extends AbstractNotificationService {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager
	static identifier = "trigger-event"
	protected orderService: OrderService

	constructor(container, options) {
    super(container)
    // you can access options here in case you're
    // using a plugin

    this.orderService = container.orderService
  }

  async sendNotification(
    event: string,
    data: any,
    attachmentGenerator: unknown
  ): Promise<{ 
      to: string; 
      status: string; 
      data: Record<string, unknown>; 
    }> {
    if (event.startsWith("order")) {
      // retrieve order
      const order = await this.orderService.retrieve(data.id)

      const triggerEvent = await client.sendEvent({
				name: "medusa.order",
				payload: {
					event: event,
					to: order.email,
					orderId: order.id,
				}
			})

      console.log(`Event ${event} ID: ${triggerEvent.id} sent`)

      return {
        to: order.email,
        status: "done",
        data: {
					event: event,
					orderId: order.id,
					triggerEventId: triggerEvent.id,
        },
      }
    }
  }
  async resendNotification(
    notification: any,
    config: any,
    attachmentGenerator: unknown
  ): Promise<{ 
      to: string; 
      status: string; 
      data: Record<string, unknown>; 
    }> {
    // check if the receiver should be changed
    const to: string = config.to ? config.to : notification.to

    // TODO resend the notification using the same data
    // that is saved under notification.data

		//const event = await client.getEvent(notification.data.eventId)
		//switch (event.runs.status) {
		//}
		const triggerEvent = await client.sendEvent({
			name: "medusa.order",
			payload: {
				event: notification.data.event,
				to: to,
				orderId: notification.data.orderId,
			}
		})

		console.log(`Event ${notification.data.event} ID: ${notification.data.triggerEventId} resent with event ID: ${triggerEvent.id}`)

    return {
      to,
      status: "done",
      data: {
				event: notification.data.event,
				orderId: notification.data.orderId,
				triggerEventId: triggerEvent.id,
			}, // make changes to the data
    }
  }

}

export default TriggerEventService