import { useState } from 'react'
import { CourseType } from '../../../../../models/course'
import {
	useAdminCreateProduct,
	useAdminCustomPost,
} from 'medusa-react'
import {
	CreateCourseRequest,
	CreateCourseResponse,
} from "../../../../../types/course"
import {
	Button,
	Container,
	Input,
	Label,
	Select,
} from "@medusajs/ui"
import { RouteProps } from "@medusajs/admin-ui"
import { useNavigate } from "react-router-dom"

const CourseCreateForm = ({
	notify,
}: RouteProps) => {
	const [productName, setProductName] = useState("")
	const [
		productVariantName,
		setProductVariantName,
	] = useState("")
	const [name, setName] = useState("")
	const [type, setType] = useState("online")
	const [course_key, setCourseKey] = useState("")

	const createProduct = useAdminCreateProduct()
	const {
		mutate: createDigitalProduct,
		isLoading,
	} = useAdminCustomPost<
		CreateCourseRequest,
		CreateCourseResponse
	>(
		"/course",
		["course"]
	)

	const navigate = useNavigate()

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault()

		createProduct.mutate({
			title: productName,
			is_giftcard: false,
			discountable: false,
			options: [
				{
					title: "Course",
				},
			],
			variants: [
				{
					title: productVariantName,
					options: [
						{
							value: name, // can also be the file name
						},
					],
					// for simplicity, prices are omitted from form.
					// Those can be edited from the product's page.
					prices: [],
				},
			],
		}, {
			onSuccess: ({ product }) => {
				// create the course
				createDigitalProduct({
					variant_id: product.variants[0].id,
					name,
					course_key,
					type: type as CourseType,
				}, {
					onSuccess: () => {
						notify.success(
							"Success",
							"Course Created Successfully"
						)
						navigate("/a/course")
					},
				})
			}
		})
	}

return (
	<Container>
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4"
		>
			<div className="flex gap-4 items-center">
				<Label>Product Name</Label>
				<Input
					type="text"
					placeholder="Product Name"
					value={productName}
					onChange={(e) => setProductName(e.target.value)}
				/>
			</div>
			<div className="flex gap-4 items-center">
				<Label>Product Variant Name</Label>
				<Input
					type="text"
					placeholder="Product Variant"
					value={productVariantName}
					onChange={(e) =>
						setProductVariantName(e.target.value)
					}
				/>
			</div>
			<div className="flex gap-4 items-center">
				<Label>Course Name</Label>
				<Input
					type="text"
					placeholder="Media Name"
					value={name}
					onChange={(e) => setName(e.target.value)}
				/>
			</div>
			<div className="flex gap-4 items-center">
				<Label>Type</Label>
				<Select onValueChange={setType} value={type}>
					<Select.Trigger>
						<Select.Value placeholder="Type" />
					</Select.Trigger>
					<Select.Content className="z-50">
						<Select.Item value={"online"}>
							Online
						</Select.Item>
						<Select.Item value={"preview"}>
							Preview
						</Select.Item>
					</Select.Content>
				</Select>
			</div>
			<div className="flex gap-4 items-center">
				<Label>Course Key</Label>
				<Input
					type="text"
					placeholder="Course key"
					value={course_key}
					onChange={(e) => setCourseKey(e.target.value)}
				/>
			</div>
			<Button
				variant="primary"
				type="submit"
				isLoading={
					createProduct.isLoading ||
					isLoading
				}>
				Create
			</Button>
		</form>
	</Container>
	)
}

export default CourseCreateForm