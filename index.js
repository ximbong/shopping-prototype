document.addEventListener("DOMContentLoaded", function(event) {
  let favoriteArray = [];
  let toBuy = [];

  //display popup with its ID
  const displayPopup = (id) => {
    document.querySelector(`#${id} .checkboxes`).innerHTML = '';
    document.getElementById(id).style.display = 'flex';
    document.querySelector('.wrapper').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  const hidePopup = (element) => {
    element.style.display = 'none';
    document.querySelector('.wrapper').style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  //modify effect on the related element
  //(element = text inside the element, action = like/add, change = add/remove)
  const modifyEffect = (element, action, change) => {
    Array.from(document.querySelectorAll(".content .details .name")).forEach(function(item) {
      if (element === item.textContent) {
        const topParent = item.parentElement.parentElement.parentElement;
        if (change === 'remove') {
          topParent.querySelector(`.${action}`).classList.remove('effect')
        } else {
          topParent.querySelector(`.${action}`).classList.add('effect')
        }
      }
    })
  }

  //update favorite array in localStorage
  const updateFav = () => {
    const favString = favoriteArray.join('-');
    localStorage.setItem('favString', favString);
  }

  //update toBuy array in localStorage
  const updateAdd = () => {
    const toBuyClone = toBuy.map(function(element) {
      return JSON.stringify(element);
    })
    const addString = toBuyClone.join('-');
    localStorage.setItem('addString', addString);
  }

  //this function when page loads, which takes the favoriteArray in localStorage to replace the current one
  const localStorageFav = () => {
    const favString = localStorage.getItem('favString');
    if (favString)
      favoriteArray = favString.split("-");

    for (let element of favoriteArray) {
      modifyEffect(element, 'like', 'add');
    }
  }

  //this function when page loads, which takes the toBuy array in localStorage to replace the current one
  const localStorageAdd = () => {
    const addString = localStorage.getItem('addString');
    if (addString) {
      const addArray = addString.split("-");
      toBuy = addArray.map(function(element) {
        return JSON.parse(element)
      })
    }
    for (let element of toBuy) {
      modifyEffect(element.name, 'add', 'add');
    }
  }

  //run these functions to 'reload' the last session
  localStorageFav();
  localStorageAdd();

  document.addEventListener("click", function(e) {

    //if click on an action button
    if (e.target.classList.contains('action')) {
      const action = e.target.classList[2];
      e.target.classList.toggle('effect');
      const name = e.target.parentElement.parentElement.previousElementSibling.children[1].children[0].textContent;

      if (action === 'like') {
        //use includes method instead
        if (favoriteArray.indexOf(name) === -1) {
          favoriteArray.push(name);
        } else {
          favoriteArray.splice(favoriteArray.indexOf(name), 1);
        }
        updateFav();
      }

      if (action === 'add') {

        const removeIndex = toBuy.findIndex(function(item) {
          return (item.name) === name;
        })

        if (removeIndex === -1) {
          toBuy.push({name: name, quantity: 1})
        } else {
          toBuy.splice(removeIndex, 1)
        }
      }
      updateAdd();
    }

    //if click on a form button
    if (e.target.classList.contains('button')) {
      const section = e.target.textContent;
      if (section === "Favorite") {
        displayPopup('favorite-form');

        for (let element of favoriteArray) {
          const label = document.createElement("label");
          const input = document.createElement("input");
          const span = document.createElement("span");
          const textNode = document.createTextNode(element);
          label.classList.add('line');
          label.setAttribute("for", element)
          input.setAttribute("type", "checkbox");
          input.id = element;
          span.classList.add("checkmark");
          label.appendChild(textNode);
          label.appendChild(input);
          label.appendChild(span);
          document.querySelector("#favorite-form .checkboxes").appendChild(label);
        }
        document.querySelector(".unlike-checkboxes").innerHTML = '';
      }

      if (section === "To-buy list") {
        displayPopup('to-buy-form');

        for (let element of toBuy) {
          document.querySelector(`#to-buy-form .checkboxes`).innerHTML += `
          <div class="to-buy-list">
            <div class="tb-item">
              <div class="tb-details">
                <div class="tb-name">${element.name}</div>
                <input type="number" min="0" value="${element.quantity}">
              </div>
              <i class="fas fa-times delete-item"></i>
            </div>
          </div>
          `
        }
      }
    }
  })

  for (let element of document.querySelectorAll('.form')) {
    element.addEventListener("click", function(e) {

      //if click on a close button
      if (e.target.classList.contains('form-close')) {
        hidePopup(element);
      }

      //if click on a delete button in a to-buy list
      if (e.target.classList.contains('delete-item')) {
        const thisItem = e.target.parentElement;
        thisItem.remove();
        const name = thisItem.querySelector('.tb-name').textContent;
        modifyEffect(name, 'add', 'remove');
      }

      //if click on update buying list button
      if (e.target.classList.contains('update-tb')) {
        hidePopup(element);
        let newArray = [].slice.call(document.querySelectorAll("#to-buy-form .tb-details"));
        newArray = newArray.map(function(item) {
          const name = item.querySelector(".tb-name").textContent;
          const number = item.querySelector("input").value;
          return {name: name, quantity: number};
        })
        toBuy = newArray;
        updateAdd();
      }

      //if click on unlike button
      if (e.target.classList.contains('unlike-btn')) {
        const unlikeList = document.querySelector("#favorite-form .checkboxes").querySelectorAll("input:checked");
        const unlikeArray = [];
        for (let item of unlikeList) {
          element.querySelector(".unlike-checkboxes").appendChild(item.parentElement);
          unlikeArray.push(item.parentElement.textContent);
          favoriteArray.splice(favoriteArray.indexOf(item.parentElement.textContent), 1);
        }
        updateFav();
        unlikeArray.forEach(function(element) {
          modifyEffect(element, 'like', 'remove');
        })
      }

      //if click on undo button
      if (e.target.classList.contains('undo-btn')) {
        const undoList = document.querySelector("#favorite-form .unlike-checkboxes").querySelectorAll("input:checked");
        const likeArray = [];
        for (let item of undoList) {
          element.querySelector(".checkboxes").appendChild(item.parentElement);
          favoriteArray.push(item.parentElement.textContent);
          likeArray.push(item.parentElement.textContent);
        }
        updateFav();
        likeArray.forEach(function(element) {
          modifyEffect(element, 'like', 'add');
        })
      }
    })
  }

  //smooth scrolling
  let anchorlinks = document.querySelectorAll('a[href^="#"]')
  for (let item of anchorlinks) { // relitere
    item.addEventListener('click', (e) => {
      let hashval = item.getAttribute('href')
      let target = document.querySelector(hashval)
      target.scrollIntoView({behavior: 'smooth'})
      history.pushState(null, null, hashval)
      e.preventDefault()
    })
  }

});
