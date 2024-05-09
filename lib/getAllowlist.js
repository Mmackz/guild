import Papa from "papaparse";

const cache = {};

export async function getAllowlistFromDune(query, limit) {
  const cacheKey = `query-${query}`;
  const currentTime = new Date().getTime();
  const cacheExpiration = 300000;

  if (!cache[cacheKey] || currentTime - cache[cacheKey].timestamp >= cacheExpiration) {
    try {
      const response = await fetch(
        `https://api.dune.com/api/v1/query/${query}/results/csv?api_key=${process.env.DUNE_KEY}`
      );
      const csvData = await response.text();
      cache[cacheKey] = {
        timestamp: currentTime,
        data: Papa.parse(csvData.trimEnd(), { header: true }).data
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return cache[cacheKey].data
    .filter(item => !limit || item.total_quests_claimed > limit)
    .map(item => item.recipient);
}

export async function getBoostAllowlist(threshold = 20) {
  try {
     const response = await fetch(
        "https://allowlist-creator.up.railway.app/allowlist?threshold=" + threshold
     );
     const allowlist = await response.json();
     return allowlist;
  } catch (error) {
     console.log(error);
     return null;
  }
}
