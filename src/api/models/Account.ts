import {IsNotEmpty, IsNumber, IsNumberString, Length} from "class-validator";
import {
	AfterLoad,
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from 'typeorm';
import {DailyInboundYield} from "./DailyInboundYield";

import {User} from './User';

@Entity('accounts')
export class Account {

	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@IsNotEmpty()
	@IsNumberString({no_symbols: true})
	@Length(8, 8)
	@Column({name: 'account_number'})
	public accountNumber: string;

	@IsNotEmpty()
	@IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4})
	@Column('numeric', {precision: 19, scale: 4})
	public balance: number;

	@OneToOne(() => User, user => user.accountId)
	public user: User;

	@OneToMany(type => DailyInboundYield, dailyInboundYield => dailyInboundYield.account)
	public dailyInboundYields: DailyInboundYield[];

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
		return `${this.accountNumber} - $${this.balance}`;
	}

	@AfterLoad() _convertNumerics() {
		this.balance = parseFloat(this.balance as any);
	}
}
