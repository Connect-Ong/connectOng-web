const connection = require('../database/connection');
const CloudKitHelper = require("../cloudkit/CloudKitHelper");

module.exports = {

    async index(request, response) {

        const { page = 1 } = request.query;

        const [count] = await connection('incidents').count();

        console.log(count, Date.now())

        var incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(25)
            .offset((page - 1) * 5)
            .select([
                'incidents.*',
                'ongs.name',
                'ongs.email',
                'ongs.whatsapp',
                'ongs.city',
                'ongs.uf'
            ]);

        for (i = 0; i < incidents.length; i++) {
            if (!incidents[i].img_url.includes('http')) {
                const url = await CloudKitHelper.getURLforRecordNamed(incidents[i].img_url)
                incidents[i].img_url = url;
            }
        }

        response.header('X-Total-Count', count['count(*)']);
        return response.json(incidents);

    },


    async fetchById(request, response) {

        const { id } = request.params
        const ong_id = request.headers.authorization;

        const incident_ong_id = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if ([null, undefined].includes(incident_ong_id)) {
            return response.status(401).json({ error: 'Incident not found for given ONG.' });
        }

        if (incident_ong_id.ong_id !== ong_id) {
            return response.status(401).json({ error: 'Operation is not permitted.' });
        }

        const incident = await connection('incidents').where('id', id).first();

        return response.json(incident);
    },

    async update(request, response) {
        const { title, description, value, img_url, sensible_content } = request.body;
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        if (["", null, undefined].includes(ong_id)) {
            return response.status(401).json({ error: "ONG não está logada." });
        }

        const ong = await connection('ongs')
            .where('id', ong_id)
            .select('*')
            .first();

        if ([null, undefined].includes(ong)) {
            return response.status(401).json({ error: "ONG não encontrada." });
        }

        const result = await connection('incidents')
            .where('id', id)
            .first()
            .update({ title, description, value, img_url, sensible_content })

        return result ? response.status(200).send() : response.status(401).json({ error: "Não foi possível atualizar Caso. Entre em contato com o suporte" });
    },

    async create(request, response) {
        let { title, description, value, img_url, sensible_content } = request.body;
        const ong_id = request.headers.authorization;

        if (["", null, undefined].includes(img_url)) {
            img_url = "https://i.imgur.com/oLLacJa.png"
        }

        if (["", null, undefined].includes(ong_id)) {
            return response.status(401).json({ error: "ONG Not Found." });
        }

        const ong = await connection('ongs')
            .where('id', ong_id)
            .select('*')
            .first();

        if ([null, undefined].includes(ong)) {
            return response.status(401).json({ error: "ONG Not Found." });
        }

        console.log({ title, description, value, img_url, sensible_content, ong_id });

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            img_url,
            sensible_content,
            ong_id,
        },
            "id")

        return response.json({ id });
    },

    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await connection('incidents')
            .where('id', id)
            .select('ong_id')
            .first();

        if ([null, undefined].includes(incident)) {
            return response.status(401).json({ error: 'ONG Not Found.' });
        }

        if (incident.ong_id !== ong_id) {
            return response.status(401).json({ error: 'Operation is not permitted.' });
        }

        await connection('incidents').where('id', id).delete();

        return response.status(204).send();
    }
};