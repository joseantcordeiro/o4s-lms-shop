import { 
  CourseType, 
  Course, 
} from "../models/course"

export type ListCoursesRequest = {
  // no expected parameters
};

export type ListCoursesResponse = {
  courses: Course[]
  count: number
};

export type CreateCourseRequest = {
  variant_id: string
  name: string
  course_key: string
  type?: CourseType
};

export type CreateCourseResponse = {
  course: Course
};