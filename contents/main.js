var loadPage = {
    doc: document,
    url_prefix: "https://github.com/TheAlphaStream/nitroless-assets/blob/main/assets/",
    url_suffix: "?raw=true",
    emotes: [],
    content: "",
    searchBar: "",
    loadEmotes: async function(){
        try {
            const res = await fetch('https://raw.githubusercontent.com/TheAlphaStream/nitroless/main/contents/emotes.json?token=AGBEPAGXUJTZUF6IKOQJ4NDAFOREO');
            this.emotes = await res.json();
            this.displayEmotes(this.emotes);
        } catch(err) {
            console.error(err);
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
    init: function(params) {
        this.content = params.content;
        this.searchBar = params.searchBar;
        this.loadEmotes();
        this.content.addEventListener("click", async (event) => {
            if(!navigator.clipboard) {
                alert("Browser not supported");
            } else {
                navigator.clipboard.writeText(event.target.getAttribute("src")).then(function() {
                    if(event.target.getAttribute("src")) {
                        alert("Successfuly copied ->" + event.target.name)
                    }
                }, function() {
                    alert("Couldn't copy " + event.target.name)
                });
            }
        })
        this.searchBar.addEventListener("keyup input", (e) => {
            const searchString = e.target.value.toLowerCase();
            const filteredEmotes = loadPage.emotes.filter((emote) => {
                return (emote.name.toLowerCase().includes(searchString));
            });
            loadPage.displayEmotes(filteredEmotes);
        })
    }
    
}
