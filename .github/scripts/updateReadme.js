const fs = require("fs");
const axios = require("axios");

const username = "SinghJasvir";
const readmePath = "README.md";
const token = process.env.GH_TOKEN;

(async () => {
  try {
    if (!token) {
      console.error("Error: GH_TOKEN not found in environment variables.");
      process.exit(1);
    }

    // 1️⃣ Verify personal account
    const { data: user } = await axios.get(
      `https://api.github.com/users/${username}`,
      { headers: { Authorization: `token ${token}` } }
    );

    if (user.type !== "User") {
      console.error("Error: Provided username is an organization. Only personal accounts are supported.");
      process.exit(1);
    }

    console.log(`✅ Verified: ${username} is a personal account.`);

    // 2️⃣ Fetch latest 5 repos
    const { data: repos } = await axios.get(
      `https://api.github.com/user/repos?sort=updated&per_page=5`,
      { headers: { Authorization: `token ${token}`, Accept: "application/vnd.github.v3+json" } }
    );

    // 3️⃣ Generate theme-aware Open Graph cards
    const repoCards = repos
      .map(repo => `<a href="${repo.html_url}">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://opengraph.githubassets.com/1/${username}/${repo.name}?theme=dark" />
    <source media="(prefers-color-scheme: light)" srcset="https://opengraph.githubassets.com/1/${username}/${repo.name}?theme=light" />
    <img src="https://opengraph.githubassets.com/1/${username}/${repo.name}" alt="${repo.name}" height="140"/>
  </picture>
</a>`)
      .join("\n");

    // 4️⃣ Update README
    let readme = fs.readFileSync(readmePath, "utf-8");
    readme = readme.replace(
      /<!-- DYNAMIC_REPOS:START -->([\s\S]*?)<!-- DYNAMIC_REPOS:END -->/,
      `<!-- DYNAMIC_REPOS:START -->\n<p align="center">\n${repoCards}\n</p>\n<!-- DYNAMIC_REPOS:END -->`
    );

    fs.writeFileSync(readmePath, readme);
    console.log("✅ README updated with theme-aware repo cards!");
  } catch (err) {
    console.error("Error:", err.message);
  }
})();
