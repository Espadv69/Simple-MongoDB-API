document
  .querySelector('.useForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault()

    const name = document.querySelector('.name').value
    const email = document.querySelector('.email').value
    const password = document.querySelector('.password').value

    const response = await fetch('http://localhost:5000/add-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()
    alert(data.message)
    loadUsers()
  })

async function loadUsers() {
  const response = await fetch('http://localhost:5000/get-users')
  const users = await response.json()

  const $userList = document.querySelector('.usersList')
  $userList.innerHTML = ''
  users.forEach((user) => {
    const $li = document.createElement('li')
    $li.textContent = `${user.name} - ${user.email}`
    $userList.appendChild($li)
  })
}

loadUsers()
