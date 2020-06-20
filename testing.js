let listingArray = [
  {
    price: 1000,
    listingName: "Sample 1",
    listingDescription: "Sample Desc 1",
    url: "www.url.com",
    imgUrl: "www.url.com",
  },
  {
    price: 2000,
    listingName: "Sample 2",
    listingDescription: "Sample Desc 2",
    url: "www.url.com",
    imgUrl: "www.url.com",
  },
  {
    price: 3000,
    listingName: "Sample 3",
    listingDescription: "Sample Desc 3",
    url: "www.url.com",
    imgUrl: "www.url.com",
  },
  {
    price: 4000,
    listingName: "Sample 4",
    listingDescription: "Sample Desc 4",
    url: "www.url.com",
    imgUrl: "www.url.com",
  },
];

var Listing = require("./models/listing.model");

console.log(listingArray);
var sampleMap = Object.assign(new Listing(), listingArray);
console.log(sampleMap);
