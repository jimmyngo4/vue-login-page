//imports
    let express = require('express');
    let mongodb = require('mongodb');
    let router = express.Router();
//database
    let database = `demo`;
    let connectionString = 'mongodb://localhost:27017/' + database;
    
//generics
    //CRUD examples (for reference only)
        //read
            router.post('/getDocument', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body.item._id };
            //build document
                let document = await collection.findOne(query);
            //return
                res.send(document);
            }); 

        //create/update
            router.post('/setDocument', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body.item._id };
                let options = { //insert if doesn't exist
                    upsert: true,
                };
            //build document
                let replace = req.body.item;
                await collection.replaceOne(query, replace, options);
            //return
                res.status(201).send();
            });

        //delete
            router.post('/deleteDocument', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body.item._id };
            //execute query
                await collection.deleteOne(query);
            //return
                res.status(201).send();
            }); 

//customs
    //delete user
        router.post('/deleteUser', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { _id: req.body.item._id };
            //execute query
                await collection.deleteOne(query);
            //return
                res.status(201).send();
        }); 

    //set user
        router.post('/setUser', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { 
                    _id: req.body.item._id,
                    fruit: req.body.item.fruit,
                }
                let options = { //insert if it doesn't exist
                    upsert: true,
                }
            //execute query
                let replace = req.body.item;
                await collection.replaceOne(query, replace, options);
            //return
                res.status(201).send();
            }); 

    //get access token
        router.post('/getToken', async (req, res) => {
            //get params
                let collection = await loadCollection(req.body.collection);
                let query = { 
                    _id: req.body.item._id
                }
            //execute query
                let user = await collection.findOne(query);
            // server side validation
                if (!user) {
                    result = "user doesn't exist";
                }
                else if (user.fruit != req.body.item.fruit) {
                    result = "invalid password";
                }
                else {
                    result = true;
                }
            //return
                res.send(result);
        });
    
    //database
        async function loadCollection(collection){
            let client = await mongodb.MongoClient.connect(connectionString, {
                useNewUrlParser: true
            });
            return client.db(database).collection(collection);
        }

//export
    module.exports = router;