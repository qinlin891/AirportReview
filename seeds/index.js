const mongoose = require('mongoose');
const list = require('./list');
const Airport = require('../models/airport');

mongoose.connect('mongodb://localhost:27017/airport-review');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=> {
    console.log("Database connected");
});

const seedDB = async() => {
    await Airport.deleteMany({});
    for(let i = 0; i < list.length; i++) {
        for(let j = 0; j < list[i].airports.length; j++) {
            const airport = new Airport({
                name: `${list[i].airports[j]}`,
                location: `${list[i].state}`,
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur adipisci quisquam, cupiditate eos eligendi quaerat! Nobis quae suscipit in qui, modi reprehenderit id odio dolores cum ex mollitia quia rem',
                image: 'https://source.unsplash.com/collection/508415'
            });
            await airport.save();
        }
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});