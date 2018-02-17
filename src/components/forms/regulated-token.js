import { Form, Checkbox, Divider, Grid, Button } from 'semantic-ui-react'
import withSemanticUIFormik from '../hocs/withSemanticUIFormik'

function buildRegultorList (regulators) {
  let list = []
  for (let i = 0; i < regulators.length; i++) {
    list.push({
      text: regulators[i].name,
      value: regulators[i].address
    })
  }

  return list
}

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
      <h2 className='tc'>Create Regulated Token</h2>
      <h4 className='mb0'>Details</h4>
      <Divider />
      <Form.Input
        required
        onChange={handleChange}
        label='Name'
        name='name'
      />
      <Form.Input
        required
        onChange={handleChange}
        label='Symbol' name='symbol'
      />
      <Form.Input
        required
        onChange={handleChange}
        type='number'
        label='Decimals' name='decimals'
        value={values.decimals}
      />
      <Form.Input
        required
        onChange={handleChange}
        type='number'
        label='Total Supply' name='totalSupply'
        value={values.totalSupply}
      />
      <h4 className='mb0'>Regulation</h4>
      <Divider />
      <Form.Dropdown selection
        name='regulatorService'
        search
        required
        onChange={handleChange}
        label='Regulator Service'
        options={buildRegultorList(regulators)}
        value={values.regulatorService}
      />
      <div className='mt2'>
        <Button >Create Token</Button>
      </div>
    </Form>
  )
}

export default withSemanticUIFormik({
  handleSubmit: (values, {props}) => {
    props.createToken(values)
  },
  mapPropsToValues: (props) => {
    let regList = buildRegultorList(props.regulators)
    console.log('regList', regList)
    return {
      decimals: 18,
      totalSupply: 1000000,
      regulatorService: regList.length && regList[0].value
    }
  }
})(RegulatedTokenForm)
