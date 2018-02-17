import Link from 'next/link'
import { Divider, Button, Card } from 'semantic-ui-react'
import Layout from '../src/layouts'

const mockTokens = [
  {
    name: 'Denver Coin',
    symbol: 'DENV',
    decimals: 18,
    contract: '0x06Ea653bB0a1245C4ee5e5a2006Ea6503E172089'
  },
  {
    name: 'Real-Estate Investment Trust Token',
    symbol: 'REITT',
    decimals: 18,
    contract: '0xa1245C3bB0a1245C4ee5e5a2006Ea6503E172089'
  }
]

const Tokens = ({ rTokens = mockTokens }) => (
  <Layout>
    <div className='flex flex-row justify-between items-center'>
      <h2>Regulated Tokens</h2>
      <Link href='/tokens/create' className='link near-black'>Create New</Link>
    </div>
    <Divider />
    <Card.Group>
      {rTokens.map((token, i) => (
        <Card key={i}>
          <Card.Content>
            <Card.Header>{token.symbol}</Card.Header>
            <Card.Meta>
              <span className='db'>
                <label>Contract: </label>
                <a href='#' className='link underline-hover'>{token.contract.slice(0, 10)}...</a>
              </span>
            </Card.Meta>
            <Card.Description>{token.name}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button className='w-100' basic>Regulator Service</Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  </Layout>
)

export default Tokens
