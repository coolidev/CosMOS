
export function updateSocketId(socket, email? : string) {
    if(email == null) email = getSocketId();
    if(email == null) console.warn(`Couldn't find an email to establish websocket`);
    socket.send(JSON.stringify({sessionId:email ?? (new Date()).getTime()}));
}

export function getSocketId() {
    return window.localStorage.getItem('email');
}