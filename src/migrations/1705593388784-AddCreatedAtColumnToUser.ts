import type {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreatedAtColumnToUser1705593388784 implements MigrationInterface {
    name = 'AddCreatedAtColumnToUser1705593388784'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "created_at" TIMESTAMP NOT NULL DEFAULT ('now'::text)::timestamp(6) with time zone`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "created_at"`);
    }

}
