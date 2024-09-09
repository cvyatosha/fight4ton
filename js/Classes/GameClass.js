class Game {
    constructor() {
        this.stepCounter = 0;
        this.playerMoveStep = 0;
        this.roundCounter = 1;

        this.startGameBtn = document.querySelector("#start_game_btn");
        this.gameMoveBtn = document.querySelector("#game_move_btn");
        this.choiceReadyBtn = document.querySelector("#choice_ready_btn");

        this.startGameBtn.onclick = () => this.startGame();
        this.gameMoveBtn.onclick = () => this.handleGameMove();
        this.choiceReadyBtn.onclick = () => this.handleChoiceReady();
    }

    startGame() {
        this.playerOne = new Character(
            document.querySelector("#user-one-name").value, 20, 15, 18
        );
        this.playerTwo = new Character(
            document.querySelector("#user-two-name").value, 20, 15, 18
        );

        this.toggleVisibility("#menu_section", false);
        this.toggleVisibility("#game-section", true);

        this.playerOne.updateStats("one");
        this.playerTwo.updateStats("two");

        this.updateRoundDisplay();
        this.switchActivePlayer();
        this.updateForm(this.activePlayer);
    }

    handleGameMove() {
        this.playerMoveChoice(this.activePlayer, this.inactivePlayer);

        if (this.stepCounter % 2 !== 0) {
            this.proceedToNextRound();
        }

        this.stepCounter++;
    }

    handleChoiceReady() {
        this.switchActivePlayer();
        this.updateForm(this.activePlayer);
    }

    playerMoveChoice(player, opponent) {
        const defenseChoice = this.getSelectedChoice("player-defense-action");
        const attackChoice = this.getSelectedChoice("player-attack-action");

        player.setMoveChoice(defenseChoice, attackChoice);
        this.clearSelections("player-defense-action");
        this.clearSelections("player-attack-action");

        this.updateUIForNextMove(opponent.nickname);
    }

    switchActivePlayer() {
        const isPlayerOneTurn = this.playerMoveStep % 2 === 0;

        this.activePlayer = isPlayerOneTurn ? this.playerOne : this.playerTwo;
        this.inactivePlayer = isPlayerOneTurn ? this.playerTwo : this.playerOne;

        this.updatePlayerOutline(isPlayerOneTurn);
        this.playerMoveStep++;
    }

    proceedToNextRound() {
        this.updateRoundDisplay();
        this.logRoundInfo(this.roundCounter, this.playerOne, this.playerTwo);
        
        this.roundCounter++;

        if (this.isPlayerDefeated(this.playerOne, this.playerTwo)) {
            alert('Game Over');
        }
    }

    getSelectedChoice(choiceName) {
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

    clearSelections(choiceName) {
        document.getElementsByName(choiceName).forEach(input => input.checked = false);
    }

    toggleVisibility(selector, isVisible) {
        document.querySelector(selector).style.display = isVisible ? "block" : "none";
    }

    updateRoundDisplay() {
        document.querySelector("#step_block").textContent = `${this.roundCounter} round`;
    }

    updateUIForNextMove(nickname) {
        this.toggleVisibility("#choice-block", false);
        this.toggleVisibility("#choice-plug", true);
        document.querySelector("#choice-plug h2").innerHTML = `<b>${nickname}</b>, are you ready?`;
    }

    updatePlayerOutline(isPlayerOneTurn) {
        const playerOneElem = document.querySelector("#player-one"),
            playerTwoElem = document.querySelector("#player-two");

        playerOneElem.classList.toggle("outline outline-4 outline-orange-600", isPlayerOneTurn);
        playerTwoElem.classList.toggle("outline outline-4 outline-orange-600", !isPlayerOneTurn);
    }

    logRoundInfo(roundNumber, player1, player2) {
        const roundLog = document.createElement("p");
        roundLog.className = 'mt-5 mb-1 pb-2 text-2xl text-orange-600 font-bold border-b-2';
        roundLog.innerHTML = `<b>${roundNumber}</b> round`;
        document.querySelector("#game-log").appendChild(roundLog);

        this.logPlayerAction(player1, player2);
        this.logPlayerAction(player2, player1);

        player1.updateStats("one");
        player2.updateStats("two");
    }

    logPlayerAction(player, opponent) {
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

    isPlayerDefeated(player1, player2) {
        return player1.health <= 0 || player2.health <= 0;
    }

    updateForm(player) {
        this.toggleVisibility("#choice-block", true);
        this.toggleVisibility("#choice-plug", false);
        document.querySelector("#choice-block h2").innerHTML = `<b>${player.nickname}</b>, it's your turn`;
    }
}

// Initialize the game
const game = new Game();
