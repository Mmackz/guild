import Papa from "papaparse";

export async function getTicketAllowlist() {
   try {
      const response = await fetch(
         `https://api.dune.com/api/v1/query/3308995/results/csv?api_key=${process.env.DUNE_KEY}`
      );
      const csvData = await response.text();
      const data = Papa.parse(csvData.trimEnd(), { header: true });
      return data.data.map((data) => data.recipient)
   } catch (error) {
      console.error(error);
      return null;
   }
}