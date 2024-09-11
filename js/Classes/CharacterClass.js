class Character {
    nickname;
    health;
    full_health;
    strength;
    agility;
    endurance;
    atk_choice;
    deff_choice;


    constructor(player_name, strength, agility, endurance) {
        this.nickname = player_name;
        this.health = endurance * 10;
        this.full_health = this.health;
        this.strength = strength;
        this.agility = agility;
        this.endurance = endurance;
    }

    stats_update(number) {
        document.querySelector("#player-"+ number +"-name").innerHTML = this.nickname;

        document.querySelector("#player-"+ number +"-health p").innerHTML = this.health;
        document.querySelector("#player-"+ number +"-health span").style.width = ((this.health * 100) / this.full_health ) + "%";

        document.querySelector("#player-"+ number +"-stats").innerHTML = "<p class='text-xl'>Strength: <i>" + this.strength + "</i></p>" 
        + "<p class='text-xl'>Agility: <i>" + this.agility + "</i></p>"
        + "<p class='text-xl'>Endurance: <i>" + this.endurance + "</i></p>";
    }

    move_choice(deff, atk) {
        this.deff_choice = deff;
        this.atk_choice = atk;
    }

    clear_move_choice() {
        this.atk_choice = "";
        this.deff_choice = "";
    }

    gain_damage(damage_suffered) {
        let chance = Math.random().toFixed(4) * 100,
        gain_dmg_log = document.createElement("p");

        gain_dmg_log.className = 'text-lg';                
        
        if (chance < (this.agility * 0.5).toFixed(4)) {
            gain_dmg_log.innerHTML = "<b>"+ this.nickname + "</b> dodged an attack";
            
            return;
        } else {
            this.health = this.health - damage_suffered;
        }

        if (this.health < 0) this.health = 0;


        document.querySelector("#game-log").appendChild(gain_dmg_log);
        document.querySelector("#player-one-health p").innerHTML =  this.health;
        document.querySelector("#player-one-health span").style.width =  ((this.health * 100) / this.full_health ) + "%";
    }

    deal_damage(target) {
        let chance = Math.random().toFixed(4) * 100,
            dmg = this.strength * 2,
            atk_log = document.createElement("p");

        atk_log.className = 'text-lg';  
            
        if (chance < (this.agility * 0.3).toFixed(4)) {
            crit_dmg = dmg * 1.5;
            target.gain_damage(crit_dmg);

            atk_log.innerHTML = "<b>"+ this.nickname + "</b> dealt 20 damage (Сritical damage) to " + this.atk_choice;
            // atk_log.innerHTML = "<b>"+ this.nickname + "</b> dealt 20 damage to <b>"+ player_one.nickname +"</b>  (Сritical damage)" ;
        } else {
            target.gain_damage(dmg);

            atk_log.innerHTML = "<b>"+ this.nickname + "</b> dealt 20 damage to " + this.atk_choice;
            // atk_log.innerHTML = "<b>"+ this.nickname + "</b> dealt 20 damage to <b>"+ player_one.nickname +"</b>";
        }

        document.querySelector("#game-log").appendChild(atk_log);
                      
    }
}