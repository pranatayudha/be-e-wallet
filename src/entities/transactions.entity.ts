import { TransactionType } from 'src/utils/enums/TransactionType';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionsEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  amount: number;

  @Column({
    type: 'enum',
    enum: ['receive', 'transfer', 'topup'],
    enumName: 'transactionType',
  })
  type: TransactionType;

  @Column()
  delFlag: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
