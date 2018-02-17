import Link from 'next/link'
import Layout from '../src/layouts'
import Head from '../src/components/head'

export default () => (
  <Layout>
    <Head />
    <div className='absolute top-0 left-0 w-100 vh-100 flex flex-column justify-center align-center'>
      <div className='center flex flex-column flex-row-ns align-center justify-center-ns'>
        <div className='near-black tr-ns'>
          <h2 className='fw6'>For Investors</h2>
          <Link href='/verify-investor-status'><a className='db link dark-gray no-underline underline-hover f6'>Verify investor status &#8594;</a></Link>
          <Link href='/discover-regulated-tokens'><a className='db link dark-gray no-underline underline-hover f6'>Discover regulated tokens &#8594;</a></Link>
        </div>
        <div className='bl bw1 mh4 h4-ns' />
        <div className='near-black tl-ns'>
          <h2 className='fw6'>For Regulators</h2>
          <Link href='/create-regulator-service'><a className='db link dark-gray no-underline underline-hover f6'>Create a regulator service &#8594;</a></Link>
          <Link href='/deploy-regulated-token'><a className='db link dark-gray no-underline underline-hover f6'>Deploy a regulated token &#8594;</a></Link>
        </div>
      </div>
    </div>
  </Layout>
)
