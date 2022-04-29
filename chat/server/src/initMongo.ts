import mongoose from "mongoose";

module.exports = () => {
    mongoose.connect(
        process.env.MONGODB_URI, {
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD
    }
    ).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB not connected: ' + err.message));

    mongoose.connection.on('error', err => {
        console.log(err.message);
    });
}