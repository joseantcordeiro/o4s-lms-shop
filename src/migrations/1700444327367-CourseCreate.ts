import { MigrationInterface, QueryRunner } from "typeorm"

export class CourseCreate1700444327367 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(`CREATE TYPE "public"."course_type_enum" AS ENUM('online', 'preview')`)
      await queryRunner.query(`CREATE TABLE "course" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "type" "public"."course_type_enum" NOT NULL DEFAULT 'online', "course_key" character varying NOT NULL, "variant_id" character varying NOT NULL, CONSTRAINT "PK_09d4639de8082a32aa27f3ac9a6" PRIMARY KEY ("id"))`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
			await queryRunner.query(`DROP TABLE "course"`)
      await queryRunner.query(`DROP TYPE "public"."course_type_enum"`)
    }

}
