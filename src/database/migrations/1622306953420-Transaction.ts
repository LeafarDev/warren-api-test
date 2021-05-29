import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Transactions1622306953420 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const table = new Table({
            name: 'transactions',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    length: '255',
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                    isPrimary: true,
                    isNullable: false
                },
                {
                    name: 'source_account_number',
                    type: 'varchar',
                    length: '8',
                    isPrimary: false,
                    isNullable: false
                },
                {
                    name: 'target_account_number',
                    type: 'varchar',
                    length: '8',
                    isPrimary: false,
                    isNullable: true
                },
                {
                    name: 'amount',
                    type: 'numeric(19, 4)',
                    isPrimary: false,
                    isNullable: false
                },
                {
                    name: 'type',
                    type: 'enum',
                    enum: ['deposit', 'withdraw', 'payment']
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    isNullable: false
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    isNullable: true
                }
            ]
        });
        await queryRunner.createTable(table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('transactions');
    }

}
