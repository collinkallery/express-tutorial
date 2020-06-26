const express = require('express');
const app = express();
cors = require('cors');
app.use(express.json());
app.use(cors());

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Pet Box';

app.get('/', (request, response) => {
  response.send('Oh hey Pet Box');
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});


app.locals.pets = [
  {id: 'a1', name: 'Rover', type: 'dog'},
  {id: 'b2', name: 'Marcus Aurelius', type: 'parakeet'},
  {id: 'c3', name: 'Craisins', type: 'cat'}
];

app.get('/api/v1/pets', (request, response) => {
  const pets = app.locals.pets;

  response.json({pets});
});

app.get('/api/v1/pets/:id', (request, response) => {
  const {id} = request.params;
  const pet = app.locals.pets.find(pet => pet.id === id);

  if (!pet) {
    return response.sendStatus(404);
  }

  response.status(200).json(pet);
});

app.post('/api/v1/pets', (request, response) => {
  const id = Date.now().toString();
  const pet = request.body;

  for (let requiredParameter of ['name', 'type']) {
    if (!pet[requiredParameter]) {
      return response
        .status(422)
        .send({error: `Expected format: {name : <String>, type: <String>}. You're missing a "${requiredParameter}" property.`})
    }
  }

  const {name, type} = pet;
  app.locals.pets.push({name, type, id});
  response.status(201).json({name, type, id});
});

app.patch('/api/v1/pets/:id', (request, response) => {
  const id = request.params.id;
  const petUpdate = request.body;

  for (let pet of app.locals.pets) {
    if (pet.id === id) {
      if (petUpdate.name != null || undefined) {
        pet.name = petUpdate.name;
      }
      if (petUpdate.type != null || undefined) {
        pet.type = petUpdate.type;
      }
      return response
        .status(200)
        .json({message: "Updated Successfully", data: pet})
    }
  }
  response.status(404).json({message: "Invalid pet ID"});
});

app.delete('/api/v1/pets/:id', (request, response) => {
  const id = request.params.id;

  for (let pet of app.locals.pets) {
    if (pet.id === id) {
      app.locals.pets.splice(app.locals.pets.indexOf(pet), 1);

      return response.status(200).json({
        message: `Successfully deleted pet ${pet.id}`
      });
    }
  }

  response.status(404).json({message: "Invalid pet id"});
});
