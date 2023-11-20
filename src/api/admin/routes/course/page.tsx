import { RouteConfig } from '@medusajs/admin'
import { DocumentText } from '@medusajs/icons'
import { useAdminCustomQuery } from 'medusa-react'
import { 
  ListCoursesRequest, 
  ListCoursesResponse,
} from '../../../../types/course'
import { 
  Button, 
  Container, 
  Drawer, 
  Heading, 
  Table,
} from '@medusajs/ui'
import { Link } from 'react-router-dom'
import { RouteProps } from '@medusajs/admin-ui'
import CourseCreateForm 
  from '../../components/course/CreateForm'

const CourseListPage = (props: RouteProps) => {
  const { data, isLoading } = useAdminCustomQuery<
    ListCoursesRequest, 
    ListCoursesResponse
  >(
    "/course",
    ["course"]
  )

  return (
    <Container>
      <div className="flex justify-between mb-4">
        <Heading level="h1">Courses</Heading>
        <Drawer>
          <Drawer.Trigger>
            <Button>Create</Button>
          </Drawer.Trigger>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>
                Create Course
              </Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <CourseCreateForm {...props} />
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </div>
      {isLoading && <div>Loading...</div>}
      {data && !data.courses.length && (
        <div>No Courses</div>
      )}
      {data && data.courses.length > 0 && (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Product</Table.HeaderCell>
              <Table.HeaderCell>
							Product Variant
              </Table.HeaderCell>
              <Table.HeaderCell>Course Key</Table.HeaderCell>
              <Table.HeaderCell>Action</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.courses.map((course) => (
              <Table.Row key={course.id}>
                <Table.Cell>
                  {course.variant.product.title}
                </Table.Cell>
                <Table.Cell>
                  {course.variant.title}
                </Table.Cell>
                <Table.Cell>
                  {course.course_key}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/a/products/${
                    course.variant.product_id
                  }`}>
                    View Product
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config: RouteConfig = {
  link: {
    label: "Courses",
    icon: DocumentText,
  },
}

export default CourseListPage