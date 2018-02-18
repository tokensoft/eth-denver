import { Form, Divider, Grid, Button } from 'semantic-ui-react'
import compose from 'lodash.compose'
import withInjectedWeb3 from '../hocs/withInjectedWeb3'
import withSemanticUIFormik from '../hocs/withSemanticUIFormik'
import BigNumber from 'bignumber.js'

const SendTokensForm = props => {
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
    token
  } = props

  return (
    <Form onSubmit={handleSubmit}>
      <h2 className='tc'>Send {token.symbol}</h2>
      <Form.Input
        onChange={handleChange}
        label='To' name='to' placeholder='Receiving address'
      />
      <Form.Input
        onChange={handleChange}
        type='number'
        label='Amount' name='amount' placeholder='Number of tokens to send'
      />
      <Button>
        Send Tokens
      </Button>
    </Form>
  )
}

export default compose(
  withInjectedWeb3,
  withSemanticUIFormik({
    handleSubmit: (values, {props}) => {
      console.log(props.token, typeof values.amount)
      const submitValues = {
        to: values.to,
        from: props.account,
        injectedWeb3: props.web3,
        token: props.token,
        amount: new BigNumber(Number(values.amount))
          .times(new BigNumber(10).pow(Number(props.token.decimals)))
          .toString()
      }
      props.transferToken(submitValues)
    }
  }),
)(SendTokensForm)
