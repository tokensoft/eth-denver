import { Form, Checkbox, Divider, Grid, Button } from 'semantic-ui-react'
import withSemanticUIFormik from '../hocs/withSemanticUIFormik'
import states from '../../../static/us-states'

const countries = require('country-list')()

const countryCodes = countries.getCodes()
const countryNamesByCode = countries.getCodeList()
const countryOptions = [{ text: 'All', value: 'All' }].concat(countryCodes.map(countryCode => ({
  text: countryNamesByCode[countryCode.toLowerCase()],
  value: countryCode
})))

const stateOptions = [{ text: 'All', value: 'All' }].concat(Object.keys(states).map(stateCode => ({
  text: states[stateCode],
  value: stateCode
})))

const RegulatorServiceForm = props => {
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
    createRegistration
  } = props

  return (
    <Form onSubmit={handleSubmit} >
      <h2 className='tc'>Create Regulator Service</h2>
      <h4 className='mb0'>Information</h4>
      <Divider />
      <Form.Input
        required
        onChange={handleChange}
        label='Name' name='name' placeholder='The name of your regulation'
      />
      <Form.TextArea
        onChange={handleChange}
        label='Description' name='description' placeholder='A brief explanation of your regulation'
      />

      <h4 className='mb0'>Investor Restrictions</h4>
      <Divider />
      <Grid>
        <Grid.Column computer={8}>
          <Form.Input
            required
            onChange={handleChange}
            label='Min Investor Age' name='minAge' min={16} type='number' value={values.minAge}
          />
        </Grid.Column>
        <Grid.Column computer={8}>
          <Form.Input
            onChange={handleChange}
            label='Max Investor Age' name='maxAge' type='number' placeholder={'N/A'}
          />
        </Grid.Column>
        <Grid.Column computer={8} className='mb3'>
          <Form.Input
            required
            onChange={handleChange}
            label='Min Num Investors' name='minInvestors' type='number' min={1} value={values.minInvestors}
          />
        </Grid.Column>
        <Grid.Column computer={8} className='mb3'>
          <Form.Input
            onChange={handleChange}
            label='Max Num Investors' name='maxInvestors' type='number' min={1} placeholder={'Unlimited'}
          />
        </Grid.Column>
      </Grid>
      <Form.Dropdown
        name='countries'
        onChange={handleChange}
        search
        selection
        required
        multiple
        allowAdditions
        label={'Countries'}
        additionLabel='Add'
        options={countryOptions}
        value={values.countries}
        // onAddItem
      />
      { values.countries && values.countries.length && values.countries[0] === 'US' && <Form.Dropdown
        name='states'
        onChange={handleChange}
        search
        selection
        required
        multiple
        allowAdditions
        label={'States'}
        value={values.states}
        additionLabel='Add'
        options={stateOptions}
          // onAddItem
        />
      }
      <Checkbox
        className='mb3'
        onChange={handleChange}
        label='Passes AML / KYC checks' name='isAmlKyc' checked={values.isAmlKyc}
      />
      <Checkbox
        className='mb3'
        onChange={handleChange}
        label='Verified as an accredited investor' name='isAccreditedInvestor' checked={values.isAccreditedInvestor}
      />

      <div className='mt2'>
        <Button>Create</Button>
      </div>
    </Form>
  )
}

export default withSemanticUIFormik({
  handleSubmit: (values, {props}) => {
    props.createRegistration(values)
  },
  mapPropsToValues: (props) => {
    return {
      minAge: 16,
      minInvestors: 1,
      countries: ['US'],
      states: ['All'],
      isAmlKyc: true,
      isAccreditedInvestor: true
    }
  }
})(RegulatorServiceForm)
