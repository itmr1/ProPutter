import axios from 'axios'

axios.get('https://34.229.137.110:3000',{
  httpsAgent: new https.Agent({
    rejectUnauthorized: false
  })
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.log(error)
  });
