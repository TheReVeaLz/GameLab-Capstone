'use strict';
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const users = require('./Seeds.json').users;

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

    const data = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: `${user.name.toLowerCase()}@gmail.com`,
      encryptedPassword,
      phoneNumber: "082112345678",
      privilege: user.privilege ? user.privilege : "MEMBER",
      roleId: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    }))

    await queryInterface.bulkInsert('Users', data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const data = users.map((user) => (user.name));
    await queryInterface.bulkDelete('Users', { name: { [Op.in]: data } });
  }
};
