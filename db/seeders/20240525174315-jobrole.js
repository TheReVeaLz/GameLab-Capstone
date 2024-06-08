'use strict';
const { Op } = require("sequelize");
const seeds = require('./Seeds.json').roles;

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    
    const roles = seeds.map((seed) => ({
      ...seed,
      createdAt: new Date(),
      updatedAt: new Date()
    }))

    await queryInterface.bulkInsert('JobRoles', roles)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const roleNames = seeds.map((seed) => (
      seed.roleName
    ))
    await queryInterface.bulkDelete('JobRoles', { roleName: { [Op.in]: roleNames } });
  }
};
