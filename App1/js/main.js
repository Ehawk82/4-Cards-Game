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

    

    var cards = [],
        cardCursor = 0;

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
        genCardId: () => { return 'card_' + ((++cardCursor).toString()); },
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
                //console.log("user data is here, and we'll preload and adjustments now...");
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
            var cardType = [
                "Fire", "Water", "Earth", "Air", "Aether", "Nature"
            ];

            var fireQuestions = [
                "A fire has broken out in one of your small cities!",
                "A volcanic eruption threatens a settlement!",
                "A large band of outcasts threaten to burn down your granary!",
                "A wildfire threatens your industry!",
                "A Firewalker has been born!"
            ];

            var waterQuestions = [
                "A flash flood has begun!",
                "A hurricane threatens a coastal city!",
                "There are troops stranded in the desert!",
                "This drought has gone on too long!",
                "An Water Wizard has been born!"
            ];

            var earthQuestions = [
                "Small earthquake reported off the west coast!",
                "A rockslide has blocked a road and cut off supplies to a nearby town!",
                "A growing desert!",
                "A large earthquake has been reported on the west coast!",
                "A Stone Golem has been born!"
            ];

            var airQuestions = [
                "A cyclone threatens landfall!",
                "Tornado season is upon us!",
                "High winds knock down road signs!",
                "Pollution degrades air quality!",
                "A wind glider has been born!"
            ];

            var aetherQuestions = [
                "Meteorites disrupt social gatherings!",
                "Shadow people appear in city courthouse!",
                "Lightning storms threaten central valley!",
                "Mysterious alien craft appear in night sky!",
                "A Moonwalker has been born!"
            ];

            var natureQuestions = [
                "An army of ants threatens to destroy farmland!",
                "Bears are rumaging through trash locations!",
                "A newly domesticated pet!",
                "Where are the fish?",
                "A Gaia Spirit has been born!"
            ];
            //f, w, e, a, ea, n
            var flen = fireQuestions.length,
                f = Math.round(Math.random() * (flen - 1));

            var wlen = waterQuestions.length,
                w = Math.round(Math.random() * (wlen - 1));

            var elen = earthQuestions.length,
                e = Math.round(Math.random() * (elen - 1));

            var alen = airQuestions.length,
                a = Math.round(Math.random() * (alen - 1));

            var aelen = aetherQuestions.length,
                ae = Math.round(Math.random() * (aelen - 1));

            var nlen = natureQuestions.length,
                n = Math.round(Math.random() * (nlen - 1));

            var cardQ = {
                Fire: fireQuestions[f],
                Water: waterQuestions[w],
                Earth: earthQuestions[e],
                Air: airQuestions[a],
                Aether: aetherQuestions[ae],
                Nature: natureQuestions[n]

            };

            var Qlen = cardType.length,
                rand = Math.round(Math.random() * (Qlen - 1));

            var titleRand = cardType[rand],
                randQuestion = cardQ[cardType[rand]];

            


            

            var newIdx = cards.length,
                cardId = myUI.genCardId(),

                cardBox = myUI.createEle('div'),
                card = myUI.createEle('div'),

                front = myUI.createEle('div'),
                fronttx = myUI.createEle('p'),     // card front text
                frontbt = myUI.createEle('input'), // card front button 

                back = myUI.createEle('div'),
                backtx = myUI.createEle('p'),
                backbt = myUI.createEle('input'), backbt2 = myUI.createEle('input'), backbt3 = myUI.createEle('input'),

                flipper = () => card.classList.toggle('flipped'),
                accepter = () => { return card.classList.toggle('recycled'), setTimeout(() => { card.remove(); if (cardBox.parentNode.className === "deck_unflipped") { return cardBox.parentNode.innerHTML = "", myUI.callDeck() } else { return cardBox.parentNode.innerHTML = "" } }, 1000) },
                saver = () => { return card.classList.toggle('accepted'), myUI.saveCard(card, deck_unflipped, deck_flipped, cardBox), setTimeout(() => { deck_unflipped.innerHTML = ""; myUI.callDeck(); }, 1000); },
                playCard = () => { return card.classList.toggle('selected'), setTimeout(() => { return body.appendChild(cardBox), setTimeout(() => { return card.classList.toggle('selected_full'), myUI.useCard(card, f, w, e, a, ae, n) }, 200) }, 200) };

            cards.push(cardId);

            cardBox.className = 'cardbox';
            front.className = 'cardfront';
            back.className = 'cardback';
            card.className = 'cardPre'

            fronttx.innerHTML = titleRand;
            backtx.innerHTML = randQuestion;
            backtx.style.color = "transparent" 

            frontbt.value = '🔄';
            frontbt.type = 'button';
            frontbt.onclick = flipper;

            backbt.value = '♻';
            backbt.type = 'button';
            backbt.onclick = accepter;

            backbt2.value = '💾';
            backbt2.type = 'button';
            backbt2.onclick = saver;

            backbt3.value = '✔';
            backbt3.type = 'button';
            backbt3.onclick = playCard;

            card.id = cardId;

            front.appendChild(fronttx);
            front.appendChild(frontbt);

            back.appendChild(backtx);
            back.appendChild(backbt);
            back.appendChild(backbt2);
            back.appendChild(backbt3);

            card.appendChild(front);
            card.appendChild(back);
            cardBox.appendChild(card);

            if (!deck_unflipped) {
                var deck_unflipped = myUI.bySel(".deck_unflipped");

                deck_unflipped.appendChild(cardBox);
            } else {
                deck_unflipped.appendChild(cardBox);
            }
            setTimeout(() => {
                card.className = "card";
            }, 500);
        },
        saveCard: (card, deck_unflipped, deck_flipped, cardBox) => {
            var cardEles = card.childNodes,
                cardTitle = cardEles[0].childNodes,
                cardTitleBack = cardEles[1].childNodes,
                cardSaveButton = cardEles[1].childNodes,
                cardbox = cardBox;
            cardSaveButton[2].remove();

            var newTitle = cardTitleBack[0].innerHTML;
            cardTitleBack[0].innerHTML = newTitle;

            setTimeout(() => {
                if (deck_flipped) {
                    deck_flipped.appendChild(cardbox);
                } else {
                    var deck_flipped = myUI.bySel(".deck_flipped");
                    deck_flipped.innerHTML = "";
                    deck_flipped.appendChild(cardbox);
                }
            }, 100);
            //deck_flipped.innerHTML = "";
            //deck_flipped.appendChild(cardbox);

        },
        useCard: (card, f, w, e, a, ae, n) => {
            var cardkids = card.childNodes,
                cardfront = cardkids[0].childNodes,
                cardback = cardkids[1].childNodes;

            var newCardQuestion = myUI.createEle("h1"),
                answerHolder = myUI.createEle("div"),
                answerA = myUI.createEle("button"),
                answerB = myUI.createEle("button");

            console.log(cardfront[0].innerHTML);
            if (cardfront[0].innerHTML === "Fire") {
                var x = f;
            }
            if (cardfront[0].innerHTML === "Water") {
                var x = w;
            }
            if (cardfront[0].innerHTML === "Earth") {
                var x = e;
            }
            if (cardfront[0].innerHTML === "Air") {
                var x = a;
            }
            if (cardfront[0].innerHTML === "Aether") {
                var x = ae;
            }
            if (cardfront[0].innerHTML === "Nature") {
                var x = n;
            }

            if (cardback[3]) {
                cardback[3].remove();
            }
            if (cardback[2]) {
                cardback[2].remove();
            }
            if (cardback[1]) {
                cardback[1].remove();
            }

            var titleContents = cardback[0].innerHTML;

            cardback[0].remove();

            var newTitleTag = myUI.createEle("h2");

            newTitleTag.innerHTML = titleContents;
            newTitleTag.className = "newTitleTag";
            
            ///if (card) { }

            //newCardQuestion.innerHTML = cardfront[0].innerHTML + x;
            //newCardQuestion.className = "newCardQuestion";

            answerA.innerHTML = "A";

            answerB.innerHTML = "B";

            answerHolder.className = "answers";
            answerHolder.appendChild(answerA);
            answerHolder.appendChild(answerB);

            cardkids[1].appendChild(newTitleTag);
            //cardkids[1].appendChild(newCardQuestion);
            cardkids[1].appendChild(answerHolder);

            setTimeout(() => {
                newTitleTag.className = "newTitleTag_full";
               // newCardQuestion.className = "newCardQuestion_full";
                answerHolder.className = "answers_full";

            }, 300);
        }
    };

    app.start();

})();
