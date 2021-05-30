import {IsNotEmpty, IsNumber} from "class-validator";
import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn
} from "typeorm";
import {Account} from "./Account";

@Entity('daily_inbound_yields')
export class DailyInboundYield {
	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@Column({
		name: 'account_id',
		nullable: true
	})
	public accountId: string;

	@OneToOne(type => Account, account => account.id)
	@JoinColumn({name: 'account_id'})
	public account: Account;

	@IsNotEmpty()
	@IsNumber({allowNaN: false, allowInfinity: false, maxDecimalPlaces: 4})
	@Column('numeric', {precision: 19, scale: 4})
	public amount: number;

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
		return `${this.amount} - (${this.accountId})`;
	}
}
