var socket = io();

var params = jQuery.deparam(window.location.search); //Gets the id from url

var timer;

var time = 30;

var currentQuestionNum = 1;

//When host connects to server
socket.on('connect', function() {

    //Tell server that it is host connection from game view
    socket.emit('host-join-game', params);
});

socket.on('noGameFound', function() {
    window.location.href = '../../'; //Redirect user to 'join game' page
});

socket.on('gameQuestions', function(data) {
    document.getElementById('question').innerHTML = data.q1;
    document.getElementById('answer1').innerHTML = data.a1;
    document.getElementById('answer2').innerHTML = data.a2;
    document.getElementById('answer3').innerHTML = data.a3;
    document.getElementById('answer4').innerHTML = data.a4;
    var correctAnswer = data.correct;
    document.getElementById('playersAnswered').innerHTML = "Respuesta de Jugadores: 0 / " + data.playersInGame;
    document.getElementById('questionNumCount').innerHTML = data.questionsCount;
    document.getElementById('currentQuestionNum').innerHTML = currentQuestionNum;

    updateTimer();
});

socket.on('updatePlayersAnswered', function(data) {
    document.getElementById('playersAnswered').innerHTML = "Respuesta de Jugadores: " + data.playersAnswered + " / " + data.playersInGame;
});

socket.on('questionOver', function(playerData, correct) {
    clearInterval(timer);
    var answer1 = 0;
    var answer2 = 0;
    var answer3 = 0;
    var answer4 = 0;
    var total = 0;
    //Hide elements on page
    document.getElementById('playersAnswered').style.display = "none";
    document.getElementById('timerText').style.display = "none";

    //Shows user correct answer with effects on elements
    if (correct == 1) {
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer1').innerHTML;
        document.getElementById('answer1').innerHTML = "&#10004" + " " + current;
    } else if (correct == 2) {
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer2').innerHTML;
        document.getElementById('answer2').innerHTML = "&#10004" + " " + current;
    } else if (correct == 3) {
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer4').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer3').innerHTML;
        document.getElementById('answer3').innerHTML = "&#10004" + " " + current;
    } else if (correct == 4) {
        document.getElementById('answer1').style.filter = "grayscale(50%)";
        document.getElementById('answer2').style.filter = "grayscale(50%)";
        document.getElementById('answer3').style.filter = "grayscale(50%)";
        var current = document.getElementById('answer4').innerHTML;
        document.getElementById('answer4').innerHTML = "&#10004" + " " + current;
    }

    for (var i = 0; i < playerData.length; i++) {
        if (playerData[i].gameData.answer == 1) {
            answer1 += 1;
        } else if (playerData[i].gameData.answer == 2) {
            answer2 += 1;
        } else if (playerData[i].gameData.answer == 3) {
            answer3 += 1;
        } else if (playerData[i].gameData.answer == 4) {
            answer4 += 1;
        }
        total += 1;
    }

    //Gets values for graph
    answer1 = answer1 / total * 100;
    answer2 = answer2 / total * 100;
    answer3 = answer3 / total * 100;
    answer4 = answer4 / total * 100;

    document.getElementById('square1').style.display = "inline-block";
    document.getElementById('square2').style.display = "inline-block";
    document.getElementById('square3').style.display = "inline-block";
    document.getElementById('square4').style.display = "inline-block";

    document.getElementById('square1').style.height = answer1 + "px";
    document.getElementById('square2').style.height = answer2 + "px";
    document.getElementById('square3').style.height = answer3 + "px";
    document.getElementById('square4').style.height = answer4 + "px";

    document.getElementById('nextQButton').style.display = "block";

});

function nextQuestion() {
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";

    document.getElementById('answer1').style.filter = "none";
    document.getElementById('answer2').style.filter = "none";
    document.getElementById('answer3').style.filter = "none";
    document.getElementById('answer4').style.filter = "none";

    document.getElementById('playersAnswered').style.display = "block";
    currentQuestionNum = currentQuestionNum + 1;
    document.getElementById('currentQuestionNum').innerHTML = currentQuestionNum;
    document.getElementById('timerText').style.display = "block";
    document.getElementById('num').innerHTML = " 30";
    socket.emit('nextQuestion'); //Tell server to start new question
}

function updateTimer() {
    time = 30;
    timer = setInterval(function() {
        time -= 1;
        document.getElementById('num').textContent = " " + time;
        if (time == 0) {
            socket.emit('timeUp');
        }
    }, 1000);
}
socket.on('GameOver', function(data) {

    document.getElementById('questionNum').style.display = "none";
    document.getElementById('nextQButton').style.display = "none";
    document.getElementById('square1').style.display = "none";
    document.getElementById('square2').style.display = "none";
    document.getElementById('square3').style.display = "none";
    document.getElementById('square4').style.display = "none";

    document.getElementById('answer1').style.display = "none";
    document.getElementById('answer2').style.display = "none";
    document.getElementById('answer3').style.display = "none";
    document.getElementById('answer4').style.display = "none";
    document.getElementById('timerText').innerHTML = "";
    document.getElementById('question').innerHTML = "GAME OVER";
    document.getElementById('playersAnswered').innerHTML = "";


    document.getElementById('nombrewinner1').style.display = "inline-block";
    document.getElementById('nombrewinner2').style.display = "inline-block";
    document.getElementById('nombrewinner3').style.display = "inline-block";
    document.getElementById('nombrewinner4').style.display = "inline-block";
    document.getElementById('nombrewinner5').style.display = "inline-block";

    document.getElementById('puntajewinner1').style.display = "inline-block";
    document.getElementById('puntajewinner2').style.display = "inline-block";
    document.getElementById('puntajewinner3').style.display = "inline-block";
    document.getElementById('puntajewinner4').style.display = "inline-block";
    document.getElementById('puntajewinner5').style.display = "inline-block";


    document.getElementById('winnerTitle').style.display = "block";


    if (data.nombre1 != "") {
        document.getElementById('nombrewinner1').innerHTML = "1. " + data.nombre1 + " - ";
        document.getElementById('puntajewinner1').innerHTML = data.num1 + "Puntos";

    }

    if (data.nombre2 != "") {
        document.getElementById('nombrewinner2').innerHTML = "2. " + data.nombre2 + " - ";
        document.getElementById('puntajewinner2').innerHTML = data.num2 + "Puntos";
    }

    if (data.nombre3 != "") {
        document.getElementById('nombrewinner3').innerHTML = "3. " + data.nombre3 + " - ";
        document.getElementById('puntajewinner3').innerHTML = data.num3 + "Puntos";

    }

    if (data.nombre4 != "") {
        document.getElementById('nombrewinner4').innerHTML = "4. " + data.nombre4 + " - ";
        document.getElementById('puntajewinner4').innerHTML = data.num4 + "Puntos";

    }

    if (data.nombre5 != "") {
        document.getElementById('nombrewinner5').innerHTML = "5. " + data.nombre5 + " - ";
        document.getElementById('puntajewinner5').innerHTML = data.num5 + "Puntos";

    }

});


socket.on('getTime', function(player) {
    socket.emit('time', {
        player: player,
        time: time
    });
});