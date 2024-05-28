import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: string;

  @Column()
  username: string;

  @Column()
  isLogin: boolean;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  balance: number;

  @Column()
  delFlag: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
