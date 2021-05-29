import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class AddAccountRelationToDailyBondYield1622312960176 implements MigrationInterface {
	private tableForeignKey = new TableForeignKey({
		name: 'fk_accounts_daily_bonds_yields',
		columnNames: ['account_id'],
		referencedColumnNames: ['id'],
		referencedTableName: 'accounts',
		onDelete: 'CASCADE'
	});

	public async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.createForeignKey('daily_inbound_yields', this.tableForeignKey);
	}

	public async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.dropForeignKey('daily_inbound_yields', this.tableForeignKey);
	}

}
