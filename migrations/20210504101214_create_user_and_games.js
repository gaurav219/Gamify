exports.up = function (knex) {
  return knex.schema
    .createTable("user", (table) => {
      table.integer("ID").primary();
      table.string("username").notNullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
    })
    .createTable("games", (table) => {
      table.integer("ID").notNullable();
      table.integer("UserID").unsigned().notNullable();
      table.string("Title").notNullable();
      table.string("Genre").notNullable();
      table.string("Image").notNullable();
      table.string("URL").notNullable();

      table
        .foreign("UserID")
        .references("ID")
        .inTable("user")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("games").dropTableIfExists("user");
};
