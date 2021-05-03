let endpoint = 'https://api.github.com/search/repositories'
let form = document.querySelector('form')
let inputs = document.querySelectorAll('input')
let selects = document.querySelectorAll('select')
let [query, language, perPage, page] = inputs
let [sortBy, orderBy] = selects
let results = document.querySelector('div')
let search = new URLSearchParams(location.search)
let button = document.querySelector('button')

for (let [key, value] of search) {
  if (key == 'query') query.value = value
  else if (key == 'language') language.value = value
  else if (key == 'sortBy') sortBy.value = value
  else if (key == 'orderBy') orderBy.value = value
  else if (key == 'perPage') perPage.value = value
  else if (key == 'page') page.value = value
}

let handle = async event => {
  event.preventDefault()
  results.textContent = 'searching...'

  let {value} = query

  if (!value) return results.textContent = 'missing search query.'
  if (language.value) value += `+language:${language.value}`

  let params = `?q=${value}&sort=${sortBy.value}&order=${orderBy.value}&per_page=${perPage.value}&page=${page.value}`
  let res = await fetch(endpoint + params)
  
  if (res.status != 200) return results.textContent = 'something went wrong.'
  
  let body = await res.json()
  
  if (body.total_count == 0) return results.textContent = 'no results found.'
  results.textContent = `results: ${body.total_count}`
  
  for (let repo of body.items) {
    let div = document.createElement('div')
    
    let a = document.createElement('a')
    a.href = repo.html_url
    a.target = '_blank'
    a.rel = 'noopener'
    a.textContent = repo.full_name

    if (repo.archived) {
    	let span = document.createElement('span')
    	span.textContent = 'archived'
    	a.append(span)
    }

    let p = document.createElement('p')
    p.textContent = repo.description
    
    div.append(a)
    div.append(p)
    results.append(div)
  }

  history.pushState(null, null, `?query=${query.value}&language=${language.value}&sortBy=${sortBy.value}&orderBy=${orderBy.value}&perPage=${perPage.value}&page=${page.value}`)
}

form.addEventListener('submit', handle)
if (query.value) button.click()
