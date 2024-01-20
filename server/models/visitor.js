const {Schema, model} = require('mongoose');

const visitorSchema = new Schema({
user: {type: String, unique: true},
ipAddress: {type: String},
pagesVisited: { type: Map, of: String },
firstVisitDate : {type: String},
visits: {type: Number},
lastSeenDate: {type: String},
lastSeenTime: {type: String},
country: {type: String},
city: {type: String},
region: {type: String},
userAgent: {type: String},
isVpn: {type: String},
isProxy: {type: String}
});

const Visitor = model('Visitor', visitorSchema);
module.exports = Visitor;