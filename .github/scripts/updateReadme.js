const fs = require("fs");
const axios = require("axios");

const username = "Fanu2"; // change this
const readmePath = "README.md";

(async () => {
  const { data } = await axios.get(`https://api.github.com/users/${Fanu2}/repos?sort=updated&per_page=5`);
  
  const repoList = data
    .map(repo => `- [${repo.name}](${repo.html_url}) ⭐ ${repo.stargazers_count} — ${repo.description || "No description"}`)
    .join("\n");

  let readme = fs.readFileSync(readmePath, "utf-8");
  readme = readme.replace(
    /<!-- DYNAMIC_REPOS:START -->([\s\S]*?)<!-- DYNAMIC_REPOS:END -->/,
    `<!-- DYNAMIC_REPOS:START -->\n${repoList}\n<!-- DYNAMIC_REPOS:END -->`
  );

  fs.writeFileSync(readmePath, readme);
})();
