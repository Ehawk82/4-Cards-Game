﻿// For an introduction to the Blank template, see the following documentation:
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
    var myUI;

    myUI = {
        createEle: (x) => { return document.createElement(x) },
        bySel: (x) => { return document.querySelector(x) },
        bySelAll: (x) => { return document.querySelectorAll(x) },
        byTag: (x) => { return document.getElementsByTagName(x) },
        preLoader: () => {
            //console.log("preloading");
        },
        init: () => {

            myUI.myLoad();

        },
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
            var meterHolder = myUI.createEle("div"),
                food = myUI.createEle("div"),
                people = myUI.createEle("div"),
                military = myUI.createEle("div"),
                money = myUI.createEle("div"),
                cardHolder = myUI.createEle("div"),
                outputHolder = myUI.createEle("div");

            food.innerHTML = "<h3>🥣</h3>";
            food.className = "food";

            people.innerHTML = "<h3>👫</h3>";
            people.className = "people";

            military.innerHTML = "<h3>⚔</h3>";
            military.className = "military";

            money.innerHTML = "<h3>💲</h3>";
            money.className = "money";

            meterHolder.className = "meterHolder";
            meterHolder.appendChild(food);
            meterHolder.appendChild(people);
            meterHolder.appendChild(military);
            meterHolder.appendChild(money);


            cardHolder.innerHTML = "&nbsp;";
            cardHolder.className = "cardHolder";

            outputHolder.innerHTML = "&nbsp;";
            outputHolder.className = "outputHolder";

            dvContainer.appendChild(meterHolder);
            dvContainer.appendChild(cardHolder);
            dvContainer.appendChild(outputHolder);

            setTimeout(() => {
                meterHolder.className = "meterHolder_full";

                cardHolder.className = "cardHolder_full";

                outputHolder.className = "outputHolder_full";
            }, 600);
        }
    };

	app.start();

})();
