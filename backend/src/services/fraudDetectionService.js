// here will be the code for fraud detection model and scores will be calculated and saved in the mongo db database

// THIS WILL BE MADE ALONG WITH THE IMPLEMENTATION OF OOPs.

async function fraudDetection(req,res){
    const resp=axios.post(fraudDetectionUrl,req.body)
    return resp

    // here not only resp will be returned but two mre major things are to be done:
    // 1. Database storage for the response.
    // 2. Alert if isFraud is returned True.
}