import { Form, Checkbox, Divider, Grid, Button } from 'semantic-ui-react'
import withSemanticUIFormik from '../hocs/withSemanticUIFormik'
const countries = require('country-list')()

const countryCodes = countries.getCodes()
const countryNamesByCode = countries.getCodeList()
const countryOptions = countryCodes.map(countryCode => ({
  text: countryNamesByCode[countryCode.toLowerCase()],
  value: countryCode
}))

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
    handleReset
  } = props

  return (
    <Form>
      <h2 className='tc'>Create Regulator Service</h2>
      <h4 className='mb0'>Information</h4>
      <Divider />
      <Form.Input
        required
        onChange={handleChange}
        label="Name" name="name" placeholder="The name of your regulation"
      />
      <Form.TextArea
        onChange={handleChange}
        label="Description" name="description" placeholder="A brief explanation of your regulation"
      />

      <h4 className='mb0'>Restrictions</h4>
      <Divider />
      <Grid>
        <Grid.Column computer={8} className='mb3'>
          <Form.Input
            onChange={handleChange}
            label="Age" name="age" defaultValue={18} min={18} type="number"
          />
        </Grid.Column>
        <Grid.Column computer={8}>
          <Form.Input
            onChange={handleChange}
            label="Max Investors" name="maxInvestors" type="number" min={1} placeholder={'Unlimited'}
          />
        </Grid.Column>
      </Grid>
      <Form.Dropdown
        search
        selection
        multiple
        allowAdditions
        label={'Countries (allowed)'}
        defaultValue={['US']}
        additionLabel='Include'
        options={countryOptions}
        // onAddItem
      />
      <Checkbox
        className='mb3'
        onChange={handleChange}
        label="Passes AML / KYC checks" name="isAmlKyc" defaultChecked={true}
      />
      <Checkbox
        className='mb3'
        onChange={handleChange}
        label="Verified as an accredited investor" name="isAccreditedInvestor" defaultChecked={true}
      />

      <div className='mt2'>
        <Button>Deploy</Button>
      </div>
    </Form>
  )
}

export default withSemanticUIFormik({

})(RegulatorServiceForm)
