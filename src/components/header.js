import Container from './container'

const Header = () => (
  <header className='pv4 z-999'>
    <Container className='flex flex-row items-center justify-between'>
      <a href='#' className='link near-black f3 fw6 flex flex-row items-center' to='/'>
        <span>Etheregg</span>
        <img
          className='dib h2 pl2'
          src='/static/logo.svg'
        />
      </a>
      <div className='tr'>
        <div>12.45 ETH</div>
        <div className='f7'>
          <a href='#' className='link dark-gray no-underline underline-hover'>0xaDCf25n9...</a>
        </div>
      </div>
    </Container>
  </header>
)

export default Header
