import {
  Table,
  Column,
  Model,
  PrimaryKey,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AfterDestroy,
} from 'sequelize-typescript';

import { deleteEntity } from 'src/utils/constants';
import { getDataCleanupJobId, getQueueValue } from 'src/utils/helpers';

@Table({
  underscored: true,
})
export class Friend extends Model {
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
  followingUserId: string;

  @Column({ allowNull: false, defaultValue: false })
  isFriend: boolean;

  @Column({ allowNull: false })
  @CreatedAt
  createdAt: Date;

  @Column({ allowNull: false })
  @UpdatedAt
  updatedAt: Date;

  @Column({ allowNull: true })
  @DeletedAt
  deletedAt: Date;

  @AfterDestroy
  static async afterDestroyHook(options: any) {
    const dataCleanupQueue = await getQueueValue();

    const jobId = getDataCleanupJobId(deleteEntity.FRIEND, options.id);

    await dataCleanupQueue.add(
      jobId,
      {
        actionName: deleteEntity.FRIEND,
        actionData: options,
      },
      {
        attempts: 3,
        jobId,
        removeOnComplete: true,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }
}
