import {
  AutoIncrement,
  Column,
  CreatedAt,
  DeletedAt,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { NotificationMeta } from './notification-meta.entity';

@Table({ underscored: true })
export class Notification extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column({ allowNull: false })
  userId: string;

  @Column({ allowNull: false, defaultValue: false })
  isRead: boolean;

  @Column({ allowNull: false })
  notificationType: string;

  @Column({ allowNull: true })
  entityId: string;

  @Column({ allowNull: true })
  entityType: string;

  @HasMany(() => NotificationMeta)
  metaData: NotificationMeta[];

  @Column({ allowNull: false })
  @CreatedAt
  createdAt: Date;

  @Column({ allowNull: false })
  @UpdatedAt
  updatedAt: Date;

  @Column({ allowNull: true })
  @DeletedAt
  deletedAt: Date;
}
