import {MigrationInterface, QueryRunner, TableForeignKey} from "typeorm";

export class AddAccountRelationToUser1622312897035 implements MigrationInterface {
    private tableForeignKey = new TableForeignKey({
        name: 'fk_accounts_users',
        columnNames: ['account_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'accounts',
        onDelete: 'CASCADE',
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createForeignKey('users', this.tableForeignKey);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropForeignKey('users', this.tableForeignKey);
    }

}
