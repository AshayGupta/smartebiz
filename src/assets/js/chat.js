// document.write('<scr'+'ipt type="text/javascript" src="https://apps.mypurecloud.ie/webchat/jsapi-v1.js" ></scr'+'ipt>');



var chatConfig = {};
function createChatConfig(firstName1, lastName1, agentEmail1){
    // var imported = document.createElement('script');
    // imported.src = 'https://apps.mypurecloud.ie/webchat/jsapi-v1.js';
    // document.head.appendChild(imported);

    var firstName = "";
    var lastName = "";
    var agentEmail = "";

    if(firstName1){
        firstName = firstName1;
        lastName = lastName1;
        agentEmail = agentEmail1;
    }

    chatConfig = {
        // Web chat application URL
        "webchatAppUrl": "https://apps.mypurecloud.ie/webchat",

        // Web chat service URL
        "webchatServiceUrl": "https://realtime.mypurecloud.ie:443",

        // Numeric organization ID
        "orgId": 9462,

        // Organization name
        "orgName": "britamgroup",

        // Priority
        "priority": 10,

        // Queue Name
        "queueName" : "Britam-Webchat",

        // Target agent email (OPTIONAL)
        //"agentEmail": agentEmail,

        // Log level
        "logLevel": "DEBUG",

        // Locale code
        "locale": "en",

        // Data that will be included with interaction
        "data": {
            "firstName": localStorage.getItem("firstName"),//firstName,
            "lastName": lastName,
            "addressStreet": "64472 Brown Street",
            "addressCity": "Lindgrenmouth",
            "addressPostalCode": "50163-2735",
            "addressState": "FL",
            "phoneNumber": "1-916-892-2045 x293",
            "phoneType": "Cell",
            "customerId": 59606
        },

        // Logo used at the top of the chat window
        "companyLogo": {
            "width": 600,
            "height": 149,
            "url": "https://dhqbrvplips7x.cloudfront.net/webchat/1.0.23/company-logo-large-cea5ee47.png"
        },

        // Logo used within the chat window
        "companyLogoSmall": {
            "width": 149,
            "height": 149,
            "url": "https://dhqbrvplips7x.cloudfront.net/webchat/1.0.23/company-logo-small-9c9fe09b.png"
        },

        // Image used for agent
        "agentAvatar": {
            "width": 462,
            "height": 462,
            "url": "https://dhqbrvplips7x.cloudfront.net/webchat/1.0.23/agent-e202505f.png"
        },

        // Text displayed with chat window is displayed
        "welcomeMessage": "Thanks for chatting.",

        // CSS class applied to the chat window
        "cssClass": "webchat-frame",

        // Custom style applied to the chat window
        "css": {
            "width": "100%",
            "height": "100%"
        }
    };
}

var startEmbeddedChat = function(firstName1, lastName1, agentEmail1) {
  //  console.log("startEmbeddedChat");
    createChatConfig(firstName1, lastName1, agentEmail1);
    ININ.webchat.create(chatConfig, function(err, webchat) {
        if (err) {
            throw err;
        }

        // Render to frame
        webchat.renderFrame({
            containerEl: 'chatContainer'
        });
    });
}

function startPopupChat() {
    createChatConfig();
    ININ.webchat.create(chatConfig, function(err, webchat) {
        if (err) {
            throw err;
        }
        // Render to popup
        webchat.renderPopup({
            width: 400,
            height: 400,
            title: 'Chat',
            //set newTab to true if using screen share
            newTab: false
        });
    });
};

// module.exports = { 
// 	startEmbeddedChat
// };