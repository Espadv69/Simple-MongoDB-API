document
  .querySelector('.useForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault()

    const $name = document.querySelector('.name')
    const $email = document.querySelector('.email')
    const $password = document.querySelector('.password')

    const name = $name.value
    const email = $email.value
    const password = $password.value

    const response = await fetch('http://localhost:5000/add-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })

    const data = await response.json()
    alert(data.message)
    loadUsers()

    // Limpiar inputs
    $name.value = ''
    $email.value = ''
    $password.value = ''
  })

async function loadUsers() {
  const response = await fetch('http://localhost:5000/get-users')
  const users = await response.json()

  const $userList = document.querySelector('.usersList')
  $userList.innerHTML = ''

  users.forEach((user) => {
    const $li = document.createElement('li')
    $li.innerHTML = `
      <p>${user.name} - ${user.email}</p>
      <button onclick="deleteUser('${user._id}')">❌ Delete</button>
      <button onclick="editUser('${user._id}')">✏️ Edit</button>
    `
    $userList.appendChild($li)
  })
}

async function deleteUser(userId) {
  if (!confirm('Are you sure ypu want to delete this user?')) return

  const response = await fetch(`http://localhost:5000/delete-user/${userId}`, {
    method: 'DELETE',
  })

  const data = await response.json()
  alert(data.message)
  loadUsers()
}

async function editUser(UserId) {
  const newName = prompt('Enter new name:')
  const newEmail = prompt('Enter new email:')

  if (!newName || !newEmail) return

  const response = await fetch(`http://localhost:5000/update-user/${UserId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName, email: newEmail }),
  })

  const data = await response.json()
  alert(data.message)
  loadUsers()
}

loadUsers()
