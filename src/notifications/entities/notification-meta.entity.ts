import {
  AutoIncrement,
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { Notification } from './notification.entity';

@Table({ underscored: true })
export class NotificationMeta extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @ForeignKey(() => Notification)
  @Column({ allowNull: false })
  notificationId: number;

  @BelongsTo(() => Notification)
  notification: Notification;

  @Column({ allowNull: true })
  entityId: string;

  @Column({ allowNull: true })
  entityType: string;

  @Column({ allowNull: true })
  referenceId: string;

  @Column({ allowNull: true })
  referenceType: string;

  @Column({ allowNull: true, type: DataType.JSONB })
  metadata: object;

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
