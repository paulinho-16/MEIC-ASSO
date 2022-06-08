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
        text: "SELECT * from User_Device WHERE userId = $1",
        values: [userID],
    }

    try {
        let res = await client.query(query)
        return res.rows[0]["devicetoken"]
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
        text: "INSERT INTO User_Device(userId, deviceToken) VALUES($1, $2)",
        values: [userID,deviceToken],
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
async function createTopic(name:string, topicTokenId:string) : Promise<boolean>{

    console.log("Create Topic");

    const query = {
        text: 'INSERT INTO Topic(name, tokenId) VALUES($1, $2)',
        values: [name, topicTokenId],
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
async function deleteTopic(topicTokenId:string) : Promise<boolean>{

    console.log("Delete Topic");

    const query = {
        text: 'DELETE FROM Topic WHERE tokenId = $1',
        values: [topicTokenId],
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
async function createNotification(userID:string, topicTokenId:string,title:string,content:string) : Promise<boolean>{
    const query = {
        text: 'INSERT INTO Notifications(userID, content, title, topicTokenId) VALUES($1, $2, $3, $4)',
        values: [userID, content, title, topicTokenId],
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

// Return all notifications sent to the user
async function getTopics() {
    const query = {
        text: 'SELECT name FROM Notifications',
    }

    try{
        return await client.query(query)
    }
    catch(err){
        console.log(err);
        return null
    }
}

async function createErrorLog(code:string, message:string){
    const query = {
        text: 'INSERT INTO Notification_Error_Log(code, description) VALUES($1, $2)',
        values: [parseInt(code), message],
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

export default {
    getDeviceToken,
    addDeviceToken,

    createTopic,
    deleteTopic,

    createNotification,
    getAllNotifications,

    getTopics,
    createErrorLog,
}
