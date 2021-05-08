const { Model } = require("objection");

class AllGames extends Model {
  static get tableName() {
    return "all_games";
  }

  static get idColumn() {
    return "ID";
  }
}

module.exports = {
  AllGames,
};
