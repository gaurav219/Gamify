exports.up = function (knex) {
  return knex.schema.createTable("all_games", (table) => {
    table.integer("ID").primary();
    table.string("Title").notNullable();
    table.string("Genre").notNullable();
    table.string("Image").notNullable();
    table.string("URL").notNullable();
    table.integer("Likes").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("all_games");
};
