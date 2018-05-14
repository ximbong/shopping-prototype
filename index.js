document.addEventListener("DOMContentLoaded", function(event) {
  const wishArray = [];
  const favoriteArray = [];
  const toDo = {};

  document.addEventListener("click", function(e) {
    if (e.target.classList.contains('action')) {
      const action = e.target.classList[2];
      const name = e.target.parentElement.parentElement.previousElementSibling.children[1].children[0].textContent;
      if (action === 'like') {
        favoriteArray.push(name);
      } else if (action === 'love') {
        wishArray.push(name)
      }
      console.log(action, name)
    }
    if(e.target.classList.contains('button')){
      const section = e.target.textContent;
      if (section === "Wish list") {
        console.log('Open wish list')
      }
    }
  })
});
