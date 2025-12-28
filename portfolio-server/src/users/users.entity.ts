import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  UserIdentifier: string;

  @Column()
  Password: string;
}