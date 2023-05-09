/**
 * Demonstrates how to use Apple's CloudKit server-to-server authentication
 * 
 * Create private key with: `openssl ecparam -name prime256v1 -genkey -noout -out eckey.pem`
 * Generate the public key to register at the CloudKit dashboard: `openssl ec -in eckey.pem -pubout`
 * 
 * @see https://developer.apple.com/library/prerelease/ios/documentation/DataManagement/Conceptual/CloutKitWebServicesReference/SettingUpWebServices/SettingUpWebServices.html#//apple_ref/doc/uid/TP40015240-CH24-SW6
 * 
 * @author @spllr
 */

const crypto = require("crypto")
const https = require("https")
const fs = require("fs")

const containerID = "iCloud.com.AlleyPereira.ConnectOng"
const keyID = "3506eb237e6fb150bc3f4401aa7b7bbecb0f019bd12680d494460dec65f6ebf4"
const privateKey = fs.readFileSync("./src/cloudkit/eckey.pem")

const lookupPayload = (recordName) => {
  return JSON.stringify({
    "records": {
      "recordName": recordName,
    }
  })
}

var CloudKitRequest = function (payload) {

  this.payload = payload
  this.requestOptions = { // Used with `https.request`
    hostname: "api.apple-cloudkit.com",
    port: 443,
    path: "/database/1/" + containerID + "/development/public/records/lookup", // Update container ID
    method: "POST",
    headers: { // We will add more headers in the sign methods
      "X-Apple-CloudKit-Request-KeyID": keyID
    }
  }
}

CloudKitRequest.prototype.sign = function (privateKey) {
  var dateString = new Date().toISOString().replace(/\.[0-9]+?Z/, "Z"), // NOTE: No milliseconds
    hash = crypto.createHash("sha256"),
    sign = crypto.createSign("RSA-SHA256")

  // Create the hash of the payload
  hash.update(this.payload, "utf8")
  var payloadHash = hash.digest("base64")

  // Create the signature string to sign
  var signatureData = [
    dateString,
    payloadHash,
    this.requestOptions.path
  ].join(":") // [Date]:[Request body]:[Web Service URL]

  // Construct the signature
  sign.update(signatureData)
  var signature = sign.sign(privateKey, "base64")

  // Update the request headers
  this.requestOptions.headers["X-Apple-CloudKit-Request-ISO8601Date"] = dateString
  this.requestOptions.headers["X-Apple-CloudKit-Request-SignatureV1"] = signature

  return signature // This might be useful to keep around
}

CloudKitRequest.prototype.send = function (recordName) {
  return new Promise( (resolve, reject) => {

      var request = https.request(this.requestOptions, function (response) {
        var responseBody = ""

        response.on("data", function (chunk) {
          responseBody += chunk.toString("utf8")
        })

        response.on("end", function () {

          //console.log(responseBody)

          var downloadURL = null

          const responseRecord = JSON.parse(responseBody).records[0]

          if (responseRecord.fields) {
            downloadURL = responseRecord.fields.image.value.downloadURL.split("${f}").join(recordName+".jpg")
          }

          resolve(downloadURL)

        })
      })

      request.on("error", function (err) {
        reject(err)
      })

      request.end(this.payload)

  })
}

module.exports = {

  getURLforRecordNamed(recordName) {
    var creationRequest = new CloudKitRequest(lookupPayload(recordName))
    creationRequest.sign(privateKey)
    // console.log("\n🎉 Fetched Record with error", err, "and response", response)
    return creationRequest.send(recordName)
  }

}