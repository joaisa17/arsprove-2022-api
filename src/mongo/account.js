import DataManager from '.';

import { genSalt, hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';

class AccountManager {
    /** @param {string} pwd */
    async encryptPassword(pwd) {
        const salt = await genSalt(10);

        return (await hash(pwd, salt));
    }

    /**
     * @param {string} username
     * @param {string} password
    */
    async authorize(username, pwd) {
        const collection = DataManager.collection('users');
        if (!collection) return 500;

        const user = await collection.findOne({
            username
        });

        if (!user || !user.password) return 404;

        const result = await compare(pwd, user.password);

        return result? 200:401;
    }

    /**
     * @param {string} username 
     * @param {string} pwd 
     * @param {Object<string, any>|undefined} additionalData 
    */
    async register(username, pwd, additionalData) {
        if (
            !username || !pwd
            || (additionalData &&
            (additionalData.username || additionalData.password))
        ) return 400;

        const collection = DataManager.collection('users');
        if (!collection) return 500;

        const user = await collection.findOne({
            username
        });

        if (Boolean(user)) return 403;
        const password = await this.encryptPassword(pwd);

        const result = await collection.insertOne({
            username,
            password,
            ...(additionalData || {})
        });

        return result.acknowledged? 200:500;
    }

    /** @param {string} username */
    async delete(username) {
        const collection = await DataManager.collection('users');
        if (!collection) return 500;

        const result = await collection.deleteOne({ username });
        return result.deletedCount > 0? 200:404;
    }

    /** @param {string} username */
    generateToken(username) {
        return jwt.sign(
            { username },
            process.env.TOKEN_SECRET,
            { expiresIn: '1d' }
        )
    }

    /** @param {string} token */
    /** @returns {Promise<string, number>} */
    async authorizeToken(token) {
        const collection = await DataManager.collection('expiredTokens');
        if (!collection) return 500;

        const expiredResult = await collection.findOne({ token });
        if (expiredResult && expiredResult.token) return 401;

        return new Promise((res, rej) => {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
                if (err) rej(403);
                res(user.username);
            });
        });
    }

    /** @param {string} token */
    async expireToken(token) {
        const collection = await DataManager.collection('expiredTokens');
        if (!collection) return 500;

        const result = await collection.insertOne({ token });
        return result.insertedId? 200:500;
    }

    /** @param {string} token */
    async unexpireToken(token) {
        const collection = await DataManager.collection('expiredTokens');
        if (!collection) return 500;

        const result = await collection.deleteOne({ token });
        return result.deletedCount > 0? 200:500;
    }

    async checkExpiredTokens() {
        const collection = await DataManager.collection('expiredTokens');
        if (!collection) return;

        const tokens = await collection.find({});
        tokens.map(document => {
            jwt.verify(document.token, process.env.TOKEN_SECRET, async (err) => {
                if (err) collection.deleteOne({ token: document.token });
            });
        });
    }
}

export default new AccountManager();