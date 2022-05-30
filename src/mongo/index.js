import { MongoClient } from 'mongodb';

class DataManager {
    connected = false;
    client = new MongoClient(`mongodb://${process.env.DBUSERNAME}:${process.env.DBPASSWORD}@localhost:27017`);

    connect() {
        this.client.connect().then(() => {
            this.connected = true;
            console.log('Successfully connected MongoDB client');
        }).catch(err => {
            console.error('Failed to connect MongoDB client:');
            console.error(err);
        });

        this.client.on('close', () => {
            this.connected = false;
            console.log('MongoDB client closed');
        })
    }

    /** @param {string} name */
    collection(name) {
        if (!this.connected) return;

        const db = this.client.db(process.env.DB);
        return db.collection(name);
    }

    constructor() {
        this.connect();
    }
}

export default new DataManager();