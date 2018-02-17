import { Form, Checkbox, Divider, Grid, Button } from 'semantic-ui-react'
import withSemanticUIFormik from '../hocs/withSemanticUIFormik'
import states from '../../../static/us-states'

const countries = require('country-list')()

const __COUNTRY__ = 'US'
const countryCodes = countries.getCodes()
const countryNamesByCode = countries.getCodeList()
const countryOptions = [{ text: 'All', value: '' }].concat(countryCodes.map(countryCode => ({
  text: countryNamesByCode[countryCode.toLowerCase()],
  value: countryCode
})))

const stateOptions = [{ text: 'All', value: '' }].concat(Object.keys(states).map(stateCode => ({
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
        <Grid.Column computer={8}>
          <Form.Input
            required
            onChange={handleChange}
            label="Min Age" name="minAge" defaultValue={16} min={16} type="number"
          />
        </Grid.Column>
        <Grid.Column computer={8}>
          <Form.Input
            onChange={handleChange}
            label="Max Age" name="maxAge" type="number" placeholder={'N/A'}
          />
        </Grid.Column>
        <Grid.Column computer={8} className='mb3'>
          <Form.Input
            required
            onChange={handleChange}
            label="Min Investors" name="minInvestors" type="number" min={1} defaultValue={1}
          />
        </Grid.Column>
        <Grid.Column computer={8} className='mb3'>
          <Form.Input
            onChange={handleChange}
            label="Max Investors" name="maxInvestors" type="number" min={1} placeholder={'Unlimited'}
          />
        </Grid.Column>
      </Grid>
      <Form.Dropdown
        name='countries'
        search
        selection
        required
        multiple
        allowAdditions
        label={'Countries'}
        defaultValue={['US']}
        additionLabel='Add'
        options={countryOptions}
        // onAddItem
      />
      { __COUNTRY__ === 'US' && <Form.Dropdown
          name='states'
          search
          selection
          required
          multiple
          allowAdditions
          label={'States'}
          defaultValue={['']}
          additionLabel='Add'
          options={stateOptions}
          // onAddItem
        />
      }
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
