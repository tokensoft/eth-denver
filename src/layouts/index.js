import Header from '../components/header'
import Footer from '../components/footer'
import Container from '../components/container'

const Layout = ({ children }) => (
  <div className='flex flex-column flex-auto min-vh-100 sans-serif near-black bg-near-white'>
    <Header />
    <main className='flex-auto'>
      <Container>
        { children }
      </Container>
    </main>
    <Footer />
    <style jsx global>{`
      * {
        font-family: 'Varela Round', sans-serif;
      }
    `}</style>
  </div>
)

export default Layout
