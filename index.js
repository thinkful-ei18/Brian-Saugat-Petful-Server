'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');
// const {dbConnect} = require('./db-knex');

const Queue = require('./queue')

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

function peek(q) {
  return q.first.value
}

let cats = new Queue();

const CATS = [{
  imageURL:'http://i.dailymail.co.uk/i/pix/2017/07/16/09/42623C4B00000578-4700660-image-a-1_1500194523431.jpg',
  imageDescription: 'Goofy cat sticking out his tongue',
  name: 'Fluffy',
  sex: 'Male',
  age: 2,
  breed: 'Persian',
  story: 'Escaped from prison'
},
{
  imageURL:'http://animals.sandiegozoo.org/sites/default/files/2017-02/Serval_ZN.jpg',
  imageDescription: 'Serval cat looking regal',
  name: 'Marty',
  sex: 'Male',
  age: 2,
  breed: 'Serval',
  story: 'Escaped from zoo, armed and dangerous'
}];

CATS.forEach(cat => cats.enqueue(cat))

let dogs = new Queue();

const DOGS = [
  {
    imageURL: 'http://www.insideedition.com/images/videos/1611/10959.jpg',
    imageDescription: 'Sweet pit bull with a baby',
    name: 'Juju',
    sex: 'Female',
    age: 3,
    breed: 'Pit',
    story: 'Rescued from abusive owner'
  },
  {
    imageURL: 'https://media1.popsugar-assets.com/files/thumbor/8Gtvk-XykQ8NPzT4d4SGJEUQcQU/fit-in/2048xorig/filters:format_auto-!!-:strip_icc-!!-/2016/10/27/777/n/1922243/d4d1d96158123bcaa509d9.92618112_edit_img_image_42627810_1477584317/i/Pit-Bull-Halloween-Costumes.jpg',
    imageDescription: 'A grumpy pit bull in a halloween costume',
    name: 'Marcus',
    sex: 'Male',
    age: 2,
    breed: 'Pit',
    story: 'Rescued from Dog Fighting Ring'
  },
];

DOGS.forEach(dog => dogs.enqueue(dog))


app.get('/api/cat', (req, res) => {
res.json(peek(cats))
});

app.get('/api/dog', (req, res) => {
	res.json(peek(dogs));
});

app.delete('/api/cat', (req, res) => {
  cats.dequeue()
  res.json('cat deleted')
})

app.delete('/api/dog', (req, res, next) => {
 
  dog.dequeue()
  res.json('Dog deleted')
})

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
