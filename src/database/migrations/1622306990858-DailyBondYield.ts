import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class DailyBondYield1622306990858 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'daily_inbound_yields',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    length: '255',
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                    isPrimary: true,
                    isNullable: false,
                },
                {
                    name: 'user_id',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: true,
                },
                {
                    name: 'amount',
                    type: 'numeric(19, 4)',
                    isPrimary: false,
                    isNullable: false,
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: false,
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true,
                }
            ],
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('daily_inbound_yields')
    }

}
