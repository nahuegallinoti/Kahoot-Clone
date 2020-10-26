var socket = io();
var playerAnswered = false;
var correct = false;
var name;
var score = 0;

var timer;
var params = jQuery.deparam(window.location.search); //Gets the id from url

function updateTimer() {
    time = 30;
    timer = setInterval(function() {
        time -= 1;
        document.getElementById('num').textContent = "Tiempo restante: " + time;
        if (time == 0) {
            endTime();
        }
    }, 1000)

};

function endTime() {
    clearTimeout(timer);
    document.getElementById('question').style.visibility = "hidden";
    document.getElementById('timerText').style.visibility = "hidden";
    document.getElementById('num').style.visibility = "hidden";

    if (correct == true) {
        document.body.style.backgroundColor = "#4CAF50";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Correcto!";

    } else {
        document.body.style.backgroundColor = "#f94a1e";
        document.getElementById('message').style.display = "block";
        document.getElementById('message').innerHTML = "Incorrecto!";

        document.getElementById('feedback').style.display = "block";


    }
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    socket.emit('getScore');
}

socket.on('connect', function() {
    //Tell server that it is host connection from game view
    socket.emit('player-join-game', params);

    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
    document.getElementById('question').style.visibility = "visible";
    document.getElementById('timerText').style.visibility = "visible";
    document.getElementById('num').style.visibility = "visible";

    document.getElementById('feedback').style.display = "none";


});

socket.on('noGameFound', function() {
    window.location.href = '../../'; //Redirect user to 'join game' page 
});

function answerSubmitted(num) {
    if (playerAnswered == false) {
        playerAnswered = true;

        socket.emit('playerAnswer', num); //Sends player answer to server

        //Hiding buttons from user
        document.getElementById('answer1').style.visibility = "hidden";
        document.getElementById('answer2').style.visibility = "hidden";
        document.getElementById('answer3').style.visibility = "hidden";
        document.getElementById('answer4').style.visibility = "hidden";
        document.getElementById('timerText').style.visibility = "hidden";
        document.getElementById('num').style.visibility = "hidden";
        document.getElementById('message').style.display = "block";
        document.getElementById('question').style.visibility = "hidden";
        document.getElementById('message').innerHTML = "Esperando que los demás participantes respondan...";
        clearTimeout(timer);

    }
}

//Get results on last question
socket.on('answerResult', function(data) {
    if (data == true) {
        correct = true;
    }
});

socket.on('questionOver', function(data) {
    endTime();
});

socket.on('newScore', function(data) {
    document.getElementById('scoreText').innerHTML = "Puntaje: " + data;
});

socket.on('nextQuestionPlayer', function() {
    correct = false;
    playerAnswered = false;

    document.getElementById('timerText').style.visibility = "visible";
    document.getElementById('num').style.visibility = "visible";
    document.getElementById('question').style.visibility = "visible";
    document.getElementById('answer1').style.visibility = "visible";
    document.getElementById('answer2').style.visibility = "visible";
    document.getElementById('answer3').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
    document.getElementById('answer4').style.visibility = "visible";
    document.getElementById('message').style.display = "none";
    document.getElementById('feedback').style.display = "none";
    document.body.style.backgroundColor = "white";

});

socket.on('hostDisconnect', function() {
    window.location.href = "../../";
});

socket.on('playerGameData', function(data) {
    for (var i = 0; i < data.length; i++) {
        if (data[i].playerId == socket.id) {
            document.getElementById('nameText').innerHTML = "Nombre: " + data[i].name;
            document.getElementById('scoreText').innerHTML = "Puntaje: " + data[i].gameData.score;
        }
    }
});

socket.on('gameQuestions', function(data) {

    document.getElementById('timerText').style.visibility = "visible";
    document.getElementById('num').style.visibility = "visible";

    document.getElementById('num').innerHTML = " 30";

    document.getElementById('question').innerHTML = data.q1;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3;
    document.getElementById('answer4').innerHTML = data.a4;
    document.getElementById('feedback').innerHTML = data.feedback;

    var correctAnswer = data.correct;

    updateTimer();

});

socket.on('GameOver', function() {
    document.body.style.backgroundColor = "#FFFFFF";
    document.getElementById('num').style.visibility = "hidden";
    document.getElementById('timerText').style.visibility = "hidden";
    document.getElementById('question').style.visibility = "hidden";
    document.getElementById('answer1').style.visibility = "hidden";
    document.getElementById('answer2').style.visibility = "hidden";
    document.getElementById('answer3').style.visibility = "hidden";
    document.getElementById('answer4').style.visibility = "hidden";
    document.getElementById('message').style.display = "block";
    document.getElementById('message').innerHTML = "GAME OVER";
});