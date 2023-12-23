'use strict';

const tableName = 'musik_fusion_events';

const performer_type = ['USER', 'SYSTEM'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(tableName, {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      event_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      performer_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      performer_type: {
        type: Sequelize.ENUM(...performer_type),
        allowNull: true,
        default: 'SYSTEM',
      },
      entity_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      entity_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reference_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reference_type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(tableName);
  },
};
