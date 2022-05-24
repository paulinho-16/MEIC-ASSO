import useUsername from "../hooks/username";
import {useEffect, useState} from "react";
import {Form} from "react-bootstrap";

export default function Username() {
  const { username, storeUsername } = useUsername();
  const [usernameInput, setUsernameInput] = useState(username);

  const handleUsernameChange = (event) => {
    setUsernameInput(event.target.value)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      storeUsername(usernameInput)
    }, 2000)

    return () => clearTimeout(delayDebounceFn)
  }, [usernameInput, storeUsername])

  return (
    <div className=''>
      <Form action='' onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="username">Username: </label>
        <input
          type='text'
          value={usernameInput}
          onChange={handleUsernameChange}
        />
      </Form>
    </div>
  )
}

