var introSound = new Audio('assets/sounds/introSound.mp3');
var blanka = new Audio('assets/sounds/blanka.mp3');
var ryu = new Audio('assets/sounds/hadoken.mp3');
var guile = new Audio('assets/sounds/sonicboom.mp3');
var dhalsim = new Audio('assets/sounds/yoga_flame.mp3');
var fight = new Audio('assets/sounds/fight.mp3');
var perfect = new Audio('assets/sounds/perfect.mp3');
var select = new Audio('assets/sounds/select.mp3');


$(document).ready(function () {
    var fighterNames = ["Ryu", "Blanka", "Guile", "Dhalsim"];
    var fighterHPs = [300, 350, 275, 325];
    var fighterAttacks = [30, 20, 15, 10];
    var fighterCounters = [25, 40, 45, 20];
    var fighterObjects = [];
    var yourChar;
    var currentEnemy;

    //Initialize all fight/character objects ( the result is an array called fighterObjects that holds 4 javascript objects that represent each fight )
    var initCharObjects = function () {
        console.log("initcharobjects")
        fighterObjects = [];

        for (var i = 0; i < fighterNames.length; i++) {
            var fighter = {
                name: "",
                pic: "",
                back: "",
                health: 0,
                attackPower: 0,
                baseAttackPower: 0,
                counter: 0,
                powerUp: function () {
                    this.attackPower = this.attackPower + this.baseAttackPower;
                },
                setBaseAttackPower: function () {
                    this.baseAttackPower = this.attackPower;
                }
            };

            fighter.name = fighterNames[i];
            fighter.back = "assets/images/back_" + fighterNames[i].toLowerCase() + ".png";
            fighter.pic = "assets/images/" + fighterNames[i].toLowerCase() + ".png";
            fighter.health = fighterHPs[i];
            fighter.attackPower = fighterAttacks[i];
            fighter.counter = fighterCounters[i];
            fighter.setBaseAttackPower();
            fighterObjects.push(fighter);
        }
    }

    //Initialize HTML
    var initHTML = function () {
        console.log("inithtml")
        $("#pregametext").html("<h6>CHOOSE YOUR CHARACTER:</h6>")

        for (var i = 0; i < fighterObjects.length; i++) {
            //Create html for a fighter's name, image, and hp...then append them to a section that will represent them
            var fighterDisplay = $("<section>").addClass("fighterBox")
            var fighterName = $("<div>").addClass("fighterName").text(fighterObjects[i].name)
            var fighterImg = $("<img>").addClass("fighterImg").attr("src", fighterObjects[i].pic) //IS STRINGING FUNCTIONS LIKE THIS BAD PRACTICE?
            var fighterHP = $("<div>").addClass("fighterHP").text(fighterObjects[i].health)
            fighterDisplay.append(fighterName)
            fighterDisplay.append(fighterImg)
            fighterDisplay.append(fighterHP)
            //This is what creates the relationship between the fighter's html represenation and their actual javascript object 
            fighterDisplay.data("fighter", fighterObjects[i])
            // Add all fighters to the pregame area of the window
            $("#pregame").append(fighterDisplay)
        }

        //Hide all html that should only appear after the pregame character selection
        $("#restartButton").css('visibility', 'hidden')
        $("#attackButton").css('visibility', 'hidden')
        $("#fightRing").css('visibility', 'hidden')
        $("#bottom").css('visibility', 'hidden')

        //Empty out all divs that may have leftover children from a previous game
        $("#info").empty()
        $("#yourCharacter").empty()
        $("#enemyRoster").empty()
        $("#defender").empty()
    }

    //Initialize all objects and html for a fresh game 
    var initGame = function () {
        initCharObjects()
        initHTML()
    }

    //This is where game actually starts on a fresh page load
    initGame()



    $(".fighterBox").on("click", function () {
        console.log("clicking fighter box")
        //Make first fighter that you click your chosen character for rest of the game, and move them into the yourCharacter div
        if ($("#pregame")[0].childElementCount === 4) {
            $("#pregametext").empty()
            introSound.play()
            $("#yourCharacter").append($(this))

            //Change character's name and hp divs to have background color blue, with white text
            $($($("#yourCharacter")[0].firstChild).find(".fighterName")).css({ "background-color": "rgb(37, 3, 128)", "color": "white" })
            $($($("#yourCharacter")[0].firstChild).find(".fighterHP")).css({ "background-color": "rgb(37, 3, 128)", "color": "white" })

            //Extract character's object from the associated html that represents the character
            yourChar = jQuery.data($("#yourCharacter")[0].firstChild, "fighter")
            $("#fightRing").css('background-image', "url(" + yourChar.back + ")")
            $("#fightRing").css('visibility', 'visible')
            $("#bottom").css('visibility', 'visible')
            $("#enemyRoster").append($("#pregame").children().detach())
            //Change characters in the enemy roster div to have a black background and white text 
            $($("#enemyRoster")[0].children).css({ "background-color": "black", "color": "white" })
        }
        //move enemy to defense area...only if clicking on a fighter in enemy roster, and there is no current defender
        else if ($("#enemyRoster").has($(this)).length && $("#defender")[0].childElementCount === 0) { //WHY DO I NEED LENGTH FOR THIS TO WORK PROPERLY?
            //make attack button appear only when the first defender is chosen
            if ($("#enemyRoster")[0].childElementCount === 3) {
                $("#attackButton").css('visibility', 'visible')
            }

            $("#defender").append($(this))
            //Change character's name and hp divs to have background color red, with white text
            $($($("#defender")[0].firstChild).find(".fighterName")).css({ "background-color": "red", "color": "black" })
            $($($("#defender")[0].firstChild).find(".fighterHP")).css({ "background-color": "red", "color": "black" })
            //Flip picture of character to face in correct direction
            $($($("#defender")[0].firstChild).find(".fighterImg")).addClass("img-hor")
            //Extract  object from the associated html that represents the character
            currentEnemy = jQuery.data($("#defender")[0].firstChild, "fighter")
            eval(currentEnemy.name.toLowerCase()).play()
        }
    });


    $("#attackButton").on("click", function () {
        //Code for pressing attack button, with no proper defender in place
        if ($("#defender")[0].childElementCount === 0) {
            select.play()
            $("#info").html("<p>No enemy here.</p>")
            return
        }

        fight.play()

        //you attack the defender
        $("#info").html("<p>You attacked " + currentEnemy.name + " for " + yourChar.attackPower + " damage.</p><p>" + currentEnemy.name + " attacked you back for " + currentEnemy.counter + " damage.</p>")
        currentEnemy.health = currentEnemy.health - yourChar.attackPower
        $(".fighterHP", $("#defender")[0].firstChild).text(currentEnemy.health)

        //if they run out of health...
        if (currentEnemy.health <= 0) {
            $("#info").html("<p>You have defeated " + currentEnemy.name + ", you can choose to fight another enemy.</p>")
            $("#defender").empty()
        }

        //if you've defeated all enemies
        if ($("#enemyRoster")[0].childElementCount === 0 && $("#defender")[0].childElementCount === 0) {
            $("#info").html("<p>You won!!!! GAME OVER!!!</p>")
            $("#restartButton").css('visibility', 'visible')
            $("#attackButton").css('visibility', 'hidden')
            return
        }

        yourChar.powerUp() //increase attack power by base attack power

        //defender counter attacks        
        yourChar.health = yourChar.health - currentEnemy.counter
        $(".fighterHP", $("#yourCharacter")[0].firstChild).text(yourChar.health)

        //If you run out of health...
        if (yourChar.health <= 0) {
            $("#info").html("<p>You have been defeated...GAME OVER!!!</p>")
            $("#yourCharacter").empty()
            $("#restartButton").css('visibility', 'visible')
            $("#attackButton").css('visibility', 'hidden')
            return
        }
    });


    $("#restartButton").on("click", function () {
        //initGame() This works for reseting the look of the page, but for some reason, it won't register click events on my fighterBox div anymore
        location.reload(); //This works, but to me it's a HACK....need to figure out why the initGame() did't work.
    });
});






