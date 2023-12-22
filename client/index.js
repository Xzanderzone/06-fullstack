const main = document.body.querySelector("main");
let UI = document.createElement("div");
UI.classList.add("interface");
let shownIdeas = document.createElement("div");
shownIdeas.classList.add("shownIdeas");

const SERVER_HOST = "http://localhost:3000";
const drawPost = async (post) => {
  let response;
  if (post) response = await fetch(`${SERVER_HOST}/ideas/${post}`);
  else response = await fetch(`${SERVER_HOST}/ideas/all`);
  const data = await response.json();

  shownIdeas.innerHTML = [];
  if (data == "") {
    const current = document.createElement("div");
    current.classList.add("idea");

    //empty search
    const title = document.createElement("h2");
    title.classList.add("warning");
    title.textContent =
      "No idea what you mean! (No ideas were found,maybe it's as a new one!)";
    current.appendChild(title);
    shownIdeas.appendChild(current);
  } else
    data.forEach((idea) => {
      //show content
      const current = document.createElement("div");
      current.classList.add("idea");

      let x = Math.floor(Math.random() * 156);
      let y = Math.floor(Math.random() * 156);
      let z = Math.floor(Math.random() * 156);
      current.style.backgroundColor = "rgb(" + x + "," + y + "," + z + ")";

      const title = document.createElement("input");
      title.classList.add("title");
      title.value = idea.title;
      title.disabled = true;
      current.appendChild(title);
      const content = document.createElement("textarea");
      content.style.minHeight = "45px";
      content.value = idea.description;
      content.classList.add("description");
      content.disabled = true;
      current.appendChild(content);

      //update post
      const b_UpdateCurrent = document.createElement("button");
      b_UpdateCurrent.classList.add("update");
      b_UpdateCurrent.textContent = "update idea";
      b_UpdateCurrent.addEventListener("click", async () => {
        if (b_UpdateCurrent.textContent == "confirm changes") {
          b_UpdateCurrent.textContent = "update idea";
          content.disabled = true;
          title.disabled = true;
          await fetch(`${SERVER_HOST}/ideas/${idea.id}`, {
            method: "PUT",
            body: JSON.stringify({
              title: title.value,
              description: content.value,
            }),
            headers: {
              "Content-Type": "application/json; charset=UTF-8",
            },
          });
        } else {
          b_UpdateCurrent.textContent = "confirm changes";
          content.disabled = false;
          title.disabled = false;
        }
      });

      //remove post
      const b_RemoveCurrent = document.createElement("button");
      b_RemoveCurrent.classList.add("remove");
      b_RemoveCurrent.textContent = "Remove idea";
      b_RemoveCurrent.addEventListener("click", async () => {
        b_RemoveCurrent.classList.toggle("confirming");
        if (b_RemoveCurrent.textContent === "confirm delete") {
          b_RemoveCurrent.textContent = "Remove idea";
          await fetch(`${SERVER_HOST}/ideas/${idea.id}`, {
            method: "DELETE",
          });
          drawPost();
        } else {
          b_RemoveCurrent.textContent = "one second";
          //shortly disabeling the button to stop accidental doubleclicks
          b_RemoveCurrent.disabled = true;
          setTimeout(() => {
            b_RemoveCurrent.textContent = "confirm delete";
            b_RemoveCurrent.disabled = false;
            setTimeout(() => {
              b_RemoveCurrent.textContent = "Remove idea";
              b_RemoveCurrent.classList.toggle("confirming");
            }, 5000);
          }, 750);
        }
      });
      current.appendChild(b_UpdateCurrent);
      current.appendChild(b_RemoveCurrent);
      shownIdeas.appendChild(current);
    });
};

//searching posts
const b_ViewAll = document.createElement("button");
b_ViewAll.classList.add("viewAll");
b_ViewAll.textContent = "View All Ideas";
b_ViewAll.style.marginLeft = "30px";
b_ViewAll.addEventListener("click", async () => {
  drawPost();
});

const searchBar = document.createElement("input");
searchBar.classList.add("search");
searchBar.placeholder = "title,description or id";
searchBar.style.minWidth = "150px";
searchBar.style.minHeight = "20px";
searchBar.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    drawPost(e.target.value);
  }
});
UI.appendChild(searchBar);

//extra enter button for search
const b_SearchEnter = document.createElement("button");
b_SearchEnter.classList.add("search");
b_SearchEnter.textContent = "Search";
b_SearchEnter.addEventListener("click", async () => {
  drawPost(searchBar.value);
});
UI.appendChild(b_SearchEnter);
UI.appendChild(b_ViewAll);
main.appendChild(UI);

//create a post (seperated ui)
let createPost = document.createElement("div");
createPost.classList.add("createPost");

const titleLabel = document.createElement("label");
titleLabel.textContent = "Idea";
titleLabel.htmlFor = "title";
const title = document.createElement("input");
title.classList.add("title");
title.id = "title";
title.placeholder = "enter post name";
createPost.appendChild(titleLabel);
createPost.appendChild(title);

const descriptionLabel = document.createElement("label");
descriptionLabel.textContent = "Description";
descriptionLabel.htmlFor = "description";
const description = document.createElement("textarea");
description.classList.add("description");
description.id = "description";
description.placeholder = "describe the idea";
description.addEventListener("keypress", () => {});
createPost.appendChild(descriptionLabel);
createPost.appendChild(description);

const b_create = document.createElement("button");
b_create.classList.add("create");
b_create.textContent = "Create idea";
createPost.appendChild(b_create);
const warning = document.createElement("h2");
b_create.addEventListener("click", async () => {
  let empty = "";
  if (title.value == "") empty += "Idea needs a name! ";
  if (description.value == "") empty += "Idea needs to be described!";
  if (empty !== "") {
    warning.hidden = false;
    warning.textContent = empty;
    createPost.prepend(warning);
  } else {
    warning.hidden = true;
    const response = await fetch(`${SERVER_HOST}/ideas/create`, {
      method: "POST",
      body: JSON.stringify({
        title: title.value,
        description: description.value,
      }),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    const data = await response.json();
    drawPost();
  }
});

main.appendChild(createPost);
main.appendChild(shownIdeas);
