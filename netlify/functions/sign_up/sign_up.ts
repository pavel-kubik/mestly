import { Handler } from '@netlify/functions';

const { MongoClient } = require('mongodb');

let cachedDb = null;

const connectToDatabase = async (uri) => {
  // we can cache the access to our database to speed things up a bit
  // (this is the only thing that is safe to cache here)
  if (cachedDb) return cachedDb;

  const client = await MongoClient.connect(uri, {
    useUnifiedTopology: true
  });

  cachedDb = client.db(process.env.MONGODB_DATABASE);

  return cachedDb;
};

export const handler: Handler = async (event, context) => {
  const { name, passwordHash } = event.queryStringParameters;

  context.callbackWaitsForEmptyEventLoop = false;

  // TODO: Create user in database and return user object
  try {
    console.log('Connect to: ' + process.env.MONGODB_URI);
    console.log('Connect to: ' + process.env.MONGODB_DATABASE);
    const database = await connectToDatabase(process.env.MONGODB_URI);
    const collection = database.collection('user');
    //console.log('Collection: ' + JSON.stringify(collection));

    // TODO store IP address and allow store only few new users from same IP per time frame

    collection.insertOne(
      {
        name: name,
        passwordHash: passwordHash
      },
      function (err, res) {
        if (err) throw err;
        console.log('1 document inserted: ' + JSON.stringify(res));

        collection.find({}).toArray(function (err, result) {
          if (err) throw err;
          console.log('Found: ' + JSON.stringify(result));
        });
      }
    );
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Hello, ${name}!`
      })
    };
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};