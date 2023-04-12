import { HostKyberServerRequest, LinkWithPost, LinkWithPostProps } from './LinkWithPost'

export function Page3() {

  const payload: HostKyberServerRequest = {
    autoBalanceTeams: true,
    faction: 0,
    kyberProxy: '207.154.197.74',
    map: 'S5_1/Levels/MP/Geonosis_01/Geonosis_01',
    maxPlayers: 8,
    mode: 'HeroesVersusVillains',
    name: 'Hello There',
    password: ''
  }

  const linkProps: LinkWithPostProps = {
    href: 'https://example.com/',
    title: 'HOST A SERVER',
    endpoint: 'https://kyber.gg/api/config/host',
    payload: payload
  }

  return (<>
    <h1>Page 3</h1>
    <LinkWithPost {...linkProps} />
  </>
  )
}
