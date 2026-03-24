import fetch from 'node-fetch';

const NEWSAPI_KEY = 'bf39c68958f44f0695efb061be0ecec1';
const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';

async function testFetchNews() {
  try {
    const params = new URLSearchParams({
      category: 'technology',
      pageSize: '5',
      apiKey: NEWSAPI_KEY,
      sortBy: 'publishedAt',
      language: 'pt',
    });

    console.log(`[Test] Fetching from: ${NEWSAPI_BASE_URL}/top-headlines?${params}`);
    
    const response = await fetch(`${NEWSAPI_BASE_URL}/top-headlines?${params}`);
    
    console.log(`[Test] Response status: ${response.status}`);
    
    const data = await response.json();
    
    console.log(`[Test] Response data:`, JSON.stringify(data, null, 2));
    
    if (data.status === 'ok') {
      console.log(`[Test] ✅ Success! Found ${data.articles.length} articles`);
    } else {
      console.log(`[Test] ❌ Error: ${data.status}`);
    }
  } catch (error) {
    console.error('[Test] Error:', error);
  }
}

testFetchNews();
