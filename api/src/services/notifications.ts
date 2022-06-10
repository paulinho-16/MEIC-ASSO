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

    const query = {
        text: "SELECT * from User_Device WHERE userId = $1",
        values: [userID],
    }

    try {
        const res = await client.query(query)
        if(res.rows.length == 0){
            return false
        }
        return res.rows[0]["devicetoken"]
    }
    catch (err) {
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
        await client.query(query);
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
        await client.query(query);
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
        await client.query(query);
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
        await client.query(query);
        return true
    }
    catch(err){
        console.log(err);
        return false
    }
}

async function checkIfIgnored(userID: string, topicTokenId: string){
    const checkQuery = {
        text: 'SELECT name FROM Topic LEFT JOIN Notification_ignore  on name = topicname where Notification_ignore.userid = $1 AND topic.tokenid = $2',
        values: [userID,topicTokenId],
    }

    try{
        const ret = await client.query(checkQuery);
        if(ret.rows.length > 0) return true
        return false
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
        text: 'SELECT name as topic FROM Topic',
    }

    try{
        return (await client.query(query))["rows"]
    }
    catch(err){
        console.log(err);
        return null
    }
}

// Return all notifications sent to the user
async function getBlockedTopics(user: string) {
    const query = {
        text: 'SELECT topicname as topic FROM Notification_Ignore where userId = $1',
        values: [user]
    }

    try{
        return (await client.query(query))["rows"]
    }
    catch(err){
        console.log(err);
        return null
    }
}

async function ignoreTopics(topics: string[],userId: string){

    try{
        for (const topic of topics) {
            const query = {
                text: 'INSERT INTO Notification_Ignore(userId, topicName) VALUES($1, $2)',
                values: [userId, topic],
            }
            await client.query(query)
        }
    }
    catch(err){
        console.log(err);
        return false
    }
}



async function stopIgnoreTopics(topics: string[],userId: string){

    try{
        for (const topic of topics) {
            const query = {
                text: 'DELETE FROM Notification_Ignore WHERE userId = $1 and topicName = $2',
                values: [userId, topic],
            }
            await client.query(query)
        }
    }
    catch(err){
        console.log(err);
        return false
    }
}


async function createErrorLog(code:string, message:string){
    const query = {
        text: 'INSERT INTO Notification_Error_Log(code, description) VALUES($1, $2)',
        values: [parseInt(code), message],
    }

    try{
        await client.query(query);
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
    getBlockedTopics,

    ignoreTopics,
    stopIgnoreTopics,
    checkIfIgnored,

    createErrorLog,
}
