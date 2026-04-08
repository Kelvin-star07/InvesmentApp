import connection from "../utils/MongooseConnection.js";
import AssetsTypeModel from "../models/AssetsTypeModel.js";
import AssetsModel from "../models/AssetsModel.js";
import UserModel from "../models/UserModel.js";
// Initialize Sequelize connection

try {
  await connection.authenticate(); // Authenticate the connection
  console.log("Database connection has been established successfully.");
} catch (err) {
  console.error("Error setting up the database connection:", err);
}

//relations
AssetsTypeModel.hasMany(AssetsModel, { foreignKey: "assetTypeId" });
AssetsModel.belongsTo(AssetsTypeModel, { foreignKey: "assetTypeId" });
//assets and user relation
UserModel.hasMany(AssetsModel, { foreignKey: "userId"});
AssetsModel.belongsTo(UserModel, { foreignKey: "userId" });
//assets type and user relation
UserModel.hasMany(AssetsTypeModel, { foreignKey: "userId" });
AssetsTypeModel.belongsTo(UserModel, { foreignKey: "userId" });
export default {
  Sequelize: connection,
  AssetsTypeModel,
  AssetsModel,
  UserModel
};
