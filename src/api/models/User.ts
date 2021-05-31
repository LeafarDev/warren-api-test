import * as bcrypt from 'bcrypt';
import {Exclude} from 'class-transformer';
import {IsEmail, IsNotEmpty} from 'class-validator';
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
} from 'typeorm';

import {Account} from './Account';

@Entity('users')
export class User {

	public static hashPassword(password: string): Promise<string> {
		return new Promise((resolve, reject) => {
			bcrypt.hash(password, 10, (err, hash) => {
				if (err) {
					return reject(err);
				}
				resolve(hash);
			});
		});
	}

	@PrimaryGeneratedColumn('uuid')
	public id: string;

	@IsNotEmpty()
	@Column({name: 'name'})
	public name: string;

	@IsNotEmpty()
	@IsEmail()
	@Column()
	public email: string;

	@IsNotEmpty()
	@Column()
	@Exclude()
	public password: string;

	@Column({
		name: 'account_id',
		nullable: true
	})
	public accountId: string;

	@OneToOne(type => Account, account => account.id)
	@JoinColumn({name: 'account_id'})
	public account: Account;

	@CreateDateColumn({name: 'created_at'})
	createdAt!: Date;

	@UpdateDateColumn({name: 'updated_at'})
	updatedAt!: Date;

	@BeforeInsert()
	public async hashPassword(): Promise<void> {
		this.password = await User.hashPassword(this.password);
	}

	@BeforeInsert()
	public setCreateDate(): void {
		this.createdAt = new Date();
	}

	@BeforeUpdate()
	public setUpdateDate(): void {
		this.updatedAt = new Date();
	}

	public toString(): string {
		return `${this.name} - (${this.email})`;
	}
}
