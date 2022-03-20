import { Web3Storage } from 'web3.storage';
import { getFilesFromPath } from 'web3.storage';
import core  from "@actions/core";
import { existsSync } from 'fs';

function getEnv() {
  const path = core.getInput("path");
  const service = core.getInput("service");
  return { path,  token}
}

function die(message) {
  console.error(message)
  process.exit(1)
}

function upload(){
  const {path, token} = getEnv();

  if (!token) {
    die('this script needs an env variable named token containing API token for web3.storage')
  }

  if (!existsSync(path)) {
    die(`${path} folder not found`);
  }
  
  const web3Storage = new Web3Storage({ token })
  console.log('Loading site files...')
  const files = await getFilesFromPath(path)
  console.log(`Uploading ${files.length} files to Web3.Storage...`)
  const cid = await web3Storage.put(files, { wrapWithDirectory: false })
  console.log('Deployed to Web3.Storage!')
  console.log('Root cid: ', cid)
  console.log(`Gateway url: https://${cid}.ipfs.dweb.link`);
  core.setOutput("cid", cid);

}
