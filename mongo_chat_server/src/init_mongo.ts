import mongoose from "mongoose";
import User from "./models/User";
import Group from "./models/Group";
import users from "./data/users.json";
import groups from "./data/groups.json";
import {IUser} from "./@types/user";

const initMongo = async () => {
    mongoose.connect(
        process.env.MONGODB_URI, {
        user: process.env.MONGO_INITDB_ROOT_USERNAME,
        pass: process.env.MONGO_INITDB_ROOT_PASSWORD
    }
    ).then(() => console.log('MongoDB Connected'))
        .catch(err => console.log('MongoDB NOT Connected: ' + err.message));

    await User.deleteMany({})
    await Group.deleteMany({})

    User.insertMany(users)
        .then(async function () {
            console.log("Users inserted to Collection");
            groups.map(async (g) => {
                const usersS:string[] = g.users;
                const newGroup = new Group({ name: g.name});
                
                for(let i = 0; i < usersS.length; i++) {
                    const u:IUser = await User.findById(usersS[i]);
                    newGroup.users.push(u);
                }

                newGroup.save()
                    .then((res) => {
                        console.log("OLA", res);

                        /*Group.findById()
                            .populate('users')
                            .then(() => console.log("ESTA"))*/
                    });
            })
        })
        .catch(function (err) {
            console.log(err);
        });

    /*const usersList = await User.find();
    const insertingGroups: mongoose.AnyObject = [];
    groups.map((group) => {
        const usernames = group.users;
        const gUsers: (mongoose.Document<unknown, any, { _id: string; name: string; online: boolean; }> & { _id: string; name: string; online: boolean; } & { _id: string; })[] = [];
        usernames.forEach((u) => {
            const user = new User(usersList.filter((ele) => u === ele._id)[0]);
            gUsers.push()
        })
        const g = { name: group.name, users: gUsers };
        insertingGroups.push(g);
    })

    groups.map((g) => {
        const newGroup = new Group(g);
        newGroup.save(function (error) {
            console.log(error);
            if (!error) {
                Group.find({})
                    .populate('users')
                    .then(() => console.log("ESTA"))
            }
        });
    })

    Group.insertMany(insertingGroups)
    .then(function () {
        console.log("Groups inserted to Collection");
    })
    .catch(function (err) {
        console.log(err);
    });*/
}

export default initMongo;
