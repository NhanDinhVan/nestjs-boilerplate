import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ type: 'varchar' })
    firstName: string

    @Column({ type: 'varchar' })
    lastName: string

    @Column({ type: 'varchar', unique: true })
    email: string

    @Column({ type: 'varchar' })
    password: string

    @Column({ type: 'timestamp with time zone', nullable: true })
    dayOfBirth: Date | null

    @CreateDateColumn({ type: 'timestamp with time zone', nullable: true })
    createdAt: Date | null

    @UpdateDateColumn({ type: 'timestamp with time zone', nullable: true })
    updatedAt: Date | null
}
