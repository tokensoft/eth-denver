import { Form, Checkbox, Divider, Grid, Button } from 'semantic-ui-react'
import withSemanticUIFormik from '../hocs/withSemanticUIFormik'
import { Component } from 'react'
import Dropzone from 'react-dropzone'

const countries = require('country-list')()

const countryCodes = countries.getCodes()
const countryNamesByCode = countries.getCodeList()
const countryOptions = countryCodes.map(countryCode => ({
  text: countryNamesByCode[countryCode.toLowerCase()],
  value: countryCode
}))

class RegisterInvestorForm extends Component {
  constructor (props) {
    super(props)
    this.state = { files: [] }
  }

  onDrop (files) {
    this.setState({
      files
    })
  }

  render () {
    const {
    values,
    touched,
    errors,
    dirty,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    handleReset,
    regulators
  } = this.props

    return (
      <Form onSubmit={handleSubmit}>
        <h2 className='tc'>Register for Investing</h2>
        <h4 className='mb0'>Personal Details</h4>
        <Divider />
        <Form.Input
          required
          onChange={handleChange}
          label='Full Name'
          name='name'
      />
        <Form.Input
          required
          onChange={handleChange}
          label='Street' name='street'
      />
        <Form.Input
          required
          onChange={handleChange}
          label='State' name='state'
      />
        <Form.Input
          required
          onChange={handleChange}
          label='Zip Code' name='zip'
      />
        <Form.Dropdown selection
          name='country'
          search
          required
          onChange={handleChange}
          label='Country'
          options={countryOptions}
      />
        <Form.Input
          required
          onChange={handleChange}
          label='Phone Number' name='phone'
      />
        {this.state.files.length === 0 &&
          <Dropzone
            onDrop={this.onDrop.bind(this)}
            activeClassName='active-dropzone'
            multiple={false}>
            <div>Upload your photo ID.</div>
          </Dropzone>
          }
        {this.state.files.length > 0
          ? <div>
            <div>{this.state.files.map((file) => <img src={file.preview} />)}</div>
          </div>
          : null
        }
        <div className='mt2'>
          <Button >Register</Button>
        </div>
      </Form>
    )
  }
}

export default withSemanticUIFormik({
  handleSubmit: (values, {props}) => {
    props.registerInvestor(values)
  },
  mapPropsToValues: (props) => {
    return {
    }
  }
})(RegisterInvestorForm)
