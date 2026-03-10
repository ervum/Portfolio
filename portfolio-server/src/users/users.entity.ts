import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  Email: string;

  @Column()
  PhoneNumber: string;

  @Column()
  Username: string;

  @Column()
  Password: string;
}