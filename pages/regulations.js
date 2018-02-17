import Link from 'next/link'
import { Divider, Button, Card } from 'semantic-ui-react'
import Layout from '../src/layouts'

const mockRegulationServices = [
  {
    name: 'Bureau of Alcohol',
    contract: '0x3bB0a1245C4ee5e5a2006Ea6503E1720891e0A3D',
    admin: '0xaDCf259Cca830eEbB0a2927BC3E6F5f5A143E79E',
    description: 'Deny ownership of alcohol to persons under 21 in the United States.',
  },
  {
    name: 'Colorado DMV',
    contract: '0xy4583bB0a1245C4ee5e5a2006Ea6503E1720891e',
    admin: '0x43E7259Cca830eEbB0a2927BC3E6F5f5A143E79E',
    description: 'Deny ownership of Colorado state drivers licenses to persons under 16.',
  }
]

const Regulations = ({ regulatorServices = mockRegulationServices }) => (
  <Layout>
    <div className='flex flex-row justify-between items-center'>
      <h2>Regulator Services</h2>
      <Link href='/regulations/create' className='link near-black'>Create New</Link>
    </div>
    <Divider />
    <Card.Group>
      {regulatorServices.map((regService, i) => (
        <Card key={i}>
          <Card.Content>
            <Card.Header>{regService.name}</Card.Header>
            <Card.Meta>
              <span className='db'>
                <label>Admin: </label>
                <a href='#' className='link underline-hover'>{regService.admin.slice(0, 10)}...</a>
              </span>
              <span className='db'>
                <label>Contract: </label>
                <a href='#' className='link underline-hover'>{regService.contract.slice(0, 10)}...</a>
              </span>
            </Card.Meta>
            <Card.Description>{regService.description}</Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button className='w-100' basic>Regulated Tokens</Button>
          </Card.Content>
        </Card>
      ))}
    </Card.Group>
  </Layout>
)

export default Regulations
