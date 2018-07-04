/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const cookieParser = require('cookie-parser');
const sha256 = require('js-sha256');

// Initialise postgres client
const config = {
  user: 'Jay',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};


const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

 const getRoot = (request, response) => {
  // query database for all pokemon

  // respond with HTML page displaying all pokemon
  //
  const queryString = 'SELECT * from pokemon;';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'home', {pokemon: result.rows} );
    }
  });
};

const getNew = (request, response) => {
  response.render('new');
};

const getPokemon = (request, response) => {
  let id = request.params.id;
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'pokemon', {pokemon: result.rows[0]} );
    }
  });
}

const loginPage = (request, response) => {
  response.render('login');
}

const registerPage = (request, response) => {
  response.render('register');
}

const userRegister = (request, response) => {
  let hashPassword = sha256(request.body.password);

  let queryString = 'INSERT INTO users (email, password, DOB) VALUES ($1, $2, $3) RETURNING *';
  const values = [request.body.email, hashPassword, request.body.DOB];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
};

const userLogin = (request, response) => {
  console.log(request.body.email);
  let queryString = 'SELECT * FROM users WHERE email = $1';
  const values = [request.body.email];
  pool.query(queryString, values,(err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      if (result.rows.length < 0) {
        response.status('401');
        response.send('INVALID EMAIL OR PASSWORD!');
      } else if (result.rows[0].password == sha256(request.body.password)) {
        response.cookie('logged_in', 'true');
        response.cookie('user_id', result.rows[0].id);
        response.redirect('/');
      } else {
        response.status('401');
        response.send('INVALID EMAIL OR PASSWORD!');
      }

    }
  });
};


const logoutPage = (request, response) => {
  response.clearCookie('logged_in');
  response.clearCookie('user_id');
  response.redirect('/login');
}

const postPokemon = (request, response) => {
  let params = request.body;
  const queryString = 'INSERT INTO pokemon(num, name, img, height, weight) VALUES($1, $2, $3, $4, $5)';
  const values = [params.num, params.name, params.img, params.height, params.weight];

  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error:', err.stack);
    } else {
      console.log('query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
};

const editPokemonForm = (request, response) => {
  let id = request.params.id;
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'edit', {pokemon: result.rows[0]} );
    }
  });
}

const updatePokemon = (request, response) => {
  let ID = parseInt(request.params.id);

  let pokemon = request.body;
  const queryString = 'UPDATE pokemon SET num=$1, name=$2, img=$3, height=$4, weight=$5 WHERE ID=$6';
  const values = [pokemon.num, pokemon.name, pokemon.img, pokemon.height, pokemon.weight, ID];
  console.log(queryString);
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.redirect(`/pokemon/${request.params.id}`);
    }
  });
}

const deletePokemonForm = (request, response) => {
  let id = request.params.id;
  const queryString = 'SELECT * FROM pokemon WHERE id = ' + id + ';';
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.render( 'delete', {pokemon: result.rows[0]} );
    }
  });
}

const deletePokemon = (request, response) => {
  let id = request.params.id;
  const queryString = `DELETE FROM pokemon WHERE id = ${id}`;
  console.log(queryString);
  pool.query(queryString, (err, result) => {
    if (err) {
      console.error('Query error:', err.stack);
    } else {
      console.log('Query result:', result);

      // redirect to home page
      response.redirect('/');
    }
  });
}

/**
 * ===================================
 * Routes
 * ===================================
 */

app.get('/', getRoot);

app.get('/login', loginPage);
app.get('/register', registerPage);
app.get('/logout', logoutPage);

app.get('/pokemon/:id/edit', editPokemonForm);
app.get('/pokemon/new', getNew);
app.get('/pokemon/:id', getPokemon);
app.get('/pokemon/:id/delete', deletePokemonForm);


app.post('/users/new', userRegister);
app.post('/users/login', userLogin);
app.post('/pokemon', postPokemon);

app.put('/pokemon/:id', updatePokemon);

app.delete('/pokemon/:id', deletePokemon);

// TODO: New routes for creating users


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
}

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


