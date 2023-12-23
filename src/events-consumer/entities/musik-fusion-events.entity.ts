import {
  Column,
  CreatedAt,
  DataType,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

import { EventPerformer } from 'src/utils/constants';

@Table({ underscored: true })
export class MusikFusionEvents extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false })
  eventType: string;

  @Column({ allowNull: true })
  performerId: string;

  @Column({ allowNull: true })
  performerType: EventPerformer;

  @Column({ allowNull: false })
  entityId: string;

  @Column({ allowNull: false })
  entityType: string;

  @Column({ allowNull: true })
  referenceId: string;

  @Column({ allowNull: true })
  referenceType: string;

  @Column({ allowNull: false })
  timestamp: Date;

  @Column({ allowNull: false, type: DataType.JSONB })
  metadata: object;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
