import {Client} from 'pg'

const client = new Client({
    user: 'postgres',
    host: 'postgres',
    database: 'postgres',
    password: 'postgres',
    port: 5432,
})

client.connect()
  .then(() => console.log('connected'))
  .catch((err) => console.error('connection error', err.stack))


// Return device token associated to the user
async function getDeviceToken(userID:string){

    console.log("Get token device");

    let query = {
        text: "SELECT * from User_Device WHERE id = $1",
        values: [userID],
    }

    try {
        let res = await client.query(query)
        return res.rows
    }
    catch (err) {
        console.log(err);
        return false
    }
}

// Add device token associated to the user
async function addDeviceToken(deviceToken:string, userID:string): Promise<boolean>{

    console.log("Add Device token to User");

    const query = {
      text: "UPDATE User_Device SET device_token = $1  WHERE id = $2",
      values: [deviceToken, userID],
    }
  
    try{
      let res = await client.query(query)
      return true
    }
    catch(err){
      console.log(err);
      return false
    }
}

// Create new topic
async function createTopic(name:string, identification_token:string) : Promise<boolean>{
    
    console.log("Create Topic");

    const query = {
      text: 'INSERT INTO Topic(name, identification_token) VALUES($1, $2)',
      values: [name, identification_token],
    }
  
    try{
      let res = await client.query(query)
      return true
    }
    catch(err){
      console.log(err);
      return false
    }
}

// Delete existing topic
async function deleteTopic(topicId:String) : Promise<boolean>{
    
    console.log("Delete Topic");

    const query = {
        text: 'DELETE FROM Topic WHERE id = $1',
        values: [topicId],
    }

    try{
        let res = await client.query(query)
        return true
    }
    catch(err){
        console.log(err);
        return false
    }
}

// Create new notification
async function createNotification(userID:string,identification_token:string,title:string,content:string) : Promise<boolean>{
    const query = {
        text: 'INSERT INTO Notifications(userID, description, author) VALUES($1, $2, $3)',
        values: [userID, 'My notification description', 'James Bond'],
    }

    try{
        let res = await client.query(query)
        return true
    }
    catch(err){
        console.log(err);
        return false
    }

}

// Return all notifications sent to the user
async function getAllNotifications(userID:string) {
    const query = {
        text: 'SELECT * FROM Notifications WHERE userID = $1',
        values: [userID]
    }

    try{
        return await client.query(query)
    }
    catch(err){
        console.log(err);
        return null
    }
}

export default {
    getDeviceToken,
    addDeviceToken,

    createTopic,
    deleteTopic,

    createNotification,
    getAllNotifications,
}
