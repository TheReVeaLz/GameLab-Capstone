'use strict';
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const names = require('./Seeds.json').names;

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
    const password = "123456";
    const encryptedPassword = bcrypt.hashSync(password, 10);
    const timestamp = new Date();

    const users = names.map((name) => ({
      name,
      email: `${name.toLowerCase()}@gmail.com`,
      encryptedPassword,
      phoneNumber: "082112345678",
      roleId: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    }))

    await queryInterface.bulkInsert('Users', users)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', { name: { [Op.in]: names } });
  }
};
