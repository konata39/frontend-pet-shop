let nowCounter = 0
function getPokeAPI() {
  nowCounter += 1
  fetch(`https://pokeapi.co/api/v2/pokemon/${nowCounter}/`)
    .then(response => {
      return response.json()
    })
    .then(response => {
      //console.log(response.name);
      //console.log(response.sprites.front_default);
      var card = document.createElement('div')
      card.id = `card_${response.name}`
      card.className = 'card'
      var cardName = document.createElement('div')
      cardName.id = `cardName_${response.name}`
      cardName.className = 'cardName'
      cardName.innerText = response.name
      var cardImage = document.createElement('img')
      cardImage.id = `cardImage_${response.name}`
      cardImage.className = 'cardImage'
      cardImage.src = response.sprites.front_default
      card.appendChild(cardName)
      card.appendChild(cardImage)
      document.getElementById('cardContainer').appendChild(card)
    })
    .catch(error => {
      alert('Error on get API data!')
    })
}
