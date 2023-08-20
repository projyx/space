window.github = {
    endpoint: "https://api.github.com",
    repos: {
        contents: (owner, repo, path) => {
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/repos/" + owner + "/" + repo + "/contents/" + path;
                const a = data=>{
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                const settings = accessToken ? {
                    headers: {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    }
                } : null;
                get(url, settings).then(a).catch(b);
            }
            );            
        }
    },
    users: {
        repos: (username)=>{
            return new Promise((resolve,reject)=>{
                const url = github.endpoint + "/users/" + username + "/repos";
                const a = data=>{
                    resolve(data);
                }
                const b = (error)=>{
                    console.log(error);
                    reject(error);
                }
                const accessToken = localStorage.githubAccessToken;
                const settings = accessToken ? {
                    headers: {
                        Accept: "application/vnd.github+json",
                        Authorization: "token " + accessToken
                    }
                } : null;
                get(url, settings).then(a).catch(b);
            }
            );
        }
    }
}