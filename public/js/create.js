var socket = io();

socket.on('connect', function() {
    socket.emit('requestDbNames'); //Get database names to display to user
});

socket.on('gameNamesData', function(data) {
    for (var i = 0; i < Object.keys(data).length; i++) {

        var ul = document.getElementById('game-list');
        var li = document.createElement('li');
        li.setAttribute('id', 'gameButton');
        li.innerHTML = data[i].name;

        li.className = "list-group-item list-group-item-primary salasCreadas";
        li.setAttribute('onClick', "startGame('" + data[i].id + "')");

        ul.appendChild(li);
        ul.appendChild(document.createElement('br'));
        ul.appendChild(document.createElement('br'));


    }
});

function startGame(data) {
    window.location.href = "/host/" + "?id=" + data;
}