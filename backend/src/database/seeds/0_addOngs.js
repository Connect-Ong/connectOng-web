
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('incidents').del()
    .then(function () {
      knex('ongs').del()
        .then(function () {
          // Inserts seed entries
          return knex('ongs').insert([
            {
              id: "1234",
              name: "Abrace",
              email: "abrace@abrace.com",
              whatsapp: "85996420777",
              city: "Fortaleza",
              uf: "CE"
            }
          ]);
        });
    })
};