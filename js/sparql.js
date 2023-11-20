async function fetchDatabySPARQL(input) {
  const endpointUrl = 'https://lsd.dbcls.jp/sparql';
  const sparqlQuery = `
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX lsdo: <http://purl.jp/bio/10/lsd/ontology/201209#>

SELECT DISTINCT ?term_e ?term_j ?str ?str_ja
WHERE {
  VALUES (?label) { ${input} }
  ?term_e rdfs:label ?label ;
          lsdo:hasEntry ?b_node .
  ?b_node lsdo:hasJapaneseTranslationOf ?term_j .
  ?term_j rdfs:label ?label_ja .
  FILTER (lang(?label_ja) = "ja")
  BIND(str(?label_ja) AS ?str_ja)
  BIND(str(?label) AS ?str)
}
ORDER BY ?term_e ?term_j
`;

  try {
    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/sparql-results+json',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `query=${encodeURIComponent(sparqlQuery)}`
    });
    if (!response.ok) {
      // response.ok === true if the status code is 2xx
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Could not fetch data: ${error}`);
  }
}
