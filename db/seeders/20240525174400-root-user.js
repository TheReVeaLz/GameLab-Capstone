'use strict';
const bcrypt = require("bcrypt");
const name = "root";

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
    const timestamp = new Date();

    await queryInterface.bulkInsert('Users', [{
      name,
      email: `${name.toLowerCase()}@gmail.com`,
      encryptedPassword: bcrypt.hashSync("root", 10),
      phoneNumber: "082112345678",
      roleId: 1,
      privilege: "ROOT",
      createdAt: timestamp,
      updatedAt: timestamp,
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', { name });
  }
};
