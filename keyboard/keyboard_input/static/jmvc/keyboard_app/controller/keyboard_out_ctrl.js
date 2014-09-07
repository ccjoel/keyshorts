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
    $.Controller("KeyboardOutCtrl",
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

                //check the first scheme from the dropdown
                this.whichScheme = document.getElementById("whichScheme");
                //create and call scheme with that id, so that we retrieve the keyboard shortcuts and display them

                if(this.whichScheme !== null)
                    this.getSchemeKeys(this.whichScheme.options[0].value);

                //selectors used multiple times throughout the application for the search and autoComplete
                //jQuery takes time to find the selectors so its better to store it than to look in the DOM each time(performance)
                this.searchKeyField = $('#searchAction');
                this.autoComplete = $('#autoComplete');
                this.autoCompleteList = $('#autoCompleteList');

            },

            //END INIT. Event handlers follow




            ///////////////////////
            //
            //  Events for search bar and autoComplete
            //
            ///////////////////////
            
            /*
             * When changed dropdown value
             */
            '#whichScheme change' : function(el,ev) {
                //we just changed shcemes- so we must hide all key identifiers and recalculate the shortcuts for that scheme
                this.resetScheme();
                this.resetKeyboard();
                this.whichScheme = document.getElementById("whichScheme");
                this.getSchemeKeys(this.whichScheme.options[this.whichScheme.selectedIndex].value);
                this.getSchemeData(this.whichScheme.options[this.whichScheme.selectedIndex].value);
            },

            //if someone enters a key on the search field: we want to show possible actions
            '#searchAction keyup' : function(el,ev) {
                var ctx = this;

                if(ev.keyCode == 13) //if pressed the enter key just ignore it (returning false does this)
                    return false;

                //if the field is empty, reset the search results and show the keyboard in its original state
                if(this.searchKeyField.val() == ''){
                    $('#autoComplete').fadeOut();
                    $('.key').hide();
                    this.showKeys();
                    this.pressedKeysString = '';
                    $('#tooltip').hide();
                    $('.selected').removeClass('selected');
                    return false;
                }
                //lets remove all elements from autocomplete list, since we are going to populate with the new info we have
                this.autoCompleteList.html('');

                //perform AJAX request and call for the shortcuts that contain the name entered in textbox
                $.post('/keysSearchAJAX',
                    {'partialName' : this.searchKeyField.val(), 'scheme_id' : this.whichScheme.options[this.whichScheme.selectedIndex].value},
                    function(data){
                        for(var keyName in data) {//create li items in dropdown
                            var tempLi = document.createElement('li');
                            tempLi.id = data[keyName].id;
                            tempLi.innerHTML = data[keyName].name;
                            ctx.autoCompleteList.append(tempLi);
                        }
                    });
                //finally, show the auto-complete box
                $('#autoComplete').show();
            },
            //when user hovers over options, change background color (highlight)
            '#autoCompleteList li mouseenter' : function(el,ev) {
                $(el).css('background','#DFDFDF');
            },
            //when mouse exits item from auto complete, remove the highlight
            '#autoCompleteList li mouseleave' : function(el,ev) {
                $(el).css('background','#FFFFFF');
            },
            //when user clicks one of the auto complete suggestions: show the keyboard shortcut for it
            '#autoCompleteList li click' : function(el,ev) {
                //forget about previously pressed keys
                this.pressedKeysString = '';

                //remove the previously selected activator key
                $('.selected').removeClass('selected');

                //store the object that corresponds to the action selected in autoComplete
                var keyObject = this.namesHash[$(el).text()]
                //get activators, if any
                var activators = keyObject.activated_by;
                //if there is more than one activator, we will find it with this
                var arrayWithAllKeysToHighlight = activators.split('+');
                //add to that array the key that is activated
                arrayWithAllKeysToHighlight.push(keyObject.keys);

                //the result, arrayWithAllKeysToHighlight, holds all the keys to the shortcut. Example: ['Ctrl','Alt','I']

                var tempKeyName='';
                //hide all the keys from keyboard, we will show only the shortcut for the action selected in dropdown
                $('.key').hide();

                //for each key in the array, lets show it
                for(var actKey in arrayWithAllKeysToHighlight) {
                    //if is activator, add to pressedKeysString
                    if (this.isActivator(arrayWithAllKeysToHighlight[actKey])) {
                        if(this.pressedKeysString != '')
                            this.pressedKeysString += '+'
                        this.pressedKeysString += this.isActivator(arrayWithAllKeysToHighlight[actKey]) ? arrayWithAllKeysToHighlight[actKey] : '';
                    }
                    //lets show the current key from the array
                    tempKeyName += '#';
                    tempKeyName += this.isActivator(arrayWithAllKeysToHighlight[actKey]) ? 'L' : '';
                    tempKeyName += arrayWithAllKeysToHighlight[actKey];
                    //use fadeIn instead of show with style
                    $(tempKeyName).fadeIn();
                    //erase for next iteration
                    tempKeyName = '';
                }

                //close autocomplete after having selected an option
                this.autoComplete.fadeOut();

                
                if(this.pressedKeysString != '')
                    id = this.pressedKeysString+'+'+id;

                var keyElem = this.namesHash[$(el).text()]

                $('#keyTitle').text(keyElem.name);
                $('#shortcutDesc').text(keyElem.desc);

                //finally, show the tooltip
                $('#tooltip').fadeIn();

            },




            ///////////////////////
            //
            //  Events for Keyboard (tooltop, keys, activators)
            //
            ///////////////////////

            /*
             * Show tooltip when hover
             */
            '.key mouseenter': function(el, ev) {
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
                
                $('#keyTitle').text(keyElem.name);
                $('#shortcutDesc').text(keyElem.desc);

                //finally, show the tooltip
                $('#tooltip').fadeIn();

            },
            /*
             * Hide Tool tip when mouse leaves key
             */
            '.key mouseleave': function(el, ev) {
                $('#tooltip').hide();
            },
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
                        //with all the current combinations that have that key that is still pressed
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

                    /*
                     * TODO: These two if statements are a lame excuse to fix a bug. Will deal with them later.
                     */
                    if(this.pressedKeysString == 'Ctrl+Shift') {
                        $('#LAlt').hide();
                        $('#RAlt').hide();
                    }
                    if(this.pressedKeysString == 'Ctrl+Alt') {
                        $('#LShift').hide();
                        $('#RShift').hide();
                    }

                    //show the activator that was pressed as selected
                    holder.addClass('selected');
                }
            },
            /* End Event handlers
             */

             '#cancel-search click': function() {
                 console.log('clear everything!');
                    $('#autoComplete').fadeOut();
                    $('.key').hide();
                    this.showKeys();
                    this.pressedKeysString = '';
                    $('#searchAction').val('');
                    $('#tooltip').hide();
                    $('.selected').removeClass('selected');
                    return false;
             },

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