const startGameBtn = document.querySelector("#start_game_btn"),
    gameMoveBtn = document.querySelector("#game_move_btn"),
    choiceReadyBtn = document.querySelector("#choice_ready_btn");

let round_counter = 1,
    step_counter = 0,
    player_move_step = 0;

let player_one,
    player_two;

let active_player,
    inactive_player;

let timer,
    timer_time = 59; // enter i n second, if you want 1 min enter 60 sec


startGameBtn.onclick = startGame;
gameMoveBtn.onclick = handleGameMove;
choiceReadyBtn.onclick = handlePlayerReady;



function startGame() {
    player_one = new Character(
        document.querySelector("#p1_character_image").src, 
        document.querySelector("#user-one-name").value, 
        document.querySelector("#character-one-strength").value, 
        document.querySelector("#character-one-agility").value, 
        document.querySelector("#character-one-endurance").value
    );

    player_two = new Character(
        document.querySelector("#p2_character_image").src,
        document.querySelector("#user-two-name").value,
        document.querySelector("#character-two-strength").value,
        document.querySelector("#character-two-agility").value,
        document.querySelector("#character-two-endurance").value
    );
    
    toggleVisibility("#menu-section", false);
    toggleVisibility("#game-section", true);
    
    switchActivePlayer();

    battleTimer(timer_time);

    updateUIPlayersStats(active_player, "#active-player");
    updateUIPlayersStats(inactive_player, "#inactive-player");

    updateUIForNextMove(active_player);
    updateRoundDisplay();  
}


//*outputs data (visual change function)
function toggleVisibility(selector, isVisible, type = "block") { //  show or hide section 
    document.querySelector(selector).style.display = isVisible ? type : "none";
}
function updateRoundDisplay() { // update round number text 
    document.querySelector("#round-text").textContent = `${round_counter} round`;
}
function showReadyUI(player) { // show plug between players
    toggleVisibility("#players-characters", false);
    toggleVisibility("#choice-block", false);
    toggleVisibility("#choice-plug", true, 'flex');

    document.querySelector("#choice-plug h2").innerHTML = `<b>${player.nickname}</b>, are you ready?`;
}
function updateUIForNextMove(player) {
    toggleVisibility("#players-characters", true, "grid");
    toggleVisibility("#choice-block", true);
    toggleVisibility("#choice-plug", false);
    toggleVisibility("#round-results", false);

    updateUIPlayersStats(active_player, "#active-player");
    updateUIPlayersStats(inactive_player, "#inactive-player");

    document.querySelector("#current-player-name").innerHTML = `<b>${player.nickname ? player.nickname : ""}</b> it's your turn`;  
}
function updateUIPlayersStats(player, html_id) {
    document.querySelector(html_id + "-image").src = player.character_img_path;
    document.querySelector(html_id + "-name").innerHTML = player.nickname;

    document.querySelector(html_id + "-health p").innerHTML = player.health;
    document.querySelector(html_id + "-health span").style.width = ((player.health * 100) / player.full_health ) + "%";

    document.querySelector(html_id + "-strength span").innerHTML = player.strength;
    document.querySelector(html_id + "-agility span").innerHTML = player.agility;
    document.querySelector(html_id + "-endurance span").innerHTML = player.endurance;
}
function roundResultUI() {
    let p1_result_atk,
        p1_result_deff,
        p2_result_atk,
        p2_result_deff;

    toggleVisibility("#round-results", true, "grid");
    
    document.querySelector("#round-results-number").innerHTML = `Result of ${round_counter} round`;
    document.querySelector("#round-results-p1-action").innerHTML = `<span class="text-2xl">${player_one.nickname}</span><br> <b>Attacks:</b> ${player_one.atk_choice}<br> <b>Defends:</b> ${player_one.deff_choice}`;
    document.querySelector("#round-results-p2-action").innerHTML = `<span class="text-2xl">${player_two.nickname}</span><br> <b>Attacks:</b> ${player_two.atk_choice}<br> <b>Defends:</b> ${player_two.deff_choice}`;

    document.querySelector("#round-results-p1-name").innerHTML = player_one.nickname;
    document.querySelector("#round-results-p1-image").src = player_one.character_img_path;

    document.querySelector("#round-results-p1-health p").innerHTML = player_one.health;
    document.querySelector("#round-results-p1-health span").style.width = ((player_one.health * 100) / player_one.full_health ) + "%";
    

    toggleVisibility("#round-results-p1-shield", true, "flex");
    toggleVisibility("#round-results-p1-atk", true, "flex");

    toggleVisibility("#round-results-p2-shield", true, "flex");
    toggleVisibility("#round-results-p2-atk", true, "flex");


    switch (player_one.deff_choice) {
        case "head/chest":
            p1_result_deff = 0
            break;
        case "chest/belly":
            p1_result_deff = 20;
            break;
        case "belly/groin":
            p1_result_deff = 40;
            break;
        case "groin/legs":
            p1_result_deff = 60;
            break;
        default:
            p1_result_deff = 0;
            document.querySelector("#round-results-p1-shield").style.display = "none";
            break;
    }

    document.querySelector("#round-results-p1-shield").style.top = p1_result_deff + "%";

    switch (player_one.atk_choice) {
        case "head":
            p1_result_atk = 0
            break;
        case "chest":
            p1_result_atk = 20;
            break;
        case "belly":
            p1_result_atk = 40;
            break;
        case "groin":
            p1_result_atk = 60;
            break;
        case "legs":
            p1_result_atk = 80;
            break;
        default:
            p1_result_atk = 0;
            document.querySelector("#round-results-p1-atk").style.display = "none";
            break;
    }

    document.querySelector("#round-results-p1-atk").style.top = p1_result_atk + "%";
    


    document.querySelector("#round-results-p2-name").innerHTML = player_two.nickname;
    document.querySelector("#round-results-p2-image").src = player_two.character_img_path;

    document.querySelector("#round-results-p2-health p").innerHTML = player_two.health;
    document.querySelector("#round-results-p2-health span").style.width = ((player_two.health * 100) / player_two.full_health ) + "%";

    switch (player_two.deff_choice) {
        case "head/chest":
            p2_result_deff = 0
            break;
        case "chest/belly":
            p2_result_deff = 20;
            break;
        case "belly/groin":
            p2_result_deff = 40;
            break;
        case "groin/legs":
            p2_result_deff = 60;
            break;
        default:
            p2_result_deff = 0;
            document.querySelector("#round-results-p2-shield").style.display = "none";
            break;
    }

    document.querySelector("#round-results-p2-shield").style.top = p2_result_deff + "%";

    switch (player_two.atk_choice) {
        case "head":
            p2_result_atk = 0
            break;
        case "chest":
            p2_result_atk = 20;
            break;
        case "belly":
            p2_result_atk = 40;
            break;
        case "groin":
            p2_result_atk = 60;
            break;
        case "legs":
            p2_result_atk = 80;
            break;
        default:
            p2_result_atk = 0;
            document.querySelector("#round-results-p2-atk").style.display = "none";
            break;
    }

    document.querySelector("#round-results-p2-atk").style.top =  p2_result_atk + "%";  
}


//*functional functions
function battleTimer(duration) {

    clearTimeout(timer);
    clearInterval(timer);

    let time = duration, minutes, seconds;
    
    timer = setInterval(function () {
        minutes = parseInt(time / 60, 10);
        seconds = parseInt(time % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.querySelector("#timer-block").textContent = minutes + ":" + seconds;

        if (--time < 0) {
            clearTimeout(timer);
            clearInterval(timer);

            document.querySelector("#timer-block").textContent = "--:--";

            gameMoveBtn.click();
            
            return true;
        }
    }, 1000);
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
function playerMoveChoice(player, opponent) {
    const defenseChoice = getSelectedChoice("player-defense-action");
    const attackChoice = getSelectedChoice("player-attack-action");

    player.move_choice(defenseChoice, attackChoice);

    updateUIForNextMove(opponent.nickname);
}
function isPlayerDefeated(player1, player2) { // check if one players is defeated
    return player1.health <= 0 || player2.health <= 0;
}

function handlePlayerReady() {
    battleTimer(timer_time);

    switchActivePlayer();
    updateUIForNextMove(active_player);
}

function switchActivePlayer() {
    const isPlayerOneTurn = player_move_step % 2 === 0;

    active_player = isPlayerOneTurn ? player_one : player_two;
    inactive_player = isPlayerOneTurn ? player_two : player_one;

    player_move_step++;
}

function handleGameMove() {
    clearTimeout(timer);
    clearInterval(timer);
    document.querySelector("#timer-block").textContent = "--:--";

    playerMoveChoice(active_player, inactive_player);

    if (step_counter % 2 !== 0) {
        proceedToNextRound();
    }

    step_counter++;

    showReadyUI(inactive_player);
}
function proceedToNextRound() {
    roundResult(round_counter, player_one, player_two);
    
    round_counter++;
    
    updateRoundDisplay();

    if (isPlayerDefeated(player_one, player_two)) {
        
        toggleVisibility("#players-characters", true, "grid");
        toggleVisibility("#choice-block", true);
        toggleVisibility("#choice-plug", false);
        toggleVisibility("#round-results", false);
        toggleVisibility("#game_move_btn", false);
        toggleVisibility("#win-block", true);

        if (player_one.health <= 0) {
            document.querySelector("#win-block p").innerHTML = `<b>${player_one.nickname} win this battle</b>`;
        } else {
            document.querySelector("#win-block p").innerHTML = `<b>${player_two.nickname} win this battle</b>`;
        }

    }
}


function playerActionResult(player, opponent) {
    let actionLog = document.createElement("p");
    actionLog.className = 'text-lg';
    
    if (player.deff_choice.includes(opponent.atk_choice)) {
        actionLog.innerHTML = `<b>${opponent.nickname}</b>'s attack on <b><i>${opponent.atk_choice}</i></b> is blocked (<b>${player.nickname}</b> defended <b><i>${player.deff_choice}</i></b>)`;
    } else {
        opponent.deal_damage(player);
    }

    document.querySelector("#game-log").appendChild(actionLog);
    document.querySelector("#game-log").scrollTop = document.querySelector("#game-log").scrollHeight;
}
function roundResult(roundNumber, player1, player2) {
    const roundLog = document.createElement("p");
    roundLog.className = 'mt-5 mb-1 pb-2 text-2xl text-orange-600 font-bold border-b-2';
    roundLog.innerHTML = `<b>${roundNumber}</b> round`;
    
    document.querySelector("#game-log").appendChild(roundLog);
    document.querySelector("#game-log").scrollTop = document.querySelector("#game-log").scrollHeight;

    playerActionResult(player1, player2);
    playerActionResult(player2, player1);

    roundResultUI()
}