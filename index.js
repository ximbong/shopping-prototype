document.addEventListener("DOMContentLoaded", function(event) {
  const favoriteArray = [];
  let toBuy = [];
  const wrapper = document.querySelector('.wrapper');
  const form = document.querySelectorAll('.form');
  const body = document.querySelector('body');

  const displayPopup = (id) => {
    document.querySelector(`#${id} .checkboxes`).innerHTML = '';
    document.getElementById(id).style.display = 'flex';
    wrapper.style.display = 'flex';
    body.style.overflow = 'hidden';
  }

  const hidePopup = (element) => {
    element.style.display = 'none';
    wrapper.style.display = 'none';
    body.style.overflow = 'auto';
  }

  document.addEventListener("click", function(e) {
    if (e.target.classList.contains('action')) {
      const action = e.target.classList[2];
      e.target.classList.toggle('effect');
      const name = e.target.parentElement.parentElement.previousElementSibling.children[1].children[0].textContent;
      if (action === 'like') {
        if (favoriteArray.indexOf(name) === -1) {
          favoriteArray.push(name);
          console.log(favoriteArray)
        } else {
          favoriteArray.splice(favoriteArray.indexOf(name), 1);
          console.log(favoriteArray)
        }
      }
      if (action === 'add') {
        let removeIndex = -1;
        toBuy.forEach(function(item, index) {
          if ((item.name) === name) {
            removeIndex = index;
          }
        })
        if (removeIndex === -1) {
          toBuy.push({
            name: name,
            quantity: 1
          })
        } else {
          toBuy.splice(removeIndex, 1)
        }
      }

    }
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
      }
      if (section === "To-buy list") {
        displayPopup('to-buy-form');

        for (let element of toBuy) {
          document.querySelector(`#to-buy-form .checkboxes`).innerHTML +=
            `
          <div class="to-buy-list">
            <div class="tb-item">
              <div class="tb-details">
                <div class="tb-name">${element.name}</div>
                <input type="number" value="${element.quantity}">
              </div>
              <i class="fas fa-times delete-item"></i>
            </div>
          </div>
          `
        }
      }
    }
  })


  for (let element of form) {
    element.addEventListener("click", function(e) {
      if (e.target.classList.contains('form-close')) {
        hidePopup(element);
      }
      if (e.target.classList.contains('delete-item')) {
        const thisItem = e.target.parentElement;
        thisItem.remove();
        console.log(thisItem)
      }
      if (e.target.classList.contains('update-tb')) {
        hidePopup(element);
        let newArray = [].slice.call(document.querySelectorAll("#to-buy-form .tb-details"));
        newArray = newArray.map(function(item) {
          let name = item.querySelector(".tb-name").textContent;
          let number = item.querySelector("input").value;
          return {
            name: name,
            quantity: number
          };
        })
        toBuy = newArray;
      }
      if (e.target.classList.contains('unlike-btn')) {
        let unlikeList = document.querySelector("#favorite-form .checkboxes").querySelectorAll("input:checked");
        for (let item of unlikeList) {
          element.querySelector(".unlike-checkboxes").appendChild(item.parentElement);
          favoriteArray.splice(favoriteArray.indexOf(item.parentElement.textContent), 1);
          console.log(favoriteArray)
          }
      }
      if (e.target.classList.contains('undo-btn')) {
        let undoList = document.querySelector("#favorite-form .unlike-checkboxes").querySelectorAll("input:checked");
        for (let item of undoList) {
          element.querySelector(".checkboxes").appendChild(item.parentElement);
          favoriteArray.push(item.parentElement.textContent);
          console.log(favoriteArray)
        }
      }
    })
  }
});
