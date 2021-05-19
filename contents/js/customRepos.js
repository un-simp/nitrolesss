var customRepos = {
    contentDiv: null,
    repoEmotes: [],
    loadEmotes: async function(api_uri) {
        try {
            const resp = await fetch(`${api_uri}index.json`);
            this.r = await resp.json();
            let sortedEmotes = this.r.emotes.sort(this.dynamicSorting("name"));
            let repoId = this.r.name.split(" ").join("");
            repoId = repoId.split("'").join("");
            this.repoEmotes.push({
                "id": repoId,
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
            </div>
            `
        }).join('');
        const htmlContainer = domMaker.init({
            type: "div",
            id: repo.id,
            className: "repoContainer",
            innerHTML: `
            <div id="topPart">
                <div class="repoIcon">
                    <img src="${repo.api_uri}RepoImage.png" class="repoImage" />
                </div>
                <div class="repoHeader">
                    <div class="headerLeftPart">
                        <div class="headerTopPart">
                            <div id="${repo.id}Name" class="repoName">
                                ${repo.name}
                                <div id="${repo.id}Chevron" class="mi mi-ChevronDown closed"></div>
                            </div>
                        </div>
                        <div class="headerBottomPart">
                            <div id="${repo.id}APIURI" class="repoURL">${repo.api_uri}</div>
                        </div>
                    </div>
                    <div id="${repo.id}" class="headerRightPart">
                        <div class="mi mi-Delete"></div>
                        <div class="deleteText">Delete</div>
                    </div>
                </div>
            </div>
            <div id="${repo.id}Emotes" class="repoEmotes hide">
                ${htmlString}
            </div>
            `
        });
        htmlContainer.addEventListener("click", (e) => {
            if(e.target.className !== "headerRightPart" && e.target.className !== "emoteContainer" && e.target.className !== "emoteImage" && e.target.className !== "repoEmotes") {
                document.getElementById(repo.id + "Chevron").classList.toggle("closed");
                document.getElementById(repo.id + "Emotes").classList.toggle("hide");
            }
        });
        return htmlContainer;
    },
    copySuccess: function(e) {
        let el = document.getElementById(e.trigger.id);
        el.getElementsByClassName('emoteImage')[0].style.display = 'none';
        el.getElementsByClassName('emoteCopied')[0].style.display = '';
        setTimeout(() => {
            el.getElementsByClassName('emoteImage')[0].style.display = '';
            el.getElementsByClassName('emoteCopied')[0].style.display = 'none';
        }, 2500);
    },
    copyFailure: function(e) {
        alert('Couldn\'t copy ' + e.trigger.id);
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
        loadPage.content.innerHTML = "";
        this.repoEmotes = [];
        for(let i = 0; i < localstore.addedRepos.length; i++) {
            await customRepos.loadEmotes(localstore.addedRepos[i]);
        }
        for(let i = 0; i < customRepos.repoEmotes.length; i++) {
            loadPage.content.appendChild(customRepos.displayEmotes(customRepos.repoEmotes[i]));
        }
        let deleteButtons = document.getElementsByClassName("headerRightPart");
        for(let i = 0; i < deleteButtons.length; i++) {
            let deleteButton = deleteButtons[i];
            deleteButton.addEventListener("click", (e) => {
                let repoID = e.target.id;
                let obj = customRepos.repoEmotes.filter((obj) => {
                    return obj.id === repoID;
                });
                let r = confirm("Delete Repo: " + obj[0].name + "?");
                if (r == true) {
                    let uri = obj[0].api_uri;
                    localstore.removeApp("addedRepos", uri);
                    alert("Repo Deleted!");
                    customRepos.init();
                }
            });
        }
        let clipboard = new ClipboardJS('.repoEmotes');
        clipboard.on('success', this.copySuccess);
        clipboard.on('error', this.copyFailure);
    }
}