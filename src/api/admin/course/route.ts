import type { 
  MedusaRequest, 
  MedusaResponse,
} from "@medusajs/medusa"
import CourseService 
  from "../../../services/course"
	import { CourseType } from "../../../models/course"

export const GET = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  const courseService = req.scope.resolve<
	CourseService
  >("courseService")
  // omitting pagination for simplicity
  const [courses, count] = await courseService
    .listAndCount({
      type: CourseType.ONLINE,
    }, {
      relations: ["variant"],
    }
  )

  res.json({
    courses: courses,
    count,
  })
}

export const POST = async (
  req: MedusaRequest, 
  res: MedusaResponse
) => {
  // validation omitted for simplicity
  const {
    variant_id,
    course_key,
    type = "online",
    name,
  } = req.body

  const courseService = req.scope.resolve<
    CourseService
  >("courseService")
  const course = await courseService.create({
    variant_id,
    course_key,
    type,
    name,
  })

  res.json({
    course: course,
  })
}