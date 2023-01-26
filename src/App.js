import './App.css';
import { useCallback, useEffect, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link'

function App() {

  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  const createLinkToken = useCallback(async () => {
    const response = await fetch('/api/create_link_token', { method: 'POST', redirect: 'follow' })
    const data = await response.json()
    console.log(`token ${data.link_token}`)
    setToken(data.link_token)
  }, [setToken])

  const getBalance = useCallback(async () => {
    setLoading(true)
    const response = await fetch('/api/balance')
    const data = await response.json()
    setData(data)
    setLoading(false)
  }, [setData, setLoading])

  const onSuccess = useCallback(async publicToken => {
    setLoading(true)

    await fetch("/api/exchange_public_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ public_token: publicToken })
    })
    console.log('onSuccess called')
    await getBalance()
  }, [getBalance])

  const config = {
    onSuccess,
    token
  }

  const { open, ready } = usePlaidLink(config)

  useEffect(() => {
    if (!token) {
      createLinkToken()
    }

    if (ready) {
      open()
    }
  }, [token, ready, open, createLinkToken])

  return (
    <div>
      <button onClick={() => open()} disabled={!ready}><strong>Link Account</strong></button>

      {!loading && data &&
        Object.entries(data).map((entry, i) => (
          <pre key={i}>
            <code>{JSON.stringify(entry[1], null, 2)}</code>
          </pre>
        )
        )} 

    </div>
  );
}

export default App;
