import User from "@/models/User";
import Group from "@/models/Group";

import UserData from "@/data/users.json";
import GroupData from "@/data/groups.json";

export async function populate() {
  await User.deleteMany({});
  await User.insertMany(UserData);

  console.log(await User.find());

  await Group.deleteMany({});
  await Group.insertMany(GroupData);

  console.log(await Group.find());
}
