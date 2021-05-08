exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("all_games")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("all_games").insert([
        {
          ID: 200,
          Title: "GTA 5",
          Genre: "Action-Adventure, Open-World",
          Image: "Background.jpg",
          URL: "https://store.steampowered.com/app/271590/Grand_Theft_Auto_V/",
          Likes: 1,
        },

        {
          ID: 201,
          Title: "Battlefield 3",
          Genre: "RPG, Shooting",
          Image: "Battlefield3.jpeg",
          URL: "https://www.battlefield.com/games/battlefield-3",
          Likes: 1,
        },
        {
          ID: 202,
          Title: "Cyberpunk 2077",
          Genre: "Action, Role-Playing",
          Image: "Cyberpunk.jpg",
          URL: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
          Likes: 0,
        },
        {
          ID: 203,
          Title: "Death Stranding",
          Genre: "Action",
          Image: "DeathStranding.jpg",
          URL: "https://store.steampowered.com/sub/489555/",
          Likes: 0,
        },
      ]);
    });
};
