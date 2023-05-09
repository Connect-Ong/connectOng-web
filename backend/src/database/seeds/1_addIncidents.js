
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('incidents').del()
    .then(function () {
      // Inserts seed entries
      return knex('incidents').insert([
        {
          title: "Doguinho machucado :(",
          description: "Precisamos de ajuda financeira para pagar o tratamento veterinário.",
          value: 120,
          ong_id: "1234",
          img_url: "https://previews.123rf.com/images/mistersunday/mistersunday1806/mistersunday180600376/105815544-white-dog-injury-after-bite-stray-dog-attack-dog-white-dog-have-blood-after-bite-and-hurt-.jpg",
          sensible_content: true
        },
        {
          title: "Doguinho pra adoção",
          description: "Adote esse fofo, nao temos como mante-lo.",
          value: 0,
          ong_id: "1234",
          img_url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Puppy.JPG",
          sensible_content: false
        }
        
      ]);
    });
};
