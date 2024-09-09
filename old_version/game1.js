const startGameBtn = document.querySelector("#start_game_btn"),
    gameMoveBtn = document.querySelector("#game_move_btn"),
    choiceReadyBtn = document.querySelector("#choice_ready_btn"),
    gameSection = document.querySelector("#game-section");

let stepCounter = 0,
    playerMoveStep = 0,
    roundCounter = 1,
    activePlayer,
    inactivePlayer,
    playerOne,
    playerTwo;

startGameBtn.onclick = startGame;
gameMoveBtn.onclick = handleGameMove;
choiceReadyBtn.onclick = handleChoiceReady;

// navigation in game
function clearSelections(choiceName) { //clear radio input in the form
    document.getElementsByName(choiceName).forEach(input => input.checked = false);
}

function toggleVisibility(selector, isVisible) { //  show hide section 
    document.querySelector(selector).style.display = isVisible ? "block" : "none";
}

function updateForm(player) { // show plug isted of form
    toggleVisibility("#choice-block", true);
    toggleVisibility("#choice-plug", false);
    document.querySelector("#choice-block h2").innerHTML = `<b>${player.nickname}</b>, it's your turn`;
}

function updateRoundDisplay() { // update round number text 
    document.querySelector("#step_block").textContent = `${roundCounter} round`;
}

function updateUIForNextMove(nickname) { // show plug between players
    toggleVisibility("#choice-block", false);
    toggleVisibility("#choice-plug", true);
    document.querySelector("#choice-plug h2").innerHTML = `<b>${nickname}</b>, are you ready?`;
}

function updatePlayerOutline(activePlayer) { // show outline on player turn
    const playerOneElem = document.querySelector("#player-one"),
        playerTwoElem = document.querySelector("#player-two");

    // if (activePlayer == 1) {
    //     playerOneElem.classList.add("outline outline-4 outline-orange-600");
    //     playerTwoElem.classList.remove("outline outline-4 outline-orange-600");
    // } else {
    //     playerTwoElem.classList.add("outline outline-4 outline-orange-600");
    //     playerOneElem.classList.remove("outline outline-4 outline-orange-600");
    // }
}



function logPlayerAction(player, opponent) { //fighting log
    const blockSuccess = opponent.attackChoice && player.defenseChoice.includes(opponent.attackChoice);
    const actionLog = document.createElement("p");
    actionLog.className = 'text-lg';

    if (blockSuccess) {
        actionLog.innerHTML = `<b>${player.nickname}</b> successfully blocked <b>${opponent.nickname}'s</b> attack`;
    } else {
        opponent.dealDamage(player);
    }

    document.querySelector("#game-log").appendChild(actionLog);
}
function logRoundInfo(roundNumber, player1, player2) {
    const roundLog = document.createElement("p");
    roundLog.className = 'mt-5 mb-1 pb-2 text-2xl text-orange-600 font-bold border-b-2';
    roundLog.innerHTML = `<b>${roundNumber}</b> round`;
    document.querySelector("#game-log").appendChild(roundLog);

    logPlayerAction(player1, player2);
    logPlayerAction(player2, player1);

    player1.updateStats("one");
    player2.updateStats("two");
}



function startGame() {
    playerOne = new Character(
        document.querySelector("#user-one-name").value, 20, 15, 18
    );

    playerTwo = new Character(
        document.querySelector("#user-two-name").value, 20, 15, 18
    );

    toggleVisibility("#menu-section", false);
    toggleVisibility("#game-section", true);

    playerOne.updateStats("one");
    playerTwo.updateStats("two");

    updateRoundDisplay();
    switchActivePlayer();
    updateForm(activePlayer);
}

function handleGameMove() {
    playerMoveChoice(activePlayer, inactivePlayer);

    if (stepCounter % 2 !== 0) {
        proceedToNextRound();
    }

    stepCounter++;
}

function handleChoiceReady() {
    switchActivePlayer();
    updateForm(activePlayer);
}

function playerMoveChoice(player, opponent) {
    const defenseChoice = getSelectedChoice("player-defense-action");
    const attackChoice = getSelectedChoice("player-attack-action");


    console.log(player);
    console.log(opponent);
    console.log(defenseChoice);
    console.log(attackChoice);

    player.setMoveChoice(defenseChoice, attackChoice);
    clearSelections("player-defense-action");
    clearSelections("player-attack-action");

    updateUIForNextMove(opponent.nickname);
}

function getSelectedChoice(choiceName) {
    const choices = document.getElementsByName(choiceName);
    let selectedChoice = "";
    
    choices.forEach(input => {
        if (input.checked) {
            selectedChoice = input.value;
            input.checked = false;
        }
    });

    return selectedChoice;
}

function switchActivePlayer() {
    const isPlayerOneTurn = playerMoveStep % 2 === 0;

    activePlayer = isPlayerOneTurn ? playerOne : playerTwo;
    inactivePlayer = isPlayerOneTurn ? playerTwo : playerOne;

    updatePlayerOutline(activePlayer, inactivePlayer);
    playerMoveStep++;
}

function proceedToNextRound() {
    updateRoundDisplay();

    logRoundInfo(roundCounter, playerOne, playerTwo);
    
    roundCounter++;

    if (isPlayerDefeated(playerOne, playerTwo)) {
        alert('Game Over');
    }
}

function isPlayerDefeated(player1, player2) { // check if one players is defeated
    return player1.health <= 0 || player2.health <= 0;
}
