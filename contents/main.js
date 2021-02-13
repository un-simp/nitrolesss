var loadPage = {
    url_prefix: "https://raw.githubusercontent.com/Nitroless/Assets/main/assets/",
    url_suffix: "?raw=true",
    emotes: [],
    content: "",
    searchBar: "",
    paginatorContainer: "",
    loadEmotes: async function(){
        try {
            const res = await fetch('https://raw.githubusercontent.com/Nitroless/Assets/main/emotes.json');
            this.emotes = await res.json();
            this.emotes.sort(this.dynamicSorting("name"));
            this.paginator(this.emotes, 1);
        } catch(err) {
            console.error(err);
        }
    },
    paginator: function(items, page, per_page) {
        var page = page || 1,
            per_page = per_page || 40,
            offset = (page - 1) * per_page,
            paginatedItems = items.slice(offset).slice(0, per_page),
            total_pages = Math.ceil(items.length / per_page);
        this.paginatorContainer.innerHTML = "";
        for(let i = 0; i < total_pages; i++) {
            this.paginatorContainer.innerHTML += `<div id='page${i+1}' class='paginationPages'>${i+1}</div>`;
        }
        document.getElementById("page" + page).classList.add("active");
        this.displayEmotes(paginatedItems);
    },
    displayEmotes: function(emotes){
        const htmlString = emotes.map((emotes) => {
                return `<div id="${emotes.name}" class="emoteContainer">
                            <img src="${loadPage.url_prefix}${emotes.name}${emotes.type}${loadPage.url_suffix}" id="${emotes.name}Img" class="emoteImage" name="${emotes.name}" />
                            <div id="${emotes.name}Title" class="emoteTitle">${emotes.name}</div>
                        </div>`;
            }).join('');
        this.content.innerHTML = htmlString;
    },
    dynamicSorting: function(property) {
        let sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        return function(a,b) {
            if(sortOrder == -1) {
                return b[property].localeCompare(a[property]);
            } else {
                return a[property].localeCompare(b[property]);
            }
        }
    },
    search: function(e) {
        const searchString = e.target.value.toLowerCase();
        const filteredEmotes = this.emotes.filter((emote) => {
            return (emote.name.toLowerCase().includes(searchString));
        });
        loadPage.displayEmotes(filteredEmotes);
    },
    copyClipboard: function(event) {
        navigator.clipboard.writeText(event.target.getAttribute("src")).then(function() {
            if(event.target.getAttribute("src")) {
                alert("Successfuly copied ->" + event.target.name)
            }
        }, function() {
            alert("Couldn't copy " + event.target.name)
        });
    },
    searchEvent: function(e) {
        if(e.target.value) {
            loadPage.search(e);
            loadPage.paginatorContainer.style.transform = "translateY(50px)";
        } else {
            loadPage.paginator(this.emotes, 1);
            loadPage.paginatorContainer.style.transform = "";
        }
    },
    init: function(params) {
        this.content = params.content;
        this.searchBar = params.searchBar;
        this.paginatorContainer = params.paginationContainer;
        this.loadEmotes();
        this.content.addEventListener("click", (event) => {
            if(!navigator.clipboard) {
                alert("Browser not supported");
            } else {
                loadPage.copyClipboard(event);
            }
        })
        this.searchBar.addEventListener("keyup", (e) => this.searchEvent(e));
        this.searchBar.addEventListener("focusout", (e) => this.searchEvent(e));
        this.paginatorContainer.addEventListener("click", (e) => {
            for(let i = 0; i < loadPage.paginatorContainer.childElementCount; i++) {
                if(e.target.id == "page" + (i+1)) {
                    e.target.classList.add("active");
                    loadPage.paginator(loadPage.emotes, (i+1))
                }
            }
        })
    }
}
