import { 
  BeforeInsert, 
  Column, 
  Entity,
} from 'typeorm'
import { BaseEntity, ProductVariant } from '@medusajs/medusa'
import { generateEntityId } from '@medusajs/medusa/dist/utils'

export enum CourseType {
  ONLINE = "online",
  PREVIEW = "preview"
}

@Entity()
export class Course extends BaseEntity {
  @Column({ type: "varchar" })
  name: string

	@Column ({ type: "enum", enum: CourseType, default: "online" })
  type: CourseType

  @Column({ type: "varchar" })
  course_key: string

  @Column({ type: "varchar" })
  variant_id: string

  variant?: ProductVariant

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "course")
  }
}