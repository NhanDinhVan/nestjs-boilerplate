import { MigrationInterface, QueryRunner } from 'typeorm'

export class CreateUsersTable1777738982218 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "users"
            (
                "id"            uuid                      NOT NULL DEFAULT uuid_generate_v4(),
                "first_name"    varchar                   NOT NULL,
                "last_name"     varchar                   NOT NULL,
                "email"         varchar                   NOT NULL,
                "password"      varchar                   NOT NULL,
                "day_of_birth"  timestamp with time zone  NULL,
                "created_at"    timestamp with time zone  NULL,
                "updated_at"    timestamp with time zone  NULL,

                CONSTRAINT "PK_users" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_users_email" UNIQUE ("email")
            )
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "users"`)
    }
}
