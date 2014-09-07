/*
 * KEYBOARD OUTPUT: CONTROLLER ; AUTHOR: Joel Quiles Baker
 * This file is a javascript events controller. It makes an AJAX call to a db service each time
 * a new scheme for a program is selected. With all the keyboard shortcuts retrieved, the user
 * can view keyboard shortcuts that dont require extra keys to activate. These extra keys that 'activate',
 * from now on called activators, are the CTRL, ALT, SHIFT and WIN keys.
 *
 * When the user then presses on an activator, the keys thay don't require that activator will hide, and
 * the ones activated by it are shown. Go to the program profile page to see a live example of this.
 */
steal("jquery/jquerymx.js").then(function() {//custom jQueryMX should contain only Controller and class. Don't need models or views
    $.Controller("KeyboardPreviewCtrl",
    {
        /*Static*/
        },
        /*prototype*/
        {
            init: function() {
                //used to mantain a state of which keys are currently pressed or marked as 'selected' : for activators
                this.pressedKeysString = "";
                //used to communicate with html ids for specifying which key is pressed
                this.keysHash = {};
                //used for the search / filter
                this.namesHash = {};
                //used to store keys that are activated by a specific activator
                this.activatedKeys = {};

                this.getSchemeKeys($('#whichSchemer').attr('scheme-id').substr(1));

                $('#tooltip').css('top','0em');
                $('#tooltip').css('right','-26em');

            },

            //END INIT. Event handlers follow

            ///////////////////////
            //
            //  Events for Keyboard (tooltop, keys, activators)
            //
            ///////////////////////

            /*
             * Add/remove key to hash, make the key selected (less transparency)
             */
            '.key click': function(el, ev) {
                //grab element that was clicked [holder], use jQuery selector just once for optimization purposes
                var holder= $(el);
                //string id of the key (div) clicked
                var id = holder.attr("id");
                //used to store which side of activsator was pressed (Left Ctrl key or Right Ctrl key, for example)
                var pressedKeySide='';
                //go ahead and store key side
                if(id.indexOf('L') != -1)
                    pressedKeySide = 'L';
                else if (id.indexOf('R') != -1)
                    pressedKeySide = 'R';

                //activator are keys such as Ctrl, Alt, Shift and their combinations that activate other keys for certain actions
                //id clicked element contains an activator, the css id will contain L or R for left or right key. we need to remove this
                if(this.isActivator(id)) {
                    id = id.replace('L','').replace('R','');
                }
                else {
                    return false; //can't select non-activator keys'
                }

                //if key was previously selected
                if (holder.hasClass('selected')) {
                    //remove element from selected activators strings, make sure no trailing + sign or any strange behaviour happens
                    this.pressedKeysString = this.pressedKeysString.replace(id, '');
                    if(this.pressedKeysString.indexOf('+') == this.pressedKeysString.length-1)
                        this.pressedKeysString = this.pressedKeysString.slice(0,this.pressedKeysString.length-1);
                    else if (this.pressedKeysString.indexOf('+') == 0)
                        this.pressedKeysString = this.pressedKeysString.substr(1);
                    else
                        this.pressedKeysString.replace('++','+');

                    holder.removeClass('selected');

                    //hide all keys on keyboard, we will show the ones we need below
                    $('.key').hide();

                    //if we still have activator keys pressed because we were using a combination such as Ctrl+Alt to activate shortcut
                    if(this.pressedKeysString != '') {
                        if(   this.activatedKeys[this.pressedKeysString] !== undefined   ) {
                            for(var w = 0; w < this.activatedKeys[this.pressedKeysString].length; w++) {
                                //search all the keys in the array and show them
                                $('#'+this.activatedKeys[this.pressedKeysString][w].keys).fadeIn();
                            }
                        }
                        $('#'+pressedKeySide+this.pressedKeysString).show();

                        holder.show();
                        //we don't need that holded key anymore, replace
                        //with all the current cobinations that have that key that is still pressed
                        holder = this.isPartOfActivatorCombination(this.pressedKeysString);
                        if(holder.length > 1) {//if we have more than one combination, which includes the activator alone
                                               //then we show all the keys involved in the combination
                            for(var severalKeysInCombination in holder) {
                                var reSplitted = holder[severalKeysInCombination].split('+');
                                for(var aKeyInReSplitted in reSplitted) {
                                    $('#'+pressedKeySide+  reSplitted[aKeyInReSplitted]  ).show();
                                }
                            }
                        }

                    }
                    else {
                        //no other activator keys were pressed, just show initial keyboard
                        this.showKeys();
                    }

                }
                else {//key was not currently selected, we are clicking

                    //lets add the key to the current keys pressed, and perform some lazy magic
                    if(this.pressedKeysString != '')
                        this.pressedKeysString += '+';
                    this.pressedKeysString += id;
                    if(this.pressedKeysString == 'Alt+Ctrl')
                        this.pressedKeysString = 'Ctrl+Alt';
                    if(this.pressedKeysString == 'Shift+Ctrl')
                        this.pressedKeysString = 'Ctrl+Shift'

                    //again, hide all keys we will show the ones we need soon
                    $('.key').hide();

                    if(   this.activatedKeys[this.pressedKeysString] !== undefined   ) {
                        //                        if(!this.activatedKeys[this.pressedKeysString].isArray)
                        for(var w = 0; w < this.activatedKeys[this.pressedKeysString].length; w++) {
                            //search all the keys in the array and show them
                            $('#'+this.activatedKeys[this.pressedKeysString][w].keys).fadeIn();
                        }
                    }
                    if((id = this.isPartOfActivatorCombination(id))) {
                        for(var aComb in id){
                            var splittted = id[aComb].split('+');
                            for(var theKeysInThisCombination in splittted) {
                                $('#'+pressedKeySide+splittted[theKeysInThisCombination]).show();
                            }

                        }
                    }
                    //show the activator that was pressed as selected
                    holder.addClass('selected');
                }
            },

            /*
             * Show tooltip when hover
             */
            '.key mouseenter': function(el, ev) {

                steal.dev.log("mouse enter");

                //holder for performance purposes when using jQuery: don't want to use the same selector multiple times
                var holder= $(el);
                var id = holder.attr("id")+"";

                //if it is an activator key, forget about tooltip
                if(this.isActivator(id))
                    return;

                //these next 4 lines are used to align the tooltip on the bottom right side of the hovered key
//                var left = parseInt(el.css('left').replace('px',''),10) + parseInt($(el).parent().css('left').replace('px',''),10) + '%';
//                var top =  parseInt($(el).parent().css('top').replace('px',''),10) - parseInt(el.css('bottom').replace('px',''),10)  + $(el).parent().height() + 'px';
//                $('#tooltip').css('left',left);
//                $('#tooltip').css('top',top);

                //Fill in tooltip contents with current hovered key info

                if(this.pressedKeysString != '')
                    id = this.pressedKeysString+'+'+id;

                var keyElem = this.keysHash[id];

                steal.dev.log("keyElem",keyElem);

                $('#keyTitle').text(keyElem.name);
                $('#shortcutDesc').text(keyElem.desc);

                //finally, show the tooltip
                $('#tooltip').fadeIn();

            },
            /*
             * Hide Tool tip when mouse leaves key
             */
            '.key mouseleave': function(el, ev) {
//                $('#tooltip').hide();
            },

            /* End Event handlers
             */



            ///////////////////////
            //
            //  UTILITY FUNCTIONS
            //
            ///////////////////////

            //Used to show all keys without any activator (initial state of keyboard)
            showKeys : function() {
                for (var z in this.namesHash) {
                    if(this.namesHash[z].activated_by === '' || this.namesHash[z].activated_by == undefined) {
                        $('#'+this.namesHash[z].keys).fadeIn();
                    }
                    else {
                        var splitted = this.namesHash[z].activated_by.split('+');
                        for(var aSplittedKey in splitted){
                            $('#L'+splitted[aSplittedKey]).show();
                            $('#R'+splitted[aSplittedKey]).show();
                        }
                    }
                }
            },

            resetKeyboard : function() {
                $('.key').hide();
                this.showKeys();
            },

            //util function to verify if the key (passed the key name as string) is an activator or just a regular key
            isActivator : function(keyString) {
                if(keyString.indexOf("Shift") != -1 || keyString.indexOf("Alt") != -1 || keyString.indexOf("Ctrl") != -1 || keyString.indexOf("Win") != -1)
                    return true;
                else
                    return false;
            },
            //verify and return the combinations in which the current activator participates
            isPartOfActivatorCombination : function(activator) {
                var posKeysComb = this.getHashKeys(this.activatedKeys);
                var result = [];
                for(var actKeys in posKeysComb) {
                    if(posKeysComb[actKeys].indexOf(activator) != -1)
                        result.push(posKeysComb[actKeys]);
                }
                if(result.length > 0) return result;
                else return false;
            },
            //get keys from a hash, without overwritting hash or object prototype
            getHashKeys : function(hash) {
                var keys = [];
                for(var i in hash) if (hash.hasOwnProperty(i))
                {
                    keys.push(i);
                }
                return keys;
            },

            resetScheme : function() {
                this.pressedKeysString = "";
                //used to communicate with html ids for specifying which key is pressed
                this.keysHash = {};
                //used for the search / filter
                this.namesHash = {};
                //used to store keys that are activated by a specific activator
                this.activatedKeys = {};
            },

            getSchemeKeys : function(scheme_id) {

                var ctrlCtx = this;
                
                $.post('/shortcutsAJAX', {
                    'id' : scheme_id
                }, function(data) {
                    //lets traverse the shortcuts json object

                    for(var i = 0; i < data.length; i++) {
                        //populate the namesHash when iterating: sample hash: ['10 % transparency': '[object] correspondingKey', 'Invert' : '[object] anotherKey']
                        ctrlCtx.namesHash[data[i].name] = data[i];

                        //if no activator is required for the key shortcuts, show the keys
                        if(data[i].activated_by === ''){
                            //store in two different hashes, for different purposes
                            ctrlCtx.keysHash[data[i].keys] = data[i];
                            $('#'+data[i].keys).show();
                        }
                        else {
                            //Else we need to store those keys in a hash that specified which activator activates it
                            //and then we also show that key (example: CTRL + I will store the 'I'  key in the this.activatedKeys['Ctrl']
                            //hash and then show the CTRL key as clickable in the keyboard GUI
                            //if the activator contains a '+' sign that means that several activators are required, handle that case later

                            var activator = data[i].activated_by;
                            ctrlCtx.keysHash[activator+'+'+data[i].keys] = data[i];

                            //if that activated key was not seen before, define
                            if(ctrlCtx.activatedKeys[activator] == undefined)
                                ctrlCtx.activatedKeys[activator] = [];

                            //push the keys that are activated by it in the array, so that we may access them later
                            ctrlCtx.activatedKeys[activator].push(data[i]);
                            //ok, if it doesn't have more than one activator in combination
                            if(data[i].activated_by.indexOf('+') < 0) {
                                //there are usually 2 keys on the keyboard for the activators: a left CTRL key, and a right CTRL key, for example
                                $('#L'+activator).show();
                                $('#R'+activator).show();
                            }
                            else {//split the activator and store the names so that we can use jQuery selectors and show those as clickable
                                var activatorsInCombination = data[i].activated_by.split("+");
                                for(var a in activatorsInCombination) {
                                    $('#L'+activatorsInCombination[a]).show();
                                    $('#R'+activatorsInCombination[a]).show();
                                }
                            }

                        }
                    }
                });//end $.post

            },//end getSchemeKeys

            getSchemeData : function (scheme_id) {
                $.post('/schemeAJAX', {
                    'id' : scheme_id
                }, function(data) {
                    $("#currentSchemeName").text(data.schemeName);
                    $('#editSchemeLink').attr('href','/keyboard/input/'+scheme_id);
                    $("#currentSchemeDesc").text(data.schemeDesc);
                });
            }

        });//end controller
});//end steal.then