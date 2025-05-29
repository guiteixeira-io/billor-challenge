import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1712345678900 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE drivers (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL
            );

            CREATE TABLE loads (
                id SERIAL PRIMARY KEY,
                origin VARCHAR(255),
                destination VARCHAR(255),
                price DECIMAL,
                eta TIMESTAMP
            );

            CREATE TABLE summaries (
                id SERIAL PRIMARY KEY,
                load_id INT REFERENCES loads(id),
                resumo TEXT,
                criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE summaries`);
        await queryRunner.query(`DROP TABLE loads`);
        await queryRunner.query(`DROP TABLE drivers`);
    }
}