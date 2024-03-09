export async function getQuesterAllowlist(threshold = 20) {
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
