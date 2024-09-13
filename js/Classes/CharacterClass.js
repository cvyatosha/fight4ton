class Character {
    character_img_path;
    nickname;
    health;
    full_health;
    strength;
    agility;
    endurance;
    atk_choice;
    deff_choice;


    constructor(character_img_path, player_name, strength, agility, endurance) {
        this.character_img_path = character_img_path;
        this.nickname = player_name;
        this.health = endurance * 10;
        this.full_health = this.health;
        this.strength = strength;
        this.agility = agility;
        this.endurance = endurance;
    }

    move_choice(deff, atk) {
        this.deff_choice = deff;
        this.atk_choice = atk;
    }

    clear_move_choice() {
        this.atk_choice = "";
        this.deff_choice = "";
    }

    gain_damage(damage_suffered, atked_zone) {
        let chance = Math.random().toFixed(4) * 100,
            gain_dmg_log = document.createElement("p");

        gain_dmg_log.className = 'text-lg';                
        
        if (chance < (this.agility * 0.5).toFixed(4)) {
            gain_dmg_log.innerHTML = `<b>${this.nickname}</b> dodged an <b><i>${damage_suffered}<i></b> dmg`;
            
            return;
        } else {
            this.health = this.health - damage_suffered;

            gain_dmg_log.innerHTML = `<b>${this.nickname}</b> defended his <b><i>${this.deff_choice}</i></b> instead of his <b><i>${atked_zone}</i></b> and received <b><i>${damage_suffered}<i></b> dmg`;
        }

        if (this.health < 0) this.health = 0;

        document.querySelector("#game-log").appendChild(gain_dmg_log);
        document.querySelector("#game-log").scrollTop = document.querySelector("#game-log").scrollHeight;
    }

    deal_damage(target) {
        let chance = Math.random().toFixed(4) * 100,
            standard_dmg = this.strength * 2,
            dmg,
            isCrit,
            atk_log = document.createElement("p");

        atk_log.className = 'text-lg';  
            
        if (chance < (this.agility * 0.3).toFixed(4)) {
            dmg = standard_dmg * 1.5;
            isCrit = true;
        } else {
            dmg = standard_dmg;
        }

        target.gain_damage(dmg, this.atk_choice);
        atk_log.innerHTML = `<b>${this.nickname}</b>'s attack on <b><i>${this.atk_choice}</i></b> is successful, and damaged is <b><i>${dmg}/${standard_dmg}</i></b> <span class="text-red-700 text-bold">${isCrit ? "CRIT!" : ""}</span>`;
        
        document.querySelector("#game-log").appendChild(atk_log);
        document.querySelector("#game-log").scrollTop = document.querySelector("#game-log").scrollHeight;
    }
}