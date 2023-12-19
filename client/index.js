const main = document.body.querySelector("main");
let UI = document.createElement("div");
UI.classList.add("interface");

//searching posts
const b_ViewAll = document.createElement("button");
b_ViewAll.classList.add("viewAll");
b_ViewAll.textContent = "View All Ideas";
b_ViewAll.addEventListener("click", async () => {
  console.log("view all");
  const response = await fetch("http://localhost:3000/ideas/all");
  const data = await response.json();
  console.log(data);
});
UI.appendChild(b_ViewAll);

const searchBar = document.createElement("input");
searchBar.classList.add("search");
searchBar.placeholder = "1";
searchBar.addEventListener("keypress", () => {
  console.log("searching");
});
UI.appendChild(searchBar);

//remove post
const b_RemoveCurrent = document.createElement("button");
b_RemoveCurrent.classList.add("remove");
b_RemoveCurrent.textContent = "Remove current idea";
UI.appendChild(b_RemoveCurrent);
b_RemoveCurrent.addEventListener("click", () => {
  console.log("remove");
});
main.appendChild(UI);

//create a post (seperated ui)
let createPost = document.createElement("div");
createPost.classList.add("createPost");

const titleLabel = document.createElement("label");
titleLabel.textContent = "Idea name";
titleLabel.htmlFor = "title";
const title = document.createElement("input");
title.classList.add("title");
title.id = "title";
title.placeholder = "enter post name";
title.addEventListener("keypress", () => {
  console.log("title");
});
createPost.appendChild(titleLabel);
createPost.appendChild(title);

const descriptionLabel = document.createElement("label");
descriptionLabel.textContent = "Idea description";
descriptionLabel.htmlFor = "description";
const description = document.createElement("input");
description.classList.add("description");
description.id = "description";
description.height = "20vh";
description.placeholder = "describe the idea";
description.addEventListener("keypress", () => {
  console.log("description");
});
createPost.appendChild(descriptionLabel);
createPost.appendChild(description);

const b_create = document.createElement("button");
b_create.classList.add("create");
b_create.textContent = "Create idea";
createPost.appendChild(b_create);
b_create.addEventListener("click", () => {
  console.log("create");
});

main.appendChild(createPost);
