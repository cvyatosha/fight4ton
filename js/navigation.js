let menu_section = document.querySelector("#menu-section"),
    back_to_menu_btns = document.querySelectorAll(".back_to_menu_btn");


back_to_menu_btns.forEach((back_to_menu_btn) => {
    back_to_menu_btn.onclick = () => {
        location.reload();
    };
});