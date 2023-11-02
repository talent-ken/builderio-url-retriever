const axios = require('axios');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const model = 'facet-page'
const apiKey = '16a0905ab0f6474197d24babc69e9bfc'
const baseUrl = `https://cdn.builder.io/api/v2/content/${model}`;
const limit = 100;

const csvWriter = createCsvWriter({
  path: 'facet-page-urls.csv',
  header: [
    { id: 'name', title: 'NAME' },
    { id: 'url', title: 'URL' }
  ]
});

async function fetchAllPages() {
  let retrievedUrls = [];
  let offset = 0;
  let hasAnotherChunk = true;

  try {
    console.log("Starting to get URLs!");

    while (hasAnotherChunk) {
      const url = `${baseUrl}?apiKey=${apiKey}&limit=${limit}&offset=${offset}`;
      const response = await axios.get(url);

      const { results } = response.data

      if (results.length === 0) {
        hasAnotherChunk = false
      }

      console.log('Getting chunks of', offset / limit + 1, 'rounds');

      results.map((result) => {
        retrievedUrls.push({
          name: result.data.title,
          url: result.data.url
        })
      })

      offset += limit;

      if (results.length < limit) {
        hasAnotherChunk = false
      }
    }

    await csvWriter.writeRecords(retrievedUrls);
    console.log(`CSV has been saved with ${retrievedUrls.length} pages!`);

  } catch (error) {
    console.error('Error fetching Builder.io content:', error);
    throw error;
  }
}

(async () => {
  await fetchAllPages();
})();