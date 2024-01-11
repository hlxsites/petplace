import { PublicClientApplication } from './msal-browser-2.14.2.js';

const GRAPHQL_ENDPOINT = 'https://graph.microsoft.com/v1.0';

export class SharepointSDK {
  #domain;

  #domainId;

  #siteId;

  #rootPath;

  #connectAttempts;

  constructor(options) {
    this.#domain = options.domain || 'adobe.sharepoint.com';
    this.#domainId = options.domainId || 'fac8f079-f817-4127-be6b-700b19217904'; // HelixProjcts
    this.#siteId = options.siteId;
    this.#rootPath = options.rootPath || '';
    this.#connectAttempts = 0;
  }

  async #checkIsSignedIn() {
    console.assert(this.accessToken, 'You need to sign-in first');
  }

  #setRequestOptions(method = 'GET') {
    this.#checkIsSignedIn();

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${this.accessToken}`);
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    return {
      method,
      headers,
    };
  }

  get baseUri() {
    return `${GRAPHQL_ENDPOINT}/sites/${this.#domain},${this.#domainId},${this.#siteId}/drive/root:${this.#rootPath}`;
  }

  async signIn() {
    const publicClientApplication = new PublicClientApplication({
      auth: {
        clientId: 'f4bd8221-936d-4fd8-949a-8c14864bf16a',
        authority: 'https://login.microsoftonline.com/fa7b1b5a-7b34-4387-94ae-d2c178decee1',
      },
    });

    await publicClientApplication.loginPopup({
      redirectUri: '/tools/sidekick/spauth.htm',
    });

    const account = publicClientApplication.getAllAccounts()[0];

    const accessTokenRequest = {
      scopes: ['files.readwrite', 'sites.readwrite.all'],
      account,
    };

    try {
      const res = await publicClientApplication.acquireTokenSilent(accessTokenRequest);
      this.accessToken = res.accessToken;
    } catch (error) {
      // Acquire token silent failure, and send an interactive request
      if (error.name === 'InteractionRequiredAuthError') {
        try {
          const res = await publicClientApplication.acquireTokenPopup(accessTokenRequest);
          // Acquire token interactive success
          this.accessToken = res.accessToken;
        } catch (err) {
          this.#connectAttempts += 1;
          if (this.#connectAttempts === 1) {
            // Retry to connect once
            this.signIn();
          }
          // Give up
          throw new Error(`Cannot connect to Sharepoint: ${err.message}`);
        }
      }
    }
  }

  async testConnection() {
    this.#checkIsSignedIn();

    const options = this.#setRequestOptions('GET');

    const res = await fetch(this.baseUri, options);
    if (!res.ok) {
      throw new Error('Could not connect to Sharepoint');
    }
    return res.json();
  }

  async listFiles(folderPath) {
    this.#checkIsSignedIn();

    const options = this.#setRequestOptions('GET');

    const res = await fetch(`${this.baseUri}${folderPath}:/children`, options);
    if (!res.ok) {
      throw new Error(`Could not list files: ${folderPath}`);
    }
    return res.json();
  }

  async createFolder(folderPath) {
    this.#checkIsSignedIn();

    const options = this.#setRequestOptions('PATCH');
    options.body = JSON.stringify({ folder: {} });

    const res = await fetch(`${this.baseUri}${folderPath}`, options);
    if (!res.ok) {
      throw new Error(`Could not create folder: ${folderPath}`);
    }
    return res.json();
  }

  async getTableCells(workbookPath, tableName) {
    this.#checkIsSignedIn();

    const options = this.#setRequestOptions('GET');

    const res = await fetch(`${this.baseUri}${workbookPath}:/workbook/tables/${tableName}/range`, options);
    if (!res.ok) {
      throw new Error(`Could not get table cells: ${workbookPath}`);
    }
    return res.json();
  }

  async appendRowsToTable(workbookPath, tableName, rows) {
    this.#checkIsSignedIn();

    const options = this.#setRequestOptions('POST');
    options.body = JSON.stringify({
      values: rows,
    });

    const res = await fetch(`${this.baseUri}${workbookPath}:/workbook/tables/${tableName}/rows/add`, options);
    if (!res.ok) {
      throw new Error(`Could not append rows to table: ${workbookPath}`);
    }
    return res.json();
  }

  async updateRowInTable(workbookPath, tableName, rowIndex, data) {
    this.#checkIsSignedIn();

    const options = this.#setRequestOptions('PATCH');
    options.body = JSON.stringify({
      values: data,
    });

    const res = await fetch(`${this.baseUri}${workbookPath}:/workbook/tables/${tableName}/rows/itemAt(index=${rowIndex})`, options);
    if (!res.ok) {
      throw new Error(`Could not update row in table: ${workbookPath}`);
    }
    return res.json();
  }

  async deleteRowInTable(workbookPath, tableName, rowIndex) {
    this.#checkIsSignedIn();

    const options = this.#setRequestOptions('DELETE');

    const res = await fetch(`${this.baseUri}${workbookPath}:/workbook/tables/${tableName}/rows/itemAt(index=${rowIndex})`, options);
    if (!res.ok) {
      throw new Error(`Could not delete row in table: ${workbookPath}`);
    }
  }
}

// export async function getDocumentContent(documentPath) {
//   validateConnnection();

//   const options = getRequestOption('GET');

//   let res = await fetch(`${getBaseUri()}${documentPath}?select=id,@microsoft.graph.downloadUrl`, options);
//   if (!res.ok) {
//     throw new Error(`Could not get document link: ${documentPath}`);
//   }
//   const json = await res.json();
//   res = await fetch(json['@microsoft.graph.downloadUrl']);
//   if (!res.ok) {
//     throw new Error(`Could not get document content: ${documentPath}`);
//   }
//   const document = await res.text();

// }

// export async function saveFile(file, dest) {
//   validateConnnection();

//   const folder = dest.substring(0, dest.lastIndexOf('/'));
//   const filename = dest.split('/').pop().split('/').pop();

//   await createFolder(folder);

//   // start upload session

//   const payload = {
//     ...sp.api.file.createUploadSession.payload,
//     description: 'Preview file',
//     fileSize: file.size,
//     name: filename,
//   };

//   let options = getRequestOption(sp.api.file.createUploadSession.method);
//   options.body = JSON.stringify(payload);

//   let res = await fetch(`${sp.api.file.createUploadSession.baseURI}${dest}:/createUploadSession`, options);
//   if (res.ok) {
//     const json = await res.json();

//     options = getRequestOption();
//     // TODO API is limited to 60Mb, for more, we need to batch the upload.
//     options.headers.append('Content-Length', file.size);
//     options.headers.append('Content-Range', `bytes 0-${file.size - 1}/${file.size}`);
//     options.method = sp.api.file.upload.method;
//     options.body = file;

//     res = await fetch(`${json.uploadUrl}`, options);
//     if (res.ok) {
//       return res.json();
//     }
//   }
//   throw new Error(`Could not upload file ${dest}`);
// }
