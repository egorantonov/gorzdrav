import { useCallback } from 'react'

export interface MessageResponse {
  message: string
}

export interface HostKyberServerRequest {
  autoBalanceTeams: boolean,
  faction: 0 | 1,
  kyberProxy: string, 
  map: string,
  maxPlayers: number,
  mode: string,
  name: string,
  password: string
}

export interface LinkWithPostProps {
  href: string,
  title: string,
  endpoint: string, 
  payload: any
}

export function LinkWithPost({href, title, endpoint, payload}: LinkWithPostProps) {

  const sendPayload = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault()

    await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        ['Content-Type']: 'application/json'
      }
    })
      .then(
        (response) => response.json(),
        (error) =>  console.error(error)
      )
      .then(
        (data: MessageResponse) => console.log(data.message),
        (error) => console.error(error)
      )

    document.location.href = href
  }, [payload])

  return (
    <a href={href} title={title} onClick={sendPayload}>{title}</a>
  )
}