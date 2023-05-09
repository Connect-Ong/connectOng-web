const crypto = require('crypto');
const connection = require('../database/connection');
const { update } = require('../database/connection');


module.exports = {

    async index(_, response) {
        const ongs = await connection('ongs').select('*');

        return response.json(ongs);
    },


    async create(request, response) {

        const { name, email, whatsapp, city, uf } = request.body;

        const id = crypto.randomBytes(4).toString('HEX');

        await connection('ongs').insert({
            id, name, email, whatsapp, city, uf,
        });

        return response.json({ id });
    },

    async update(request, response) {

        const id = request.headers.authorization;
        const { name, email, whatsapp, city, uf } = request.body;

        if ( 
            [null, undefined, ""].includes(id)
         || [null, undefined, ""].includes(name) 
         || [null, undefined, ""].includes(email) 
         || [null, undefined, ""].includes(whatsapp) 
         || [null, undefined, ""].includes(city) 
         || [null, undefined, ""].includes(uf) 
         ) {
            return response.status(400).send();
        }

        await connection('ongs')
        .where('id', id)
        .first()
        .update({
            name, email, whatsapp, city, uf,
        });

        return response.status(200).send();
    },

    async delete(request, response) {
        const { id } = request.params;
        
        await connection('incidents').where('ong_id', id).delete();
        await connection('ongs').where('id', id).delete();

        return response.status(204).send();
    }

};