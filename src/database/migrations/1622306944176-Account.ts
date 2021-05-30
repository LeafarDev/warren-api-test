import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class Accounts1622306944176 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		const table = new Table({
			name: 'accounts',
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
					name: 'account_number',
					isUnique: true,
					type: 'varchar',
					length: '8',
					isPrimary: false,
					isNullable: false
				},
				{
					name: 'balance',
					type: 'numeric(19, 4)',
					default: '0',
					isPrimary: false,
					isNullable: false
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
		await queryRunner.dropTable('accounts');
	}

}
