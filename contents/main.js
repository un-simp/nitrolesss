var loadPage = {
    doc: document,
    url_prefix: "https://github.com/TheAlphaStream/nitroless-assets/blob/main/assets/",
    url_suffix: "?raw=true",
    emotes: {
        gif: ["catjam", "slam"],
        png: ["fr", "frcoal", "kekw", "uhh", "woecry", "wtf_kanye"]
    },
    content: "",
    insertData: function(emoteName, ext) {
        let div = document.createElement("div");
        div.id = emoteName;
        div.className = "emoteContainer";

        let img = document.createElement("img");
        img.src = this.url_prefix + emoteName + ext + this.url_suffix;
        img.id = emoteName + "Img";

        div.appendChild(img);

        return div;
    },
    init: function(params) {
        this.content = params.content
        for(let i = 0; i < this.emotes.gif.length; i++) {
            let div = this.insertData(this.emotes.gif[i], ".gif")
            content.appendChild(div);
        }
        for(let i = 0; i < this.emotes.png.length; i++) {
            let div = this.insertData(this.emotes.png[i], ".png")
            content.appendChild(div);
        }
    }
}