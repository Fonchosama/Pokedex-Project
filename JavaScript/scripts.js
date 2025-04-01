const APIURL = "https://pokeapi.co/api/v2/pokemon/?limit=30";

let pokemonRepository = (function () {
  let pokemonList = [];
  let prevURL = null;
  let nextURL = null;

  function getAll() {
    return pokemonList;
  }

  function add(pokemon) {
    pokemonList.push(pokemon);
  }

  function addListItem(pokemon) {
    let nuevoElemento = document.querySelector(".lista-pokemon");
    let listItem = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("pokemon-button"); //Can't add the button bootstrap mod here ->> btn btn-light
    button.classList = "pokemon-button btn btn-dark";
    button.setAttribute("data-toggle", "modal");
    button.setAttribute("data-target", "#pokemon-modal");
   
    listItem.appendChild(button);
    nuevoElemento.appendChild(listItem);
    listItem.classList.add("lista");
    button.addEventListener("click", function () {
    showDetails(pokemon);
    });
    }

  function loadList(apiurl) {
    return fetch(apiurl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        prevURL = json.previous;
        nextURL = json.next;
        json.results.forEach(function (item) {
          let pokemon = {
            name: item.name,
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function getPrevUrl() {
    return prevURL;
  }

  function getNextUrl() {
    button.setAttribute("data-target", ".nxt");
    return nextURL;
  }

  function loadDetails(pokemon) {
    let url = pokemon.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        pokemon.imgUrl = details.sprites.front_default; 
        pokemon.height = details.height;
        console.log(pokemon.imgUrl, pokemon.height);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function showDetails(pokemon) {
    pokemonRepository.loadDetails(pokemon).then(function () {
      console.log(pokemon);
      showModal(
        pokemon
      );
    });
  }

  function showModal(pokemon) {
    let modal = document.querySelector('#pokemon-modal');
    let modalTitle = modal.querySelector('.modal-title');
    let modalImage = modal.querySelector('.modal-img');
    let modalHeight = modal.querySelector('.modal-height');
  
    // Asignarr valores al modal
    modalTitle.innerText = pokemon.name;
    modalImage.src = pokemon.imgUrl;
    modalHeight.innerText = 'Height: ' + pokemon.height;
   }
  
  function hideModal() {
    let modal = document.querySelector('#pokemon-modal');
    modal.style.display = 'none';
  }

  function cleanAll() {
    pokemonList.length = 0;
    // cleanup ui
    let nuevoElemento = document.querySelector(".lista-pokemon");
    nuevoElemento.innerHTML = "";
  }

  return {
    getAll,
    add,
    addListItem,
    loadList,
    loadDetails,
    getPrevUrl,
    getNextUrl,
    cleanAll
  };
})();

pokemonRepository.loadList(APIURL).then(function () {
  let pokemonList = pokemonRepository.getAll();

  pokemonList.forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});


// temp1.addEventListener("click", () => {
//   // clean ui and gloabl array
//   pokemonRepository.cleanAll();
//       pokemonRepository.loadList(pokemonRepository.getNextUrl()).then(function () {
// let pokemonList = pokemonRepository.getAll();

// pokemonList.forEach(function (pokemon) {
//   pokemonRepository.addListItem(pokemon);
// });
// });
// });

document.addEventListener("DOMContentLoaded", function () {
  const nextButton = document.getElementById("nxt");

  nextButton.addEventListener("click", () => {
    // Limpiar UI y array global
    pokemonRepository.cleanAll();

    // Cargar más Pokémon desde la siguiente URL
    pokemonRepository.loadList(pokemonRepository.getNextUrl()).then(function () {
      let pokemonList = pokemonRepository.getAll();

      pokemonList.forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
      });
    });
  });
});