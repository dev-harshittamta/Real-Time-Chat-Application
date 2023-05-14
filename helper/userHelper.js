const users = [];

function newUser(id, username, room){
    const user = {
        id,
        username,
        room
    };
    users.push(user);
    return user;
}

function getActiveUser(id){
    return users.find(user => user.id === id);
}

function exitRoom(id){
   const user = getActiveUser(id);
    if(user){
        const index = users.indexOf(user);
        return users.splice(index, 1)[0];
    }
}

function getIndividualRoomUsers(room){
    return users.filter(user => user.room === room);
}


module.exports = {
    newUser,
    getActiveUser,
    exitRoom,
    getIndividualRoomUsers
}
