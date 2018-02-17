import { Form, Checkbox, Divider, Grid, Button } from 'semantic-ui-react'
import withSemanticUIFormik from '../hocs/withSemanticUIFormik'

const mockRegulatorServiceOptions = [
  {
    text: 'Bureau of Alcohol',
    value: '0x12334645745745635473574674747'
  },
  {
    text: 'Colorado DMV',
    value: '0x123346457457456354ff574674747'
  }
]

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
    handleReset
  } = props

  return (
    <Form>
      <h2 className='tc'>Create Regulated Token</h2>
      <h4 className='mb0'>Details</h4>
      <Divider />
      <Form.Input
        required
        onChange={handleChange}
        label="Name" name="name"
      />
      <Form.Input
        required
        onChange={handleChange}
        label="Symbol" name="symbol"
      />
      <Form.Input
        required
        onChange={handleChange}
        type="numer"
        label="Decimals" name="decimals" defaultValue={18}
      />
      <Form.Input
        required
        onChange={handleChange}
        type="numer"
        label="Total Supply" name="totalSupply"
      />
      <h4 className='mb0'>Regulation</h4>
      <Divider />
      <Form.Dropdown selection
        name="regulatorService"
        search
        required
        onChange={handleChange}
        label="Regulator Service"
        options={mockRegulatorServiceOptions}
      />
      <div className='mt2'>
        <Button>Deploy Registry*</Button>
        <Button disabled>Create Token</Button>
      </div>
      <p className='f7'>* This is a required intermediary contract deployment.</p>
    </Form>
  )

}

export default withSemanticUIFormik({

})(RegulatedTokenForm)
