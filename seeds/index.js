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
                author: '62b9f5660e29cb8744cbe879',
                name: `${list[i].airports[j]}`,
                location: `${list[i].state}`,
                geometry: { type: 'Point', coordinates: [ -98.495141, 29.4246 ] },
                description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur adipisci quisquam, cupiditate eos eligendi quaerat! Nobis quae suscipit in qui, modi reprehenderit id odio dolores cum ex mollitia quia rem',
                images: [
                    {
                      url: 'https://res.cloudinary.com/downnbcia/image/upload/v1656525399/AirportReview/l5qhikykx14qkt2mno2j.jpg',
                      filename: 'AirportReview/l5qhikykx14qkt2mno2j'
                    },
                    {
                      url: 'https://res.cloudinary.com/downnbcia/image/upload/v1656525399/AirportReview/tutjr8jjcnjhlw74z94r.jpg',
                      filename: 'AirportReview/tutjr8jjcnjhlw74z94r'
                    }
                  ]
            });
            await airport.save();
        }
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});