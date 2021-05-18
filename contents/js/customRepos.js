var customRepos = {
    contentDiv: null,
    repoEmotes: [],
    loadEmotes: async function(api_uri) {
        try {
            const resp = await fetch(`${api_uri}index.json`);
            this.r = await resp.json();
            let sortedEmotes = this.r.emotes.sort(this.dynamicSorting("name"));
            this.repoEmotes.push({
                "api_uri": api_uri,
                "name": this.r.name,
                "path": this.r.path,
                "emotes": sortedEmotes,
            });
        } catch(err) {
            console.error(err);
        }
    },
    displayEmotes: function(repo) {
        let htmlString = repo.emotes.map((emote) => {
            return `
            <div id="${emote.name}${emote.type}" class="emoteContainer" data-clipboard-text="${repo.api_uri}${repo.path}/${emote.name}${emote.type}">
                <img src="${repo.api_uri}${repo.path}/${emote.name}${emote.type}" id="${emote.name}${emote.type}Img" class="emoteImage" name="${emote.name}" />
                <div class="emoteCopied" style="display:none;">COPIED!</div>
                <div id="${emote.name}Title" class="emoteTitle">${emote.name}</div>
            </div>
            `
        }).join('');
        const htmlContainer = domMaker.init({
            type: "div",
            id: repo.name,
            className: "repoContainer",
            innerHTML: `
            <div id="${repo.name}" class="repoName">
                ${repo.name}
            </div>
            <div id="${repo.api_uri}" class="repoURL">
                ${repo.api_uri}
            </div>
            <div id="${repo.name}Emotes" class="repoEmotes hide">
                ${htmlString}
            </div>
            `
        });
        return htmlContainer;
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
    init: async function() {

        for(let i = 0; i < localstore.addedRepos.length; i++) {
            await customRepos.loadEmotes(localstore.addedRepos[i]);
        }
        for(let i = 0; i < customRepos.repoEmotes.length; i++) {
            loadPage.content.appendChild(customRepos.displayEmotes(customRepos.repoEmotes[i]));
        }
    }
}