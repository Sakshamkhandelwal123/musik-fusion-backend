import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
} from 'sequelize-typescript';

@Table({
  underscored: true,
})
export class ChannelMember extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
  })
  id: string;

  @Column({ allowNull: false })
  userId: string;

  @Column({ allowNull: false })
  channelId: string;

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
