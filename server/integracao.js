
const mysql = require('mysql');
const { MongoClient } = require('mongodb');
const { getAllUsers } = require('./controllers/userController');

// Configurações do MySQL
const mysqlConfig = {
  host: 'zero-waste.mysql.database.azure.com',
  user: 'zerowaste',
  password: '@amell2023',
  database: 'db_zerowaste',
};

// Configurações do MongoDB
const mongoConfig = {
  url: 'mongodb+srv://larissanunes:La23nunes@cluster0.kxw033l.mongodb.net',
  dbName: 'test',
  collectionName: 'users'
};

async function syncDataFromMySQLToMongoDB() {
  const mysqlConnection = mysql.createConnection(mysqlConfig);

  mysqlConnection.connect((err) => {
    if (err) {
      console.error('Erro ao conectar no MySQL:', err);
      return;
    }

    console.log('Conectado ao MySQL.');

    mysqlConnection.query('SELECT * FROM tbl_usuario_teste', async (error, results) => {
      if (error) {
        console.error('Erro ao consultar dados no MySQL:', error);
        return;
      }

      mysqlConnection.end();

      console.log('Dados obtidos do MySQL:', results);

      const documents = results.map((row) => {
        return {
          username: row.username,
          email: row.email,
          senha: row.senha,
          isAvatarImageSet: row.isAvatarImageSet,
          avatarImage: row.avatarImage
        };
      });

      try {
        const client = await MongoClient.connect(mongoConfig.url);
        console.log('Conectado ao MongoDB.');

        const db = client.db(mongoConfig.dbName);
        const collection = db.collection(mongoConfig.collectionName);

        for (const document of documents) {
          const existingDocument = await collection.findOne({ username: document.username });
          if (!existingDocument) {
            await collection.insertOne(document);
          }
        }

        console.log('Dados sincronizados com sucesso!');

        client.close();
      } catch (err) {
        console.error('Erro ao inserir dados no MongoDB:', err);
      }
    });
  });
}

syncDataFromMySQLToMongoDB();
setInterval(syncDataFromMySQLToMongoDB, 60000);





