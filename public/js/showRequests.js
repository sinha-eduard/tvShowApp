const searchBar = document.querySelector("#searchBar");
const searchForm = document.querySelector("#searchForm");
const searchDiv = document.querySelector("#searchResults");
const searchText = document.querySelector("#searchText")
const loadingDiv = document.querySelector("#loadingDiv")

let shows = document.querySelectorAll(".results");

const getShow = async (showName) => {
  try {
    const results = await axios.get(
      `https://api.tvmaze.com/search/shows?q=${showName}`
    );
    return results;
  } catch (error) {
    console.log("Error: " + error);
  }
};

const search = async () => {
  let show = searchBar.value;
  let res = await getShow(show);
  let resArr = [];
  for (let i = 0; i < res.data.length; i++) {
    resArr.push(res.data[i]);
  }
  return resArr;
};

const displaySearch = async (res) => {
  searchDiv.innerHTML = "";

  for (let i = 0; i < res.length; i++) {
    const mainDiv = document.createElement("div");
    const imgDiv = document.createElement("div");
    const newDiv = document.createElement("div");
    const infoDiv = document.createElement("div");
    const image = document.createElement("img");
    const title = document.createElement("h2");
    const rating = document.createElement("p");
    const status = document.createElement("p");
    const genre = document.createElement("p");
    const input = document.createElement("input");

    title.append(res[i].show.name);
    title.classList.add("font-bold")
    title.classList.add("text-xl")
    if (res[i].show.rating.average === null) {
      rating.append("N/A");
    } else {
      rating.append(res[i].show.rating.average);
    }
    status.append(res[i].show.status);

    try {
      image.src = res[i].show.image.medium;
    } catch (error) {
      image.src =
        "https://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
    }

    let gen = res[i].show.genres;
    for (let element of gen) {
      genre.append(element + " ");
    }

    let id = res[i].show.id;

    imgDiv.classList.add("h-[264px]")
    imgDiv.classList.add("w-[188px]")
    image.classList.add("max-h-[264px]")
    image.classList.add("max-w-[188px]")
    input.type = "radio";
    input.name = "showDes"
    newDiv.append(input)
    imgDiv.append(image);
    mainDiv.append(title);
    mainDiv.append(rating);
    mainDiv.append(status);
    mainDiv.append(genre);
    infoDiv.append(imgDiv);
    infoDiv.append(mainDiv);
    newDiv.append(infoDiv);
    mainDiv.classList.add("pl-4")
    infoDiv.classList.add("collapse-title");
    infoDiv.classList.add("flex");
    newDiv.classList.add("collapse");
    newDiv.classList.add("w-2/5");
    newDiv.classList.add("hover:bg-secondary-content");
    newDiv.classList.add("text-white");
  
    
    mainDiv.classList.add("text-results");
    imgDiv.classList.add("img-results");
    newDiv.id = `${id}`;
    searchDiv.append(newDiv);

    const descDiv = document.createElement("div");
    const lang = document.createElement("p");
    const summary = document.createElement("p");
    const premire = document.createElement("p");
    const seasonsepisodes = document.createElement("p");

    try {
      const show = await axios.get(`https://api.tvmaze.com/shows/${id}`);
      const seasons = await axios.get(
       `https://api.tvmaze.com/shows/${id}/seasons`
      );
      const episodes = await axios.get(
       `https://api.tvmaze.com/shows/${id}/episodes`
      );
      seasonsepisodes.append(`${seasons.data.length} seasons | ${episodes.data.length} episodes |
       Avg. Runtime: ${show.data.averageRuntime} mins`);
      lang.append(show.data.language);
      premire.append(show.data.premiered)
      summary.innerHTML = show.data.summary
    } catch (error) {
      console.log("Error: " + error);
    }

    descDiv.append(seasonsepisodes);
    seasonsepisodes.classList.add("minor")
    descDiv.append(lang);
    lang.classList.add("minor")
    descDiv.append(premire);
    premire.classList.add("minor")
    descDiv.append(summary);
    descDiv.classList.add("collapse-content");
    descDiv.classList.add("bg-primary")
    newDiv.append(descDiv);
  }
};

const setH2 = function(){
  let show = searchBar.value;
  searchText.innerText = `Search Results For ${show}`
}

const createLoading = function(){
  const load = document.createElement("span");
  load.classList.add("loading")
  load.classList.add("loading-spinner")
  load.classList.add("text-primary")
  load.id="load-span"
  loadingDiv.append(load)
}

const removeLoading = function(){
  const loadSpan = document.querySelector("#load-span")
  loadSpan.remove()
}

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  setH2()
  createLoading()
  let res = await search();
  await displaySearch(res);
  removeLoading()
  searchBar.value = "";
});
