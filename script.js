async function requestAPI() {
    //var let const
    const pokemon = document.getElementById("search").value.toLowerCase(); //pega o texto do input
    
    document.getElementById("not-found").style.display = "none";

    document.getElementById("image").src = `https://img.pokemondb.net/artwork/large/${pokemon}.jpg`
    const resPokemon = await requestPokemon(pokemon);
    const resEvolution = await requestEvolution(pokemon);
    const resCategory = await requestCategory(pokemon);

    if(resPokemon)
        pushArray(resPokemon, resEvolution, resCategory);
    else 
        errorResponse();
}

async function requestPokemon(pokemon) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        return response.data;
    } catch(error) {
        console.log(error);
    }
}

async function requestEvolution(pokemon) {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
        const responseEvo = await axios.get(response.data.evolution_chain.url);
        return responseEvo.data.chain;
    } catch(error) {
        console.log(error);
    }
}

async function requestCategory(pokemon) {
    try {
      const responseData = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemon}`);
      return responseData.data.egg_groups;
    } catch (error) {
      console.log(error);
    }
  }

function pushArray(resPokemon, resEvolution, resCategory) {
    const arrayPokemon = [];
    const arrayEvolution = [];

    arrayPokemon.push({
        nome: resPokemon.name,
        categoria: resCategory,
        tipos: resPokemon.types,
        peso: resPokemon.weight,
        tamanho: resPokemon.height,
        habilidades: resPokemon.abilities
    });

    do {
        let numEvo = resEvolution.evolves_to.length;

        arrayEvolution.push({
            nome: resEvolution.species.name
        });

        if(numEvo > 1) {
            for(let i = 1; i < numEvo; i++) {
                arrayEvolution.push({
                    nome: resEvolution.evolves_to[i].species.name
                });
            }
        }
        resEvolution = resEvolution.evolves_to[0];
    } while(resEvolution);

    changeHTML(arrayPokemon, arrayEvolution);
}

function changeHTML(arrayPokemon, arrayEvolution) {
    const tag = document.getElementsByClassName("desc");
    let tipos = "";
    let hab = "";
    let evo = "";
    let cat = "";
    /*
        tipos[0]
        tipos = "" + "static";
        tipos = "static";

        tipos[1]
        tipos = "static" + "lighting-rod"
        tipos = "static <br> lighting-rod"

    */
    for(let i = 0; i < arrayPokemon[0].tipos.length; i++) {
        tipos = tipos + arrayPokemon[0].tipos[i].type.name + "<br>";
    }

    for(let i = 0; i < arrayPokemon[0].habilidades.length; i++) {
        hab = hab + arrayPokemon[0].habilidades[i].ability.name + "<br>";
    }

    for(let i = 0; i < arrayEvolution.length; i++) {
        evo = evo + arrayEvolution[i].nome + "<br>";
    }

    for(let i = 0; i < arrayPokemon[0].categoria.length; i++) {
        cat = cat + arrayPokemon[0].categoria[i].name + "<br>";
    }
    tag[0].innerHTML = cat;
    tag[1].innerHTML = tipos;
    tag[2].innerText = (arrayPokemon[0].tamanho)/10 + " m";
    tag[3].innerText = (arrayPokemon[0].peso)/10 + " kg";
    tag[4].innerHTML = evo;
    tag[5].innerHTML = hab;
}

function errorResponse() {
    document.getElementById("not-found").style.display = "block";
    const tag = document.getElementsByClassName("desc");
    for(i in tag) {
      tag[i].innerText = "- - -";
    }
}

function notfound() {
    document.getElementById("image").src = "image-not-found.jpg";
}