

export default function Web() {
  const registerUser = event => {
    event.preventDefault() 



  }
  return (
    <div>
      <h1>Web</h1>

      <form onSubmit={registerUser}>
        <label htmlFor="name">Name</label>
        <input id="name" type="text" autoComplete="name" required />

        <label htmlFor="name">Email</label>
        <input id="email" type="text" autoComplete="email" required />


        <label htmlFor="name">Password</label>
        <input id="password" type="password" autoComplete="password" required />

        <hr></hr>
        <label htmlFor="name">Access Code</label>
        <input id="access_code" type="text" autoComplete="access_code" required />


        <button type="submit">Register</button>
      </form>
    </div>
  );
}
