import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import {IsNotEmpty, IsNumber, IsNumberString, Length} from "class-validator";

export enum TransactionType {
    deposit = 'deposit',
    withdraw = 'withdraw',
    payment = 'payment'
}

@Entity('transactions')
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @IsNotEmpty()
    @IsNumberString({no_symbols: true})
    @Length(8, 8)
    @Column({name: 'source_account_number'})
    public sourceAccountNumber: string;


    @IsNumberString({no_symbols: true})
    @Length(8, 8)
    @Column({name: 'target_account_number'})
    public targetAccountNumber: string;

    @IsNotEmpty()
    @IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4})
    @Column('numeric', {precision: 19, scale: 4})
    public amount: number;

    @IsNotEmpty()
    @Column({type: 'enum', enum: TransactionType})
    public type: TransactionType

    @CreateDateColumn({name: 'created_at'})
    createdAt!: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt!: Date;

    @BeforeInsert()

    public setCreateDate(): void {
        this.createdAt = new Date();
    }

    @BeforeUpdate()
    public setUpdateDate(): void {
        this.updatedAt = new Date();
    }

    public toString(): string {
        return `$${this.amount} - ${this.type}`;
    }
}
