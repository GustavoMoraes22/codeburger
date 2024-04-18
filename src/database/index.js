import { Sequelize } from "sequelize";
import User from "../app/models/User";
// import configDatabase from "../config/database";
import Product from "../app/models/Product";
import Category from "../app/models/Category";
import mongoose from "mongoose";

const models = [User, Product, Category];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(
      "postgresql://postgres:HFaYfZurPkrKBlTqxZeNKbJOPDoJMzyk@roundhouse.proxy.rlwy.net:11550/railway",
    );
    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models),
      );
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      "mongodb://mongo:sjNhpwWJvnkKawTbmsZwASfrspJUCYcL@viaduct.proxy.rlwy.net:29860",
    );
  }
}

export default new Database();
