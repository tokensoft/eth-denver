import { Segment } from 'semantic-ui-react'

const Modal = ({ children, CloseCmp, onClose }) => (
  <div className='w-100 vh-100 fixed top-0 left-0 z-999 bg-black-80 flex flex-column justify-center align-center pa4'>
    <Segment style={{ marginLeft: 'auto', marginRight: 'auto' }} className='bg-near-white mw6 w-two-thirds-ns h-60 center-ns pa4 relative'>
      <CloseCmp onClick={onClose} />
      <div className='h-100 flex-column flex-auto'>
        { children }
      </div>
    </Segment>
  </div>
)

Modal.defaultProps = {
  onClose: () => null,
  CloseCmp: (props) => (
    <a
      to='/'
      className='link near-black absolute f4 pa2 mr1 top-0 right-0 pointer no-underline underline-hover'
      {...props}
    >&times;</a>
  )
}

export default Modal
