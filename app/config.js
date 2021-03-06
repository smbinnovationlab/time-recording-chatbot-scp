require('dotenv').config();

module.exports = {
    getConfigs: function () {
        return {
            "GENERAL": {
                "THRESHOLD_SIMILAR": Number(process.env.GENERAL_THRESHOLD_SIMILAR),
                "THRESHOLD_NUM_SIMILAR": Number(process.env.GENERAL_THRESHOLD_NUM_SIMILAR),
                "DATASETS": process.env.GENERAL_DATASETS.toLowerCase(),
            },
            // "LEONARDO": {
            //     "APIKEY": process.env.LEON_APIKEY,
            //     "FACEFEATUREEXTRACTION_APIURL": process.env.LEON_FACEFEATUREEXTRACTION_APIURL,
            //     "SIMILARITYSCORING_APIURL": process.env.LEON_SIMILARITYSCORING_APIURL,
            // },
            "AZURE":{
                "APIKEY": process.env.AZURE_APIKEY,
                "FACE_APIURL": process.env.AZURE_FACE_APIURL
            },
            "BUSINESSONE": {
                "SERVICELAYER_APIURL": process.env.B1_SERVICELAYER_APIURL,
                "USERNAME": process.env.B1_USERNAME,
                "PASSWORD": process.env.B1_PASSWORD,
                "COMPANYDB": process.env.B1_COMPANYDB,
            },
            "BYDESIGN":{
                "TENANT_HOSTNAME": process.env.BYD_TENANT_HOSTNAME,
                "USERNAME": process.env.BYD_USERNAME,
                "PASSWORD": process.env.BYD_PASSWORD,
            },
            "RECASTAI": {
                "APIKEY": process.env.RECASTAI_APIKEY,
                "DIALOG_ENDPOINTS": process.env.RECASTAI_DIALOG_ENDPOINTS,
                "REQUEST_ENDPOINTS": process.env.RECASTAI_REQUEST_ENDPOINTS,
            }
        };
    }
};