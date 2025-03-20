const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect('mongodb://localhost:27017/music_player');
        console.log('Connect Successfully');
    } catch (error) {
        console.log('Failed to connect to MongoDB');
    }
}

module.exports = { connect };
