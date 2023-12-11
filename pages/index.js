import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useSession, signIn, signOut } from 'next-auth/react';
// import { TwitterApi } from 'twitter-api-v2';
import { useEnsAddress } from 'wagmi';
import { useEnsAvatar, useEnsName } from 'wagmi';

 
export default function Home() {
  const { data: session } = useSession();
  const [issuerName, setIssuerName] = useState();
  const [issuerProfile, setIssuerProfile] = useState();

    const [account, setAccount] = useState(null);
    const [dids, setDids] = useState('');
  const [claimQR, setClaimQR] = useState('');
  const [didInfos, setDidInfos] = useState(null);
  const name = 'nith567.eth';
  const ensName = useEnsAddress({ name, chainId: 11155111 });

  async function handleGenerateProfileSubmit(e) {
    e.preventDefault();
    const { data } = await axios.post('api/create-did/', { issuerName });
    console.log(data);
    setIssuerProfile(data);
  }
  const address = '0xa2a9055a014857d6c1e8f1bdd8682b6459c5fa85';
  const ensNames = useEnsName({ address, chainId: 11155111 });
  const ensAvatars = useEnsAvatar({ name: ensName.data, chainId: 11155111 });

    const connectToMetaMask = async () => {
      try {
        const [userAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(userAccount);
      } catch (error) {
        console.error('Error connecting to MetaMask:', error.message);
      }
    };
 // https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json-ld/kyc-v3.json-ld
 const sampleSchema = {
  // url: 'https://raw.githubusercontent.com/iden3/claim-schema-vocab/main/schemas/json/KYCAgeCredential-v2.json',main schema
  url: 'https://schema.dock.io/ENS-V1-1702277612452.json',
  name: 'ENS',
  populateFunc() {
      return {
        ens: ensNames.data,
        twitter: session.user.name
      };
    }
};

    const [credentialData, setCredentialData] = useState(
      {
        schema: sampleSchema.url,
        subject: {}
      });
  const handleGetDID = async () => {
    try {
      const response = await axios.get(`https://api-testnet.dock.io/dids/${dids}`, {
        headers: {
          'DOCK-API-TOKEN': 'eyJzY29wZXMiOlsidGVzdCIsImFsbCJdLCJzdWIiOiIxMTM0OSIsInNlbGVjdGVkVGVhbUlkIjoiMTUzNDYiLCJjcmVhdG9ySWQiOiIxMTM0OSIsImlhdCI6MTcwMTc4NTU2OSwiZXhwIjo0NzgxMDgxNTY5fQ.Sc8r7AU6V0li9KZnsbDtfrxHAsrV6cz4A1rfl3D_TeAooxL9YnoV4kmy0kuMA1989zl8h2nUhX5y6Vl7-Cq9-g'
        }
      });
      setDidInfos(response.data);
    } catch (error) {
      console.error('Error:bitch is  ', error.message);
    }
  };

  async function handleCreateCredentialRequest(e) {
    e.preventDefault();

    const credential = {
      schema: sampleSchema.url,
      issuer: issuerProfile.did,
      name: sampleSchema.name,
      type: ['VerifiableCredential', sampleSchema.name],
      subject: sampleSchema.populateFunc(credentialData)
    };

    const { data } = await axios.post('api/create-credential/', credential);
    console.log('created');
    console.log(data);
    setClaimQR(data.qrUrl);
  }


  if (!issuerProfile) {
    return (
      <>
      <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        margin: '23px'
      }}
      className='m-2'
    >
      <img
        src={ensAvatars.data || 'alt'}
        style={{ width: '2rem', height: '2rem', objectFit: 'cover' }}
      />
      <div className='text-center font-semibold text-3xl mt-12'>
      ENS PROFILE:
      <span>
        {ensName.isError
          ? 'Error loading name'
          : ensNames.isLoading
          ? 'Loading...'
          : ensNames.data || 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.FKRDzeTLhDAPOrLaJ9OesAHaHa%26pid%3DApi&f=1&ipt=44c4121667e2a0eb70f227fc5945f27154e60b3acc3348d04dfbbc4085882676&ipo=images'}
      </span>
      </div>
    </div>
      <p>
       {!session && <>
            Not signed in <br/>
            <button className='text-center bg-zinc-600 p-2 m-3' onClick={() => signIn()}>Sign in Twitter</button>
          </>}
          {session && <>
            Signed in as {session.user.name} <br/>
            <button className='p-2 text-center bg-red-200 mt-2'onClick={() => signOut()}>Sign out</button>

            {/* <div>Address: {ensName.data}</div> */}
          </>}

          </p>

          <div className='m-3'>
      <h1>MetaMask Connect</h1>
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <button className='p-2 text-center bg-red-200 mt-1' onClick={() => connectToMetaMask()}>Connect to MetaMask</button>
      )}
    </div>
        <div className="flex font-bold lg:h-screen mt-20 m-5">
         Twitter+ ENS+ POLYGON VC
          <div
            className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8"
            style={{ width: '100%' }}>
            <div className="w-full px-8 md:px-32 lg:px-24">
              <form
                onSubmit={handleGenerateProfileSubmit}
                className="p-5"
                style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h1 className="text-gray-800 font-bold text-2xl mb-6">Get DID</h1>
                <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                  <input
                    id="name"
                    className=" pl-2 w-full outline-none border-none"
                    name="name"
                    placeholder="Issuer Name"
                    value={issuerName}
                    required={ensName.data}
                    onChange={(event) =>
                      setIssuerName(event.target.value)}
                  />
                </div>

                <button
                  disabled={!issuerName}
                  type="submit"
                  className="block w-full bg-blue-600 mt-5 py-2 rounded-full hover:bg-blue-700 hover:-translate-y-1 transition-all duration-250 text-white font-semibold mb-2">
                  Create
                </button>

              </form>
            </div>
          </div>
          <div className="w-full px-8 md:px-32 lg:px-24">
      <input
        type="text"
        placeholder="Enter DID"
        value={dids}
        onChange={(e) => setDids(e.target.value)}
      />
      <button onClick={handleGetDID}>Get Your Did Info</button>
      {didInfos && (
        <div>
          <h2>DID Information</h2>
          <pre>{JSON.stringify(didInfos, null, 2)}</pre>
        </div>
      )}
   </div>
        </div>
      </>
    );
  }

  if (!claimQR) {
    return (
      <>
        <div className="flex flex-col-reverse lg:flex-row lg:h-screen">
          <div
            className="lg:flex w-full lg:w-1/2 justify-around items-center text-center bg-zinc-200"
            style={{
              flexShrink: 0,
              background: 'url(/bg.jpg)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}>
            <div
              className="w-full mx-auto px-0 py-10 flex-col items-center space-y-6"
              style={{
                maxWidth: '400px',
                width: '100%',
              }}>
              <h1 className="text-white font-bold text-4xl">
               ENS+TWITTER VC
              </h1>
              <br />
              <br />
            </div>
          </div>
          <div
            className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8"
            style={{ width: '100%' }}>
            <div className="w-full px-8 md:px-32 lg:px-24">
              <form
                onSubmit={handleCreateCredentialRequest}
                className="p-5"
                style={{ maxWidth: '500px', margin: '0 auto' }}>
                <h1 className="text-gray-300 font-bold text-2xl mb-6">Confirm your vc</h1>
                <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
     
                </div>

                <button
                  type="submit"
                  // disabled={!credentialData.subject.dob}
                  className="block w-full bg-blue-600 mt-5 py-2 rounded-full hover:bg-blue-700 hover:-translate-y-1 transition-all duration-250 text-white font-semibold mb-2">
                  Confirm VC
                </button>

              </form>
            </div>
          </div>
        </div>
      </>
    );
  }

    return (
      <>
        <div className="flex flex-col-reverse lg:flex-row lg:h-screen">
          <div
            className="lg:flex w-full lg:w-1/2 justify-around items-center text-center bg-zinc-900"
            style={{
              flexShrink: 0,
              background: 'url(/bg.jpg)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}>
            <div
              className="w-full mx-auto px-0 py-10 flex-col items-center space-y-6"
              style={{
                maxWidth: '400px',
                width: '100%',
              }}>
              <h1 className="text-white font-bold text-4xl">
                Share the claim request link
              </h1>

              <p className="text-white mt-1">
                Share this link with the recipient. They will be presented with a QR code they can scan to begin the import
                flow in their Polygon ID wallet.
              </p>
              <br />
              <br />
            </div>
          </div>
          <div
            className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8"
            style={{ width: '100%' }}>
            <div className="w-full px-8 md:px-32 lg:px-24">
              <p className="font-bold text-4xl">
                Claim URL
              </p>

              <p>
                <br />
                <a href={claimQR} target='_blank' rel="noopener noreferrer">{claimQR}</a>
              </p>
              <br />
              <br />
            </div>
          </div>
        </div>
      </>

    );
}
