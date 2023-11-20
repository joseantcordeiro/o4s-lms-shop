import { 
  FindConfig,
  ProductVariantService,
  Selector,
  TransactionBaseService,
  buildQuery,
} from "@medusajs/medusa"
import { Course } from "../models/course"
import { MedusaError } from "@medusajs/utils"

type InjectedDependencies = {
  productVariantService: ProductVariantService
}

class CourseService extends TransactionBaseService {
  protected productVariantService_: ProductVariantService

  constructor(container: InjectedDependencies) {
    super(container)
    this.productVariantService_ = 
      container.productVariantService
  }

  private checkVariantInRelations(
    relations: string[]
  ): [string[], boolean] {
    const variantsRelationIndex = relations.indexOf("variant")
    const isVariantsEnabled = variantsRelationIndex !== -1
    if (isVariantsEnabled) {
      relations.splice(variantsRelationIndex, 1)
    }

    return [relations, isVariantsEnabled]
  }

  async listAndCount(
    selector?: Selector<Course>,
    config: FindConfig<Course> = {
      skip: 0,
      take: 20,
      relations: [],
    }
  ): Promise<[Course[], number]> {
    const courseRepo = this.activeManager_.getRepository(
      Course
    )

    const [
      relations,
      isVariantsEnabled,
    ] = this.checkVariantInRelations(
      config.relations || []
    )

    config.relations = relations

    const query = buildQuery(selector, config)

    const [
      courses,
      count,
    ] = await courseRepo.findAndCount(query)

    if (isVariantsEnabled) {
      // retrieve course variants
      await Promise.all(courses.map(
        async (course, index) => {
          courses[index].variant = 
            await this.retrieveVariantByCourse(course)
        }))
    }

    return [courses, count]
  }
  
  async list(
    selector?: Selector<Course>,
    config: FindConfig<Course> = {
      skip: 0,
      take: 20,
      relations: [],
    }
  ): Promise<Course[]> {
    const [courses] = await this.listAndCount(
        selector, config
      )

    return courses
  }

  async retrieve(
    id: string,
    config?: FindConfig<Course>
  ): Promise<Course> {
    const courseRepo = this.activeManager_.getRepository(
      Course
    )

    const query = buildQuery({
      id,
    }, config)

    const course = await courseRepo.findOne(query)

    if (!course) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "Course was not found"
      )
    }

    if (config.relations.includes("variant")) {
      course.variant = await this.retrieveVariantByCourse(
        course
      )
    }

    return course
  }

  async retrieveVariantByCourse(course: Course) {
    return await this.productVariantService_.retrieve(
      course.variant_id,
      {
        relations: ["product"],
      }
    )
  }

  async create(
    data: Pick<
      Course, 
      "name" | "course_key" | "variant_id" | "type"
    >
  ): Promise<Course> {
    return this.atomicPhase_(async (manager) => {
      const courseRepo = manager.getRepository(
        Course
      )
      const course = courseRepo.create(data)
      const result = await courseRepo.save(course)

      return result
    })
  }

  async update(
    id: string,
    data: Omit<Partial<Course>, "id">
  ): Promise<Course> {
    return await this.atomicPhase_(async (manager) => {
      const courseRepo = manager.getRepository(
        Course
      )
      const course = await this.retrieve(id)

      Object.assign(course, data)

      return await courseRepo.save(course)
    })
  }

  async delete(id: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const courseRepo = manager.getRepository(
        Course
      )
      const course = await this.retrieve(id)
      
      await courseRepo.remove([course])
    })
  }
}

export default CourseService