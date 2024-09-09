let start_game_btn = document.querySelector("#start_game_btn"),
    game_section = document.querySelector("#game-section");

let game_move_btn = document.querySelector("#game_move_btn");
let choice_ready_btn = document.querySelector("#choice_ready_btn");

let step_counter = 0,
    active_player,
    inactive_player,
    step = 0,
    player_move_step = 0,
    round_counter = 1,
    player_one,
    player_two;


start_game_btn.onclick = () => {
    player_one = new Character(document.querySelector("#user-one-name").value, 20, 15, 18);
    player_two = new Character(document.querySelector("#user-two-name").value, 20, 15, 18);

    menu_section.style.display = "none";
    game_section.style.display = "block";

    player_one.stats_update("one");
    player_two.stats_update("two");

    document.querySelector("#step_block").innerHTML = round_counter + " round";

    change_active_player(player_move_step);
    form_chages(active_player);
}

game_move_btn.onclick = () => {
    if (step % 2) {
        player_move_choice(active_player, inactive_player);
        round();
    } else {
        player_move_choice(active_player, inactive_player);
    }
}

choice_ready_btn.onclick = () => {
    change_active_player(player_move_step); 
    form_chages(active_player);
}


function player_move_choice(player, inactive_player) {
    player_deff_choice = document.getElementsByName("player-defense-action");
    player_atk_choice = document.getElementsByName("player-attack-action");
    pocket_deff = "";
    pocket_atk = "";

    player_deff_choice.forEach(input => {
        if (input.checked) {
            pocket_deff= input.value;
            input.checked = false;
        }
    });

    player_atk_choice.forEach(input => {
        if (input.checked) {
            pocket_atk = input.value;
            input.checked = false;
        }
    });
    
    player.move_choice(pocket_deff, pocket_atk);

    delete player_deff_choice;
    delete player_atk_choice;
    delete pocket_deff;
    delete pocket_atk;

    step++;

    document.querySelector("#player-one").classList.remove("outline", "outline-4", "outline-orange-600");
    document.querySelector("#player-two").classList.remove("outline", "outline-4", "outline-orange-600");

    document.querySelector("#choice-block").style.display = "none";
    document.querySelector("#choice-plug").style.display = "block";
    document.querySelector("#choice-plug h2").innerHTML = "<b>" + inactive_player.nickname + "</b>, are you ready?";
}

function form_chages(player) {
    document.querySelector("#choice-block").style.display = "block";
    document.querySelector("#choice-plug").style.display = "none"; 
    document.querySelector("#choice-block h2").innerHTML = "<b>" + player.nickname + "</b> it's your turn";  
}

function change_active_player() {
    if (player_move_step % 2) {
        active_player = player_two;
        inactive_player = player_one;

        document.querySelector("#player-two").classList.add("outline", "outline-4", "outline-orange-600");
        document.querySelector("#player-one").classList.remove("outline", "outline-4", "outline-orange-600");
    } else {
        active_player = player_one;
        inactive_player = player_two;
        
        document.querySelector("#player-one").classList.add("outline", "outline-4", "outline-orange-600");
        document.querySelector("#player-two").classList.remove("outline", "outline-4", "outline-orange-600");
    }

    player_move_step += 1;
}

function round() {    
    document.querySelector("#step_block").innerHTML = round_counter + " round";

    round_log = document.createElement("p");

    round_log.className = 'mt-5 mb-1 pb-2 text-2xl text-orange-600 font-bold border-b-2';                
    round_log.innerHTML = "<b>"+ round_counter + "</b> round";
                
    document.querySelector("#game-log").appendChild(round_log);

    round_counter++;

    if (player_one.deff_choice.includes(player_two.atk_choice)) {
        deff_log = document.createElement("p");

        deff_log.className = 'text-lg';                
        deff_log.innerHTML = "<b>"+ player_one.nickname + "</b> successfully blocked <b>"+ player_two.nickname +"'s</b> attack";
                
        document.querySelector("#game-log").appendChild(deff_log);
    } else {
        player_two.deal_damage(player_one);
    }

    
    if (player_two.deff_choice.includes(player_one.atk_choice)) {
        deff_log = document.createElement("p");

        deff_log.className = 'text-lg';                
        deff_log.innerHTML = "<b>"+ player_two.nickname + "</b> successfully blocked <b>"+ player_one.nickname +"'s</b> attack" ;

        document.querySelector("#game-log").appendChild(deff_log);
    } else {
        player_one.deal_damage(player_two);
   }

   player_one.stats_update("one");
   player_two.stats_update("two");

    // player_one.clear_move_choice();
    // player_two.clear_move_choice();

    // console.log(player_one);
    // console.log(player_two);
   
   if (player_one.health <= 0 || player_two.health <= 0) {
        if (player_one.health <= 0) {
            alert(player_two.nickname + " win this battle");
        } else {
            alert(player_one.nickname + " win this battle");
        }    

    location.reload();
   }
}