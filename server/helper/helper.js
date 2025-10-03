const fetch = require("node-fetch");

async function checkLinkAlive(url) {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",  // follow redirects
      timeout: 10000000      // 10s timeout
    });
    // Consider 2xx or 3xx as alive
    return res.status >= 200 && res.status < 400;
  } catch (err) {
    return false; // network error, timeout, etc.
  }
}

module.exports = checkLinkAlive;
