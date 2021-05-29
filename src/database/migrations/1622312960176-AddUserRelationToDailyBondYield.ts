import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class AddUserRelationToDailyBondYield1622312960176 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: 'fk_users_daily_bonds_yields',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey('daily_inbound_yields', this.tableForeignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('daily_inbound_yields', this.tableForeignKey);
    }

}
