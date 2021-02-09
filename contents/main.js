var loadPage = {
    doc: document,
    url_prefix: "https://github.com/TheAlphaStream/nitroless-assets/blob/main/assets/",
    url_suffix: "?raw=true",
    emotes: [],
    content: "",
    loadEmotes: async function(){
        try {
            const res = await fetch('contents/emotes.json');
            this.emotes = await res.json;
            this.displayEmotes(this.emotes);
        } catch(err) {
            console.error(err);
        }
    },
    displayEmotes: function(emotes){
        const htmlString = emotes
            .map((emotes) => {
                return `<div id="${emotes.name}" class="emoteContainer">
                            <img src="${loadPage.url_prefix}${emotes.name}${emotes.type}${loadPage.url_suffix}" id="${emotes.name}Img" class="emoteImage" name="${emotes.name}" />
                            <div id="${emotes.name}Title" class="emoteTitle">${emotes.name}</div>
                        </div>`;
            }).join('');

        this.content.innerHTML = htmlString;
    },
    init: function(params) {
        this.content = params.content
        this.loadEmotes();
        let emoteImages = document.querySelectorAll(".emoteImage");
        emoteImages.forEach((element) => {
            element.addEventListener("click", async (event) => {
                if(!navigator.clipboard) {
                    alert("Browser not supported");
                } else {
                    navigator.clipboard.writeText(event.target.getAttribute("src"))
                    .then(
                        () => alert("Successfuly copied ->" + event.target.name),
                        () => alert("Couldn't copy " + event.target.name)
                    );
                }
            })
        })
    }
}
