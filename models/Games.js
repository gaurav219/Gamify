const { Model } = require("objection");

class Games extends Model {
  static get tableName() {
    return "games";
  }

  static get idColumn() {
    return "ID";
  }

  getName() {
    return this.Name + " " + this.Age;
  }
}

module.exports = {
  Games,
};
