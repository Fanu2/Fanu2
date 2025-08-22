const fs = require("fs");
const axios = require("axios");

const username = "Fanu2"; // your GitHub username
const readmePath = "README.md";
const token = process.env.GH_TOKEN; // from GitHub Actions secrets

(async () => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/user/repos?sort=updated&per_page=5`,
      {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json"
        }
      }
    );

    const repoList = data
      .map(repo => `- [${repo.name}](${repo.html_url}) ⭐ ${repo.stargazers_count} — ${repo.description || "No description"}`)
      .join("\n");

    let readme = fs.readFileSync(readmePath, "utf-8");
    readme = readme.replace(
      /<!-- DYNAMIC_REPOS:START -->([\s\S]*?)<!-- DYNAMIC_REPOS:END -->/,
      `<!-- DYNAMIC_REPOS:START -->\n${repoList}\n<!-- DYNAMIC_REPOS:END -->`
    );

    fs.writeFileSync(readmePath, readme);
    console.log("README updated successfully!");
  } catch (err) {
    console.error("Error fetching repos:", err.message);
  }
})();
