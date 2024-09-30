# Orbital Widget

Orbital Widget simplifies embedding external pages within an iframe for seamless integration, removing the need for redirects. With a few lines of code, you can integrate the widget into your site and provide a smoother user experience.

## Features

- Embed Orbital's payment pages in an iframe with minimal setup.
- No redirects needed; content is embedded directly on your site.

## Installation

To install via npm:

```bash
npm install @payperform/widget
```

or yarn

```bash
yarn add @payperform/widget
```

Via cdn:

You can also include Orbital Widget using the CDN for faster integration:


Use the latest version:
To always load the most up-to-date version of the widget:

```html
<script src="https://widgets.getorbital.io/index-latest.js"></script>
```

Specify a specific version:
If you want to lock in a particular version of the widget:

```html
<script src="https://widgets.getorbital.io/index-{version}.js"></script>
```


## Example (React)

Here’s a simplified example of how you can integrate the Orbital Widget in a React application. This version focuses on embedding the widget, and the signature should be fetched from your own backend server.

```tsx
import React, { useEffect, useState, useRef } from 'react'
import { init } from '@payperform/widget'

const OrbitalWidget: React.FC = () => {
  const [signature, setSignature] = useState<string | null>(null)
  const orbitalRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Fetch signature from your backend server and set it here
    // Example: setSignature(response.signature);
    // Developer should replace this with their own server call to fetch signature
    setSignature('your-signature-from-backend')
  }, [])

  useEffect(() => {
    if (signature && orbitalRef.current) {
      orbitalRef.current.setAttribute('signature', signature)

      init({
        container: 'orbital',
      })
    }
  }, [signature])

  return <div id="orbital" ref={orbitalRef}></div>
}

export default OrbitalWidget
```

**Note**: In this example, the fetching of the signature is not included. You should replace **setSignature('your-signature-from-backend')** with a call to your own server to retrieve the signature.

If you would like to see a full implementation including fetching the signature from a backend, please refer to the **examples/react** folder in this repository.

Usage
Once integrated, the widget will automatically embed Orbital's payment page within the provided container on your site.

## Example (Vanilla JavaScript)

Here’s a simple example of how to integrate the Orbital Widget using vanilla JavaScript. In this example, the signature is fetched from your own backend server. The actual server call has been simplified for clarity.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Orbital Widget Example</title>
  </head>
  <body>
    <div id="orbital"></div>
    <script src="https://widgets.getorbital.io/index-latest.js"></script>
    <script>
      window.addEventListener('load', async () => {
        // Simulate fetching the signature from your backend
        const signature = 'your-signature-from-backend' // Replace with your own logic to get the signature

        const orbitalElement = document.getElementById('orbital')
        if (orbitalElement && signature) {
          orbitalElement.setAttribute('signature', signature)
        }

        if (typeof OrbitalWidget !== 'undefined' && typeof OrbitalWidget.init === 'function') {
          OrbitalWidget.init({
            container: 'orbital',
          })
        } else {
          console.error('OrbitalWidget was not loaded properly.')
        }
      })
    </script>
  </body>
</html>
```

### Backend Implementation

To fetch the signature required for the Orbital Widget, you can set up a simple Express server. Below is an example of how to create an endpoint that interacts with the Orbital API to retrieve the invoice widget signature.

Example (Node.js with Express)
First, ensure you have the necessary packages installed:

```bash
npm install express axios cors dotenv
```

Then, create a file (e.g., server.js) and add the following code:

```javascript
require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')

const app = express()
// Enable CORS for all origins
app.use(cors())
app.use(express.json())

app.post('/generate-signature', async (req, res) => {
  try {
    const response = await axios.post(
      process.env.API_URL || 'https://hpp.getorbital.io/invoice/widgets', // Use API URL from .env
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY, // Use API key from .env
        },
      }
    )

    res.status(200).json(response.data)
  } catch (error) {
    res.status(500).json({
      message: 'Error sending request',
      error: error.response ? error.response.data : error.message,
    })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
```

Usage
Environment Variables: Make sure to create a .env file in your project root and add your API URL and API key:

```javascript
API_URL=https://hpp.getorbital.io/invoice/widgets
API_KEY=your_api_key_here
```

Run the Server: Start the server by running:

```bash
node server.js
```

**Fetch Signature**: You can now send a POST request to **/generate-signature** from your frontend application to retrieve the signature needed for the Orbital Widget.

**Note**: This server implementation is not part of the Orbital Widget library, but it provides a necessary backend for users to fetch the required signature.
