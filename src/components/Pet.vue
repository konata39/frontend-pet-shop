
<template>
<div class="card-container" id="card-container">
</div>
</template>

<script setup>
let nowCounter = 0;
function getPokeAPI(){
  nowCounter += 1;
  fetch(`https://pokeapi.co/api/v2/pokemon/${nowCounter}/`)
  .then((response) => {
      return response.json();
  })
  .then( (response) => {
      //console.log(response.name);
      //console.log(response.sprites.front_default);
      var card = document.createElement('div');
      card.id = `card_${response.name}`;
      card.className = "card";

      var card-name = document.createElement('div');
      card-name.id = `card-name_${response.name}`;
      card-name.className = "card-name";
      card-name.innerText = response.name;

      var card-image = document.createElement('img');
      card-image.id = `card-image_${response.name}`;
      card-image.className = "card-image";
      card-image.src = response.sprites.front_default;

      card.appendChild(card-name);
      card.appendChild(card-image);
      card.onclick = function () {
        detailOpen(`${response.name}`);
      }
      document.getElementById('card-container').appendChild(card);

      fetch(`https://pokeapi.co/api/v2/pokemon-species/${nowCounter}/`)
      .then((detailResponse) => {
          return detailResponse.json();
      }).then( (detailResponse) => {
        var result = detailResponse.flavor_text_entries.filter(obj => {
          return obj.language.name === "zh-Hant";
        })
        var card-detail = document.createElement('div');
        card-detail.id = `card-detail_${response.name}`;
        card-detail.className = "card-detail";
        card-detail.innerText = result[0].flavor_text.replace(/\s+/g, "");
        console.log(result[0].flavor_text.replace(/\s+/g, ""))
        card.appendChild(card-detail);
      })
  })
  .catch((error) => {
      alert("Error on get API data!");
  })
}
function detailOpen(petName) {
  console.log(petName)
  fetch(`https://pokeapi.co/api/v2/pokemon-species/${petName}/`)
  .then((detailResponse) => {
      return detailResponse.json();
  }).then( (detailResponse) => {
    var result = detailResponse.flavor_text_entries.filter(obj => {
      return obj.language.name === "zh-Hant";
    })
    document.getElementById("display-block").innerText = result[0].flavor_text.replace(/\s+/g, "");
  })
  document.getElementById("right-menu").style.display = "block";
}
function detailClose() {
  document.getElementById("right-menu").style.display = "none";
}
</script>

<style scoped>
.close-tab{
  padding:8px 16px;
  float:right;
  width:auto;
  border:none;
  display:block;
  outline:0;
}
.card-container {
  width: 100%;
  height: 1750px;
  display: flex;
  flex-wrap: wrap;
  background-color: #BBB;
  align-content: flex-start;
}
.card{
  width: 200px;
  height: 300px;
  background-color: #FFF;
  transition: transform .2s; /* Animation */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  margin: 50px;
  border-radius: 5px;
}
.card:hover{
  transform: scale(1.3);
}
.detail-sidebar{
  height:100%;
  width:200px;
  top: 0;
  background-color: #fff;
  position: fixed !important;
  z-index: 1;
  display:none;
  right:0px;
  box-shadow:0 2px 5px 0 rgba(0,0,0,0.16),0 2px 10px 0 rgba(0,0,0,0.12);
  animation: animateright 0.4s;
}
.display-block{
  display:block;
}
.card-name{
  font-family: "Noto Sans TC", sans-serif;
  font-optical-sizing: auto;
  font-style: normal;
  text-align: center;
  vertical-align: middle;
  line-height: 25px;
  width: 150px;
  height: 30px;
  background-color: #BBB;
  margin: auto;
  margin-top: 10px;
  border-radius: 5px;
  font-size: 18pt;
}
.card-image{
  line-height: 25px;
  width: 150px;
  height: 150px;
  position: relative;
  left:25px;
  margin: auto;
}
.card-detail{
  -webkit-box-orient: vertical;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  width: 150px;
  height: 100px;
  position: relative;
  margin: auto;

}
/* When the screen width is 640px or less */
@media screen and (max-width: 640px) {
    .card{
      width: 110px;
      height: 180px;
      background-color: #FF0;
      margin: 6px;
      border-radius: 5px;
    }
    .card-name{
      font-family: "Noto Sans TC", sans-serif;
      font-optical-sizing: auto;
      font-style: normal;
      text-align: center;
      vertical-align: middle;
      line-height: 25px;
      width: 150px;
      height: 30px;
      background-color: #BBB;
      margin: auto;
      margin-top: 10px;
      border-radius: 5px;
      font-size: 18pt;
    }
    .card-detail{
      width: 150px;
      height: 150px;
      position: relative;
      margin: auto;
    }
}
@keyframes animateright {
  0% {right:-300px; opacity: 0;}
  100% {right:0; opacity:1;}
}
</style>
