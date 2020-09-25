const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

const playStore = require('./playstore.js')
const genresOptions = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']


app.get('/apps', (req, res) => {
     const { search = "", sort, genres } = req.query;

    if (genres) {
        if (!genresOptions.includes(genres)) {
            return res
                .status(400)
                .send('genres must be one of Action, Puzzle, Strategy, Casual, Arcade, or Card.');
        }
    }
  
    if (sort) {
      if (!['Rating', 'App'].includes(sort)) {
        return res
          .status(400)
          .send('Sort must be one of title or rank');
      }
    }
  
    let results = playStore
          .filter(app=>
              app
                .App
                .toLowerCase()
                .includes(search.toLowerCase()));
  
    if (sort) {
      results
        .sort((a, b) => {
          return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      });
    }

    if (genres) {
       let genresFiltered = results
        .filter(gen => gen.Genres.includes(...genresOptions))
        
            res
            .json(genresFiltered);
    }
  
    res
      .json(results);
  });

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
  });