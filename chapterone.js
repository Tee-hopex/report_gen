const PDFDocument = require('pdfkit');
const fs = require('fs');

// Create a document
const doc = new PDFDocument();

// Pipe the document to a blob
doc.pipe(fs.createWriteStream('Disease_Case_Report.pdf'));

// Register Roboto fonts
doc.registerFont('Roboto', 'fonts/Roboto-Regular.ttf');
doc.registerFont('Roboto-Bold', 'fonts/Roboto-Bold.ttf');

// Sample data (Replace with actual data from the form)
const data = {
    reportingAuthority: {
        surname: 'Smith',
        otherNames: 'John Doe'
    },
    notifier: {
        type: 'Hospital-based Practitioner',
        reportingSource: 'Local Clinic',
        organization: 'Health Department',
        dateReported: '2024-08-06',
        usualGP: 'Dr. Jane Doe',
        gpPractice: 'Health Clinic',
        gpPracticeAddress: {
            no: '123',
            street: 'Main St',
            lga: 'LGA Area',
            townCity: 'Townsville',
            postCode: '12345',
            geoCode: 'XYZ123'
        }
    },
    caseIdentification: {
        surname: 'Johnson',
        otherNames: 'Alice',
        email: 'alice.johnson@example.com',
        currentAddress: {
            no: '456',
            street: 'Second St',
            suburb: 'Suburbia',
            townCity: 'Cityville',
            postCode: '67890',
            geoCode: 'ABC456'
        },
        phone: {
            home: '123-456-7890',
            work: '098-765-4321'
        }
    },
    caseDemography: {
        dateOfBirth: '1985-05-15',
        sex: 'Female',
        occupation: 'Teacher',
        workspace: 'School',
        currentAddress: {
            no: '789',
            street: 'Third St',
            suburb: 'Metropolis',
            townCity: 'Big City',
            postCode: '13579',
            geoCode: 'DEF789'
        },
        phone: {
            home: '234-567-8901',
            work: '345-678-9012'
        }
    },
    ethnic: {
        type: 'Igbo'
    }
};

// Set the font and styles
doc.font('Roboto-Bold').fontSize(24).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 35).fill().fillColor('black').text('Disease Case Report Portal', { align: 'center' });
doc.moveDown();

// Function to add a label and content
function addLabelContent(label, content) {
    doc
        .font('Roboto-Bold')
        .fontSize(12.5)
        .fillColor('black')
        .text(`${label}:`, { continued: true });

    doc
        .font('Roboto')
        .fontSize(12)
        .fillColor('black')
        .text(` ${content}`, { align: 'right' })
        .moveDown(0.5);
}

// Reporting Authority
doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('REPORTING AUTHORITY', { align: 'left' });
doc.moveDown(0.5);
addLabelContent('Name of Health Officer Responsible for case', `${data.reportingAuthority.surname}, ${data.reportingAuthority.otherNames}`);

// Notifier Identification
doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('NOTIFIER IDENTIFICATION', { align: 'left' });
doc.moveDown(0.5);
addLabelContent('Notifier Type', data.notifier.type);
addLabelContent('Reporting Source', data.notifier.reportingSource);
addLabelContent('Organization', data.notifier.organization);
addLabelContent('Date Reported', data.notifier.dateReported);
addLabelContent('Usual GP', data.notifier.usualGP);
addLabelContent('GP Practice', data.notifier.gpPractice);

// GP Practice Address
doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('GP PRACTICE ADDRESS', { align: 'left' });
doc.moveDown(0.5);
addLabelContent('No.', data.notifier.gpPracticeAddress.no);
addLabelContent('Street', data.notifier.gpPracticeAddress.street);
addLabelContent('LGA', data.notifier.gpPracticeAddress.lga);
addLabelContent('Town/City', data.notifier.gpPracticeAddress.townCity);
addLabelContent('Post Code', data.notifier.gpPracticeAddress.postCode);
addLabelContent('Geo Code', data.notifier.gpPracticeAddress.geoCode);

// Case Identification
doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('CASE IDENTIFICATION', { align: 'left' });
doc.moveDown(0.5);
addLabelContent('Name', `${data.caseIdentification.surname}, ${data.caseIdentification.otherNames}`);
addLabelContent('Email', data.caseIdentification.email);

// Case Identification Address
doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('CURRENT ADDRESS', { align: 'left' });
doc.moveDown(0.5);
addLabelContent('No.', data.caseIdentification.currentAddress.no);
addLabelContent('Street', data.caseIdentification.currentAddress.street);
addLabelContent('Suburb', data.caseIdentification.currentAddress.suburb);
addLabelContent('Town/City', data.caseIdentification.currentAddress.townCity);
addLabelContent('Post Code', data.caseIdentification.currentAddress.postCode);
addLabelContent('Geo Code', data.caseIdentification.currentAddress.geoCode);
addLabelContent('Home Phone', data.caseIdentification.phone.home);
addLabelContent('Work Phone', data.caseIdentification.phone.work);

// Case Demography
doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('CASE DEMOGRAPHY', { align: 'left' });
doc.moveDown(0.5);
addLabelContent('Date of Birth', data.caseDemography.dateOfBirth);
addLabelContent('Sex', data.caseDemography.sex);
addLabelContent('Occupation', data.caseDemography.occupation);
addLabelContent('Name of Workspace', data.caseDemography.workspace);

// Case Demography Address
doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('LOCATION', { align: 'left' });
doc.moveDown(0.5);
addLabelContent('No.', data.caseDemography.currentAddress.no);
addLabelContent('Street', data.caseDemography.currentAddress.street);
addLabelContent('Suburb', data.caseDemography.currentAddress.suburb);
addLabelContent('Town/City', data.caseDemography.currentAddress.townCity);
addLabelContent('Post Code', data.caseDemography.currentAddress.postCode);
addLabelContent('Geo Code', data.caseDemography.currentAddress.geoCode);
addLabelContent('Home Phone', data.caseDemography.phone.home);
addLabelContent('Work Phone', data.caseDemography.phone.work);

// Ethnic Groups
doc.font('Roboto-Bold').fontSize(16).fillColor('#8BE08B').rect(doc.x, doc.y, 500, 25).fill().fillColor('black').text('ETHNIC GROUP CASE BELONGS TO', { align: 'left' });
doc.moveDown(0.5);
addLabelContent('Ethnic Group', data.ethnic.type);

// End the document
doc.end();
