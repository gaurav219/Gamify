const { Model } = require("objection");

const { Games } = require("./Games");

class User extends Model {
  static get tableName() {
    return "user";
  }

  static get idColumn() {
    return "ID";
  }

  getName() {
    return this.Name + " " + this.Age;
  }

  //   static get jsonSchema() {
  //     return {
  //       type: "object",
  //       required: ["Name", "Age"],

  //       properties: {
  //         ID: { type: "integer" },
  //         Name: { type: "string" },
  //         Age: { type: "integer" },
  //         City: { type: "string" },
  //       },
  //     };
  //   }

  static get relationMappings() {
    return {
      games: {
        relation: Model.HasManyRelation,
        modelClass: Games,
        join: {
          from: "user.ID",
          to: "games.UserID",
        },
      },
    };
  }
}

module.exports = {
  User,
};
