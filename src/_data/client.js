module.exports = {
    name: "Shiann Bowman",
    email: "bowman.shiann@gmail.com",
    phoneForTel: "928-916-3711",
    phoneFormatted: "928-916-3711",
    address: {
        lineOne: "Yuma",
        lineTwo: "Arizona",
        city: "Yuma",
        state: "AZ",
        zip: "85000",
        country: "US",
        mapLink: "https://maps.app.goo.gl/",
    },
    socials: {
        facebook: "https://www.facebook.com/",
        instagram: "https://www.instagram.com/",
    },
    //! Make sure you include the file protocol (e.g. https://) and that NO TRAILING SLASH is included
    domain: "https://shiann-field-record.pages.dev",
    // Passing the isProduction variable for use in HTML templates
    isProduction: process.env.ELEVENTY_ENV === "PROD",
};
