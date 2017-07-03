let functions = require('firebase-functions');
let admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
exports.sendPush = functions.database.ref('/posts/{projectId}').onWrite(event => {
    let projectStateChanged = false;
    let projectCreated = false;

    let projectData = event.data.val();
    var projectDataKey = event.data.key;
    if (!event.data.previous.exists()) {
        projectCreated = true;
    }
    if (!projectCreated && event.data.changed()) {
        projectStateChanged = true;
    }
    let msg = 'A project state was changed';
	if (projectCreated) {
			msg = `${projectData.author} has added new event : ${projectData.title}`;
	}
	var actionUrl = '/#/viewevent/'+projectDataKey;
	return loadUsers().then(users => {
        let tokens = [];
        for (let user of users) {
		if(user.token && user.token != null){
	            	tokens.push(user.token);
		}
        }
        let payload = { 
        
	  data: {
                title: 'New Event Added - Projectagram',
                body: msg,
                sound: 'default',
                badge: '1',
		click_action : actionUrl
            	}
	
	    
        };
	if(projectCreated){
        	return admin.messaging().sendToDevice(tokens, payload);
	}
    });
});

exports.sendPushNewUser = functions.database.ref('/users/{projectId}').onWrite(event => {
    let projectStateChanged = false;
    let projectCreated = false;

    let projectData = event.data.val();
    var projectDataKey = event.data.key;
    if (!event.data.previous.exists()) {
        projectCreated = true;
    }
    if (!projectCreated && event.data.changed()) {
        projectStateChanged = true;
    }
    let msg = 'A new user is added';
    if (projectCreated) {
            msg = `${projectData.name} just joined Projectagram.`;
    }
    var actionUrl = '/#/detail/'+projectDataKey;
    return loadUsers().then(users => {
        let tokens = [];
        for (let user of users) {
        if(user.token && user.token != null){
                    tokens.push(user.token);
        }
        }
        let payload = { 
        
        data: {
                title: 'New User Added - Projectagram',
                body: msg,
                sound: 'default',
                badge: '1',
                click_action : actionUrl
            }
    
        
        };
        if(projectCreated){
                    return admin.messaging().sendToDevice(tokens, payload);
        }
    });
});

exports.sendPushNewRandR = functions.database.ref('/randr/{projectId}').onWrite(event => {
    let projectStateChanged = false;
    let projectCreated = false;

    let projectData = event.data.val();
    var projectDataKey = event.data.key;
    if (!event.data.previous.exists()) {
        projectCreated = true;
    }
    if (!projectCreated && event.data.changed()) {
        projectStateChanged = true;
    }
    let msg = 'New R and R is added';
    if (projectCreated) {
            msg = `${projectData.title} - R and R is added to Projectagram.`;
    }
    var actionUrl = '/#/rewardslist/'+projectDataKey;
    return loadUsers().then(users => {
        let tokens = [];
        for (let user of users) {
        if(user.token && user.token != null){
                    tokens.push(user.token);
        }
        }
        let payload = { 
        
        data: {
                title: 'New R and R Added - Projectagram',
                body: msg,
                sound: 'default',
                badge: '1',
                click_action : actionUrl
            }
    
        
        };
        if(projectCreated){
                    return admin.messaging().sendToDevice(tokens, payload);
        }
    });
});

exports.sendPushPostWall = functions.database.ref('/profilewall/{projectId}/{userId}').onWrite(event => {
        
        var projectDataKeyInitial = event.params.projectId;
        let projectStateChanged = false;
        let projectCreated = false;

        if (!event.data.previous.exists()) {
            projectCreated = true;
        }
        if (!projectCreated && event.data.changed()) {
            projectStateChanged = true;
        }

        let projectData = event.data.val();
        //var projectDataKey = event.data.key;
        
            
        let msg = `${projectData.sendername} - Posted on your wall`;
        var actionUrl = '/#/detail/'+projectDataKeyInitial;
        return loadUsersWallPost(projectDataKeyInitial).then(users => {
                    let tokens = [];
                    for (let user of users) {
                    
                    if(user.token && user.token != null){
                                tokens.push(user.token);
                    }
                    }
                    let payload = { 
                    
                    data: {
                            title: 'New Post - Projectagram',
                            body: msg,
                            sound: 'default',
                            badge: '1',
                            click_action : actionUrl
                        }
                
                    
                    };
                    if(projectCreated == true && tokens && tokens != null && tokens.length > 0){
                        return admin.messaging().sendToDevice(tokens, payload);
                    }
                    
            });


    
    
});

exports.sendPushTeamAnnouncements = functions.database.ref('/announcements/{projectId}/{userId}').onWrite(event => {
        
        var projectDataKeyInitial = event.params.projectId;
        let projectStateChanged = false;
        let projectCreated = false;

        if (!event.data.previous.exists()) {
            projectCreated = true;
        }
        if (!projectCreated && event.data.changed()) {
            projectStateChanged = true;
        }

        let projectData = event.data.val();
        //var projectDataKey = event.data.key;
        
            
        let msg = `${projectData.sendername} - Posted on Team Announcements`;
        var actionUrl = '/#/list/'+projectDataKeyInitial;
        return loadUsers().then(users => {
                    let tokens = [];
                    for (let user of users) {
                    
                    if(user.token && user.token != null){
                                tokens.push(user.token);
                    }
                    }
                    let payload = { 
                    
                    data: {
                            title: 'New Announcement - Projectagram',
                            body: msg,
                            sound: 'default',
                            badge: '1',
                            click_action : actionUrl
                        }
                
                    
                    };
                    if(projectCreated == true && tokens && tokens != null && tokens.length > 0){
                        return admin.messaging().sendToDevice(tokens, payload);
                    }
                    
            });


    
    
});

function loadUsers() {
    let dbRef = admin.database().ref('/users');
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
            let data = snap.val();
            let users = [];
            for (var property in data) {
                users.push(data[property]);
            }
            resolve(users);
        }, (err) => {
            reject(err);
        });
    });
    return defer;
}

function loadUsersWallPost(uid) {
    
    var reff = '/users';

    let dbRef = admin.database().ref(reff);
    let defer = new Promise((resolve, reject) => {
        dbRef.once('value', (snap) => {
                    let data = snap.val();
                    
                    let users = [];
                    for (var property in data) {
                        
                        if(property == uid){
                            users.push(data[property]);
                        }
                    }
                    resolve(users);
                
            
        }, (err) => {
            reject(err);
        });
    });
    return defer;
}
