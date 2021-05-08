exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("games")
    .del()
    .then(() => {
      return knex("user")
        .del()
        .then(() => {
          // Inserts seed entries
          return knex("user")
            .insert([
              {
                ID: 100,
                username: "test2021",
                email: "test2021@cb.lk",
                password: "test2021",
              },
              {
                ID: 101,
                username: "abc2021",
                email: "abc2021@cb.lk",
                password: "abc2021",
              },
            ])
            .then((users) => {
              return knex("games").insert([
                {
                  ID: 200,
                  UserID: 100,
                  Title: "GTA 5",
                  Genre: "Action-Adventure, Open-World",
                  Image: "Background.jpg",
                  URL:
                    "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/",
                },
                {
                  ID: 201,
                  UserID: 101,
                  Title: "Battlefield 3",
                  Genre: "RPG, Shooting",
                  Image: "Battlefield3.jpeg",
                  URL: "https://www.battlefield.com/games/battlefield-3",
                },
              ]);
            });
        });
    });
};
