"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "category_id", {
      type: Sequelize.INTEGER,
      references: { model: "categories", key: "id" }, // criando relacionamento com a tabela de Categorias
      onUpdate: "CASCADE", // caso eu atualize algo na tabela de produts atualizo a de categories
      onDelete: "SET NULL", // caso eu deleto algo na tabela de produts na de categories fica null
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("products", "category_id");
  },
};
