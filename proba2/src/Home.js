import React from 'react'
import axios from 'axios'

function Home() {
  const handleAuth = () => {
    axios.get('http://localhost:8081/checkauth', {
      headers: {
        'access-token' : localStorage.getItem("token")
      }
    })
    .then(res => console.log(res))
    .catch(err => console.log(err));
  }
  return (
    <div><h1>Home</h1>
      <button onClick={handleAuth} className='btn btn-primary'>CheckAuth</button>
    </div>

  )
}

export default Home