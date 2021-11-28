export const fetchAndParseArxiv = async (queryString) => {
  const resp = await fetch(`https://export.arxiv.org/api/query?${queryString}`)
  const xmlStr = await resp.text()
  const parser = new DOMParser();
  const parsedXML = parser.parseFromString(xmlStr, 'text/xml')
  const totalResults = parsedXML.getElementsByTagName('opensearch:totalResults')[0].textContent
  const entries = parsedXML.getElementsByTagName('entry')

  const jsonEntries = Array.from(entries).map(entry => {
    const authorList = Array.from(entry.getElementsByTagName('author'))
    const categories = Array.from(entry.getElementsByTagName('category'))
    return {
      title: entry.getElementsByTagName('title')[0].textContent,
      abstract: entry.getElementsByTagName('summary')[0].textContent,
      authors: authorList.map(author => author.getElementsByTagName('name')[0].textContent),
      categories: categories.map(category => category.getAttribute('term'))
    }
  })

  return { pageResults: jsonEntries, totalResults }

}
