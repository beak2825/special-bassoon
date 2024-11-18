// You can modify this variable to change the warning message easily
var warningMessage = "This could take 3.2 minutes to load! - Jonathan R";

// Function to inject CSS styles into the document
function injectStyles() {
    var style = document.createElement('style');
    style.innerHTML = `
        body {
            background: #000e29;
            width: 399px;
            height: 20px;
            bottom: 100;
            right: 25;
            box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.3); /* Optional: Add a subtle shadow if needed */
            color: #000e29; /* Text color for the alert-info, change as needed */
            text-shadow: 2px 1px #00040a;
            transition: 0.5s;
            cursor: pointer;
        }

        .alert-simple.alert-success {
            border: 1px solid rgba(36, 241, 6, 0.46);
            background-color: rgba(7, 149, 66, 0.12156862745098039);
            box-shadow: 0px 0px 2px #259c08;
            color: #0ad406;
            text-shadow: 2px 1px #00040a;
            transition: 0.5s;
            cursor: pointer;
        }

        .alert-simple.alert-info {
            border: 1px solid rgba(6, 44, 241, 0.46);
            background-color: rgba(7, 73, 149, 0.12156862745098039);
            box-shadow: 0px 0px 2px #0396ff;
            color: #0396ff;
            text-shadow: 2px 1px #00040a;
            transition: 0.5s;
            cursor: pointer;
        }

        .alert-simple.alert-warning {
            border: 1px solid rgba(241, 142, 6, 0.81);
            background-color: rgba(220, 128, 1, 0.16);
            box-shadow: 0px 0px 2px #ffb103;
            color: #ffb103;
            text-shadow: 2px 1px #00040a;
            transition: 0.5s;
            cursor: pointer;
        }

        .alert-simple.alert-danger {
            border: 1px solid rgba(241, 6, 6, 0.81);
            background-color: rgba(220, 17, 1, 0.16);
            box-shadow: 0px 0px 2px #ff0303;
            color: #ff0303;
            text-shadow: 2px 1px #00040a;
            transition: 0.5s;
            cursor: pointer;
        }

        .alert-simple.alert-primary {
            border: 1px solid rgba(6, 241, 226, 0.81);
            background-color: rgba(1, 204, 220, 0.16);
            box-shadow: 0px 0px 2px #03fff5;
            color: #03d0ff;
            text-shadow: 2px 1px #00040a;
            transition: 0.5s;
            cursor: pointer;
        }

        .fa-times {
            -webkit-animation: blink-1 2s infinite both;
            animation: blink-1 2s infinite both;
        }

        @-webkit-keyframes blink-1 {
            0%, 50%, 100% {
                opacity: 1;
            }
            25%, 75% {
                opacity: 0;
            }
        }

        @keyframes blink-1 {
            0%, 50%, 100% {
                opacity: 1;
            }
            25%, 75% {
                opacity: 0;
            }
        }

        @keyframes closeAlert {
            0% {
                transform: translateX(0);
            }
            50% {
                transform: translateX(-15px);
            }
            100% {
                transform: translateX(100vw);
            }
        }

        .alert.closing {
            animation: closeAlert 0.55s ease-in-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// Function to create and display the alert box
function createAlert() {
    // Create the alert div element
    var alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', 'fade', 'alert-simple', 'alert-info', 'alert-dismissible', 'text-left',
        'font__family-montserrat', 'font__size-16', 'font__weight-light', 'show');
    alertDiv.setAttribute('role', 'alert');
    alertDiv.setAttribute('data-brk-library', 'component__alert');
    
    // Create the close button
    var closeButton = document.createElement('button');
    closeButton.setAttribute('type', 'button');
    closeButton.classList.add('close', 'font__size-18');
    closeButton.setAttribute('data-dismiss', 'alert');
    closeButton.innerHTML = '<span aria-hidden="true"><i class="fa fa-times blue-cross"></i></span><span class="sr-only">Close</span>';
    closeButton.addEventListener('click', function () {
        alertDiv.classList.add('closing');
        setTimeout(() => {
            alertDiv.remove();
        }, 550); // Allow for the closing animation duration
    });
    
    // Add the icon and the warning text
    var icon = document.createElement('i');
    icon.classList.add('start-icon', 'fa', 'fa-info-circle', 'faa-shake', 'animated');
    
    var strongText = document.createElement('strong');
    strongText.classList.add('font__weight-semibold');
    strongText.textContent = "Heads up! ";
    
    var alertText = document.createElement('span');
    alertText.textContent = warningMessage;
    
    // Append all elements to the alert div
    alertDiv.appendChild(closeButton);
    alertDiv.appendChild(icon);
    alertDiv.appendChild(strongText);
    alertDiv.appendChild(alertText);
    
    // Set the position of the alert to be above other elements
    alertDiv.style.position = 'absolute'; // Use absolute positioning
    alertDiv.style.top = '10px'; // Distance from the top of the screen
    alertDiv.style.left = '50%'; // Center the alert horizontally
    alertDiv.style.transform = 'translateX(-50%)'; // Center the alert horizontally
    alertDiv.style.zIndex = '9999'; // Ensure the alert is on top of other elements

    // Append the alert div to the body (or any other container)
    document.body.appendChild(alertDiv);
}

// Run the functions when the page is loaded
document.addEventListener('DOMContentLoaded', function () {
    injectStyles();  // Inject the CSS styles
    createAlert();   // Create and display the alert
});
