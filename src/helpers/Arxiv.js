export const fetchAndParseArxiv = async (queryString) => {
  const resp = await fetch(`https://export.arxiv.org/api/query?${queryString}`)
  const xmlStr = await resp.text()
  const parser = new DOMParser()
  const parsedXML = parser.parseFromString(xmlStr, 'text/xml')
  const totalResults = parsedXML.getElementsByTagName(
    'opensearch:totalResults'
  )[0].textContent
  const entries = parsedXML.getElementsByTagName('entry')

  const jsonEntries = Array.from(entries).map((entry) => {
    const authorList = Array.from(entry.getElementsByTagName('author'))
    const categories = Array.from(entry.getElementsByTagName('category'))
    const links = Array.from(entry.getElementsByTagName('link'))
    return {
      id: entry.getElementsByTagName('id')[0].textContent.split('/').pop(),
      title: entry.getElementsByTagName('title')[0].textContent,
      abstract: entry.getElementsByTagName('summary')[0].textContent,
      authors: authorList.map(
        (author) => author.getElementsByTagName('name')[0].textContent
      ),
      arxivLink: links
        .find((link) => link.getAttribute('type') === 'text/html')
        .getAttribute('href'),
      pdfLink: links
        .find((link) => link.getAttribute('type') === 'application/pdf')
        .getAttribute('href'),
      categories: categories.map((category) => category.getAttribute('term')),
      updatedAt: entry.getElementsByTagName('updated')[0].textContent,
    }
  })

  return { pageResults: jsonEntries, totalResults }
}
