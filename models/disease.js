const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const diseaseSchema = new Schema({
    reportingAuthority: {
        surname: { type: String, required: true },
        otherNames: { type: String, required: true }
    },
    notifier: {
        type: { type: String, required: true },
        reportingSource: { type: String, required: true },
        organization: { type: String, required: true },
        dateReported: { type: Date, required: true },
        usualGP: { type: String, required: true },
        gpPractice: { type: String, required: true },
        gpPracticeAddress: {
            no: { type: String, required: true },
            street: { type: String, required: true },
            lga: { type: String, required: true },
            townCity: { type: String, required: true },
            postCode: { type: String, required: true },
            geoCode: { type: String, required: true }
        }
    },
    caseIdentification: {
        surname: { type: String, required: true },
        otherNames: { type: String, required: true },
        email: { type: String, required: true },
        currentAddress: {
            no: { type: String, required: true },
            street: { type: String, required: true },
            suburb: { type: String, required: true },
            townCity: { type: String, required: true },
            postCode: { type: String, required: true },
            geoCode: { type: String, required: true }
        },
        phone: {
            home: { type: String, required: true },
            work: { type: String, required: true }
        }
    },
    caseDemography: {
        dateOfBirth: { type: Date, required: true },
        sex: { type: String, required: true },
        occupation: { type: String, required: true },
        workspace: { type: String, required: true },
        currentAddress: {
            no: { type: String, required: true },
            street: { type: String, required: true },
            suburb: { type: String, required: true },
            townCity: { type: String, required: true },
            postCode: { type: String, required: true },
            geoCode: { type: String, required: true }
        },
        phone: {
            home: { type: String, required: true },
            work: { type: String, required: true }
        }
    },
    ethnic: {
        type: { type: String, required: true }
    }
}, { timestamps: true }, {collection: 'disease'});

const model = mongoose.model('Disease', diseaseSchema);
module.exports = model;