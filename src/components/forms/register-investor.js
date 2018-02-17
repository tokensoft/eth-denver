import { Form, Checkbox, Divider, Grid, Button } from 'semantic-ui-react'
import withSemanticUIFormik from '../hocs/withSemanticUIFormik'

const countries = require('country-list')()

const countryCodes = countries.getCodes()
const countryNamesByCode = countries.getCodeList()
const countryOptions = countryCodes.map(countryCode => ({
  text: countryNamesByCode[countryCode.toLowerCase()],
  value: countryCode
}))

const RegulatedTokenForm = props => {
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
  } = props

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
      <div className='mt2'>
        <Button >Register</Button>
      </div>
    </Form>
  )
}

export default withSemanticUIFormik({
  handleSubmit: (values, {props}) => {
    props.registerInvestor(values)
  },
  mapPropsToValues: (props) => {
    return {
    }
  }
})(RegulatedTokenForm)
