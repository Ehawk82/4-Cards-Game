// For an introduction to the Blank template, see the following documentation:
// https://go.microsoft.com/fwlink/?LinkId=232509

(function () {
    "use strict";

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    var isFirstActivation = true;

    var ViewManagement = Windows.UI.ViewManagement;
    var ApplicationViewWindowingMode = ViewManagement.ApplicationViewWindowingMode;
    var ApplicationView = ViewManagement.ApplicationView;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.voiceCommand) {
            // TODO: Handle relevant ActivationKinds. For example, if your app can be started by voice commands,
            // this is a good place to decide whether to populate an input field or choose a different initial view.
        }
        else if (args.detail.kind === activation.ActivationKind.launch) {
            // A Launch activation happens when the user launches your app via the tile
            // or invokes a toast notification by clicking or tapping on the body.

            if (args.detail.arguments) {
                // TODO: If the app supports toasts, use this value from the toast payload to determine where in the app
                // to take the user in response to them invoking a toast notification.
            }
            else if (args.detail.previousExecutionState === activation.ApplicationExecutionState.terminated) {
                // TODO: This application had been suspended and was then terminated to reclaim memory.
                // To create a smooth user experience, restore application state here so that it looks like the app never stopped running.
                // Note: You may want to record the time when the app was last suspended and only restore state if they've returned after a short period.
            }
        }

        if (!args.detail.prelaunchActivated) {
            // TODO: If prelaunchActivated were true, it would mean the app was prelaunched in the background as an optimization.
            // In that case it would be suspended shortly thereafter.
            // Any long-running operations (like expensive network or disk I/O) or changes to user state which occur at launch
            // should be done here (to avoid doing them in the prelaunch case).
            // Alternatively, this work can be done in a resume or visibilitychanged handler.
            myUI.preLoader();
        }

        if (isFirstActivation) {
            // TODO: The app was activated and had not been running. Do general startup initialization here.
            document.addEventListener("visibilitychange", onVisibilityChanged);
            args.setPromise(WinJS.UI.processAll());
            ApplicationView.preferredLaunchWindowingMode = ApplicationViewWindowingMode.fullScreen;
            myUI.init();
        }

        isFirstActivation = false;
    };

    function onVisibilityChanged(args) {
        if (!document.hidden) {
            // TODO: The app just became visible. This may be a good time to refresh the view.
        }
    }

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state that needs to persist across suspensions here.
        // You might use the WinJS.Application.sessionState object, which is automatically saved and restored across suspension.
        // If you need to complete an asynchronous operation before your application is suspended, call args.setPromise().
    };
    var myUI, uData, myDeck, myDeckCount;

    myDeck = [];
    myDeckCount = 52;

    uData = {
        food: 105,
        people: 10,
        military: 0,
        money: 100,
        cardCount: 0
    }

    myUI = {
        /*return functions*/
        createEle: (x) => { return document.createElement(x) },
        bySel: (x) => { return document.querySelector(x) },
        bySelAll: (x) => { return document.querySelectorAll(x) },
        byTag: (x) => { return document.getElementsByTagName(x) },

        /* initializing and gloabal UI control */
        preLoader: () => {
            //console.log("preloading");
        },
        init: () => {
            //localStorage.clear();
            var userdata = localStorage.getItem("uData");
            if (!userdata || userdata === null) {
                //console.log("uData is not here, but we'll do that now");
                localStorage.setItem("uData", JSON.stringify(uData));
            } else {
                //console.log("uData is here, and we'll preload and adjustments now...");
                //console.log(uData);
            }

            myUI.myLoad();
        },
        /* let the games begin! */
        myLoad: () => {
            var startBtn = myUI.createEle("button");

            startBtn.innerHTML = "START";
            startBtn.className = "startBtn";
            startBtn.onclick = myUI.startGame(startBtn);

            dvContainer.appendChild(startBtn);

            setTimeout(() => {
                startBtn.className = "startBtn_full";
            }, 600);
        },
        startGame: (startBtn) => {
            return () => {
                setTimeout(() => {
                    startBtn.remove();
                    myUI.gameInterfaceLoad();
                }, 50);
            }
        },
        gameInterfaceLoad: () => {
            var userdata = localStorage.getItem("uData");
            if (userdata) {
                var uuu = JSON.parse(userdata);
            }

            var meterHolder = myUI.createEle("div"),
                food = myUI.createEle("div"),
                people = myUI.createEle("div"),
                military = myUI.createEle("div"),
                money = myUI.createEle("div"),
                cardHolder = myUI.createEle("div"),
                deck_unflipped = myUI.createEle("div"),
                deck_flipped = myUI.createEle("div"),
                outputHolder = myUI.createEle("div");

            /*meter stuffs*/
            food.innerHTML = "<h3>🥣" + uuu.food + "</h3>";
            food.className = "food";

            people.innerHTML = "<h3>👫" + uuu.people + "</h3>";
            people.className = "people";

            military.innerHTML = "<h3>⚔" + uuu.military + "</h3>";
            military.className = "military";

            money.innerHTML = "<h3>💲" + uuu.money + "</h3>";
            money.className = "money";

            meterHolder.className = "meterHolder";
            meterHolder.appendChild(food);
            meterHolder.appendChild(people);
            meterHolder.appendChild(military);
            meterHolder.appendChild(money);

            /* card holder stuffs */

            deck_unflipped.className = "deck_unflipped";


            deck_flipped.className = "deck_flipped";

            cardHolder.innerHTML = "&nbsp;";
            cardHolder.className = "cardHolder";
            cardHolder.appendChild(deck_unflipped);
            cardHolder.appendChild(deck_flipped);

            /* output holder stuffs */
            outputHolder.innerHTML = "&nbsp;";
            outputHolder.className = "outputHolder";

            /* the container stuffs */
            dvContainer.appendChild(meterHolder);
            dvContainer.appendChild(cardHolder);
            dvContainer.appendChild(outputHolder);

            /* delayed effects */
            setTimeout(() => {
                meterHolder.className = "meterHolder_full";

                cardHolder.className = "cardHolder_full";

                outputHolder.className = "outputHolder_full";

                setTimeout(() => {
                    myUI.callDeck(deck_unflipped, deck_flipped, uuu);
                }, 50);
            }, 600);
        },
        callDeck: (deck_unflipped, deck_flipped, uuu) => {
            
            if (uuu.cardCount === 0) {
                for (var i = 1; i < myDeckCount; i++) {
                    var card = myUI.createEle("div");

                    card.id = "card_" + i;
                    card.innerHTML = i;
                    card.className = "cards";

                    deck_unflipped.appendChild(card);

                    
                }


                
            } else {

            }
            
            
        }
    };

    app.start();

})();
