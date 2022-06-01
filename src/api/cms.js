import { Router } from 'express';
import sanityClient from '@sanity/client';

const client = sanityClient({
    projectId: 'iw5ozyig',
    dataset: 'production',
    apiVersion: '2022-06-01',
    useCdn: true
});

const cache = {};

/** @param {string} q */
const fetchQuery = q => cache[q] || client.fetch(q);

const CMS = Router();

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