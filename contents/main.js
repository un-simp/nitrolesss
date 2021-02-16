var loadPage = {
    api_uri: 'https://api.quiprr.dev/',
    url_prefix: "https://nitroless.quiprr.dev/",
    url_suffix: "?raw=true",
    emotes: [],
    content: "",
    searchBar: "",
    paginatorContainer: "",
    loadEmotes: async function(){
        try {
            const res = await fetch(`${loadPage.api_uri}v1/nitroless/emotes`);
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
                return `<div id="${emotes.name}" class="emoteContainer" data-clipboard-text="${loadPage.url_prefix}${emotes.name}${emotes.type}${loadPage.url_suffix}">
                            <img src="${loadPage.url_prefix}${emotes.name}${emotes.type}${loadPage.url_suffix}" id="${emotes.name}Img" class="emoteImage" name="${emotes.name}" />
                            <div class="emoteCopied" style="display:none;">COPIED!</div>
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
    searchEvent: function(e) {
        if(e.target.value) {
            loadPage.search(e);
            loadPage.paginatorContainer.style.transform = "translateY(50px)";
        } else {
            loadPage.paginator(this.emotes, 1);
            loadPage.paginatorContainer.style.transform = "";
        }
    },
    copySuccess: function(e) {
        document.getElementById(e.trigger.id).getElementsByClassName('emoteImage')[0].style.display = 'none';
        document.getElementById(e.trigger.id).getElementsByClassName('emoteCopied')[0].style.display = '';
        setTimeout(() => {
            document.getElementById(e.trigger.id).getElementsByClassName('emoteImage')[0].style.display = '';
            document.getElementById(e.trigger.id).getElementsByClassName('emoteCopied')[0].style.display = 'none';
        }, 2500);
    },
    copyFailure: function(e) {
        alert('Couldn\'t copy ' + e.trigger.id);
    },
    init: function(params) {
        this.content = params.content;
        this.searchBar = params.searchBar;
        this.paginatorContainer = params.paginationContainer;
        this.loadEmotes();
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
