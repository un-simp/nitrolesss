var loadPage = {
    url_prefix: "https://github.com/TheAlphaStream/nitroless-assets/blob/main/assets/",
    url_suffix: "?raw=true",
    emotes: [],
    content: "",
    searchBar: "",
    loadEmotes: async function(){
        try {
            const res = await fetch('https://raw.githubusercontent.com/TheAlphaStream/nitroless-assets/main/emotes.json');
            this.emotes = await res.json();
            this.emotes.sort(this.dynamicSorting("name"));
            this.displayEmotes(this.emotes);
        } catch(err) {
            console.error(err);
        }
    },
    paginator: function(items, page, per_page) {
        var page = page || 1,
            per_page = per_page || 10,
            offset = (page - 1) * per_page,
            paginatedItems = items.slice(offset).slice(0, per_page),
            total_pages = Math.ceil(items.length / per_page);

        return {
            page: page,
            per_page: per_page,
            pre_page: page - 1 ? page - 1 : null,
            next_page: (total_pages > page) ? page + 1 : null,
            total: items.length,
            total_pages: total_pages,
            data: paginatedItems
        }
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
    init: function(params) {
        this.content = params.content;
        this.searchBar = params.searchBar;
        this.loadEmotes();
        this.content.addEventListener("click", (event) => {
            if(!navigator.clipboard) {
                alert("Browser not supported");
            } else {
                loadPage.copyClipboard(event);
            }
        })
        this.searchBar.addEventListener("keyup", (e) => {
            loadPage.search(e);
        })
        this.searchBar.addEventListener("focusout", (e) => {
            loadPage.search(e);
        });
    }
}
