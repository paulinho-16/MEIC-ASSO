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


//devolve os tokens associados ao userID
async function getDevicesTokens(userID:string){
    return "ewqqwe"
}

//associa o device token ao user id
async function addDeviceToken(deviceToken:string,userID:string): Promise<boolean>{
    return true
}

//desassocia o device token do user id
async function removeDeviceToken(deviceToken:string,userID:string) : Promise<boolean>{
    return true
}

//verifica se nome já existe, se não cria o topico
async function createTopic(name:string,identification_token:string) : Promise<boolean>{
    return true
}


//verifica se identification_token existe, se sim elimina esse topico
async function deleteTopic(identification_token:string) : Promise<boolean>{
    return true
}

//verifica se existe um topico com o identification_token e cria uma notificação
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

async function getAllNotifications(userID:string) {
    const query = {
        text: 'SELECT * FROM Notifications WHERE userID=$1',
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
    getDevicesTokens,
    addDeviceToken,
    removeDeviceToken,

    createTopic,
    deleteTopic,

    createNotification,
    getAllNotifications,
}
