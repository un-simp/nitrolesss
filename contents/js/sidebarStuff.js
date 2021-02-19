var sidebarStuff = {
    sidebarContainer: document.getElementById("sidebarContainer"),
    removeActiveClass: function() {
        let sidebarButtons = document.getElementsByClassName("sidebarButtons");
        for(let i = 0; i < sidebarButtons.length; i++) {
            sidebarButtons[i].classList.remove("active");
        }
    },
    init: function() {
        this.sidebarContainer.addEventListener("click", (e) => {
            if(e.target.classList.contains("sidebarButtons")) {
                let searchbar = document.getElementById("searchBox");
                if(searchbar.classList.contains("hide")) searchbar.classList.remove("hide");
                loadPage.content.innerHTML = "";
                sidebarStuff.removeActiveClass();
                switch(e.target.id) {
                    case "homeButton":
                        e.target.classList.add("active");
                        loadPage.loadEmotes()
                        break;
                    case "aboutButton":
                        e.target.classList.add("active");
                        searchbar.classList.add("hide");
                        loadPage.loadAbout()
                        break;
                }
            }
        });
    }
}