'use strict';
const { users, roles } = require('./Seeds.json');
const Helper = require('../../middlewares/helper');

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

    const data = [];

    for(let j = 0; j < users.length; j++) {
      const today = new Date();

      for(let i = 1; i < 12-1; i++) {
        const periodStart = new Date(today.getFullYear(), i, 25);
        periodStart.setHours(0, 0, 0);

        const periodEnd = new Date(today.getFullYear(), i+1, 25);
        periodEnd.setHours(0, 0, 0);

        const salary = roles[2].salary;
        const deductions = Math.floor(Math.random() * 5) * 1e5;
        data.push({
          userId: users[j].id,
          periodStart,
          periodEnd,
          salary,
          deductions,
          netWorth: salary - deductions,
          createdAt: timestamp,
          updatedAt: timestamp
        });
      } 
    }

    await queryInterface.bulkInsert('Payslips', data)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
