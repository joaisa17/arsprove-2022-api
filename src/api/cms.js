import { Router } from 'express';
import sanityClient from '@sanity/client';
import ms from 'ms';

const client = sanityClient({
    projectId: 'iw5ozyig',
    dataset: 'production',
    apiVersion: '2022-06-01',
    useCdn: true
});

const cache = {};

/** @param {string} q */
async function fetchQuery(q) {
    if (cache[q]) return cache[q];

    const data = await client.fetch(q);
    cache[q] = data;

    setTimeout(() => {
        delete cache[q];
    }, ms('10m'));

    return data;
}

const CMS = Router();

CMS.post('/cms/clear', (req, res) => {
    if (!req.user || !req.user.admin) return res.status(401).end();

    Object.keys(cache).forEach(key => delete cache[key]);
    res.status(200).end();
})

CMS.get('/cms/query', async (req, res) => {
    if (!req.query.q) return res.status(400).end();

    try {
        const result = await fetchQuery(req.query.q);
        res.send(result);
    } catch(err) {
        res.status(400).send(err);
    }
});

CMS.get('/cms/img', async (req, res) => {
    if (!req.query.id) return res.status(400).end();

    try {
        const url = await fetchQuery(`*[_type == "sanity.imageAsset" && _id == "${req.query.id}"][0].url`);
        res.status(200).redirect(url);
    } catch(err) {
        res.status(400).send(err);
    }
});

export default CMS;