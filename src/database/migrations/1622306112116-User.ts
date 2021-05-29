import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class User1621881973706 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const table = new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'varchar',
                    length: '255',
                    generationStrategy: 'uuid',
                    default: 'uuid_generate_v4()',
                    isPrimary: true,
                    isNullable: false
                }, {
                    name: 'account_id',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: true
                }, {
                    name: 'name',
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false
                }, {
                    name: 'email',
                    isUnique: true,
                    type: 'varchar',
                    length: '255',
                    isPrimary: false,
                    isNullable: false
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255',
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

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable('users');
    }


}
