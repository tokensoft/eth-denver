import Container from './container'

const Footer = () => (
  <footer className='pv4 tc f7'>
    <Container>
      © {(new Date()).getFullYear()} Etheregg
    </Container>
  </footer>
)

export default Footer
