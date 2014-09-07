/*
 * KEYBOARD CONTROLLER
 *
 */
steal("jquery/jquerymx.js").then(function() {
    $.Controller("KeyboardInCtrl",
    {
        /*Static*/
        },
        /*prototype*/
        {
            init: function() {
                this.currentSticky = '';
                this.activatorsHash = [];
                steal.dev.log("Init Keybord Input Controller");

                $('.key').css('background-color','white');
                this.myIframe = document.getElementsByTagName('iframe')[0];

                $('#id_activated_by').attr('readonly', true);
                $('#id_keys').attr('readonly', true);
                $('#id_activated_by').attr('disabled', true);
                $('#id_keys').attr('disabled', true);

                $($('form')[1]).find('#id_color').each(function() {
                    $("<input type='color' />").attr({
                        name: this.name,
                        value: this.value,
                        id:this.id
                    }).insertBefore(this);
                }).remove();

                $('#id_image_url').prop('disabled', true);

            },
            /*handlers go here*/
            /*
                         * Add/remove key to hash, make the key selected (less transparency)
                         */
            '.key click': function(el, ev) {
                var holder= $(el);
                var id = holder.attr("id")+"";
                var isActivator = false;

                if(this.isActivator(id)){
                    id = id.substr(1);
                    isActivator = true;
                }

                if (holder.hasClass('selected')) {
                    holder.removeClass('selected');
                    holder.css('background-color','white');

                    if(isActivator)
                        delete this.activatorsHash[id];
                    else
                        this.currentSticky = '';

                }
                else {
                    if (id in this.activatorsHash){
                        return false;
                    }

                    if(isActivator)
                        this.activatorsHash[id] = id;
                    else {
                        $('#'+this.currentSticky).css('background-color','white');
                        $('#'+this.currentSticky).removeClass('selected');
                        this.currentSticky = id;
                    }

                    holder.addClass('selected');
                    holder.css('background-color','gray');

                }

                var activatorsCombination = this.printCombination();

                if(activatorsCombination == 'Alt+Ctrl')
                    activatorsCombination = 'Ctrl+Alt'
                if(activatorsCombination == 'Shift+Ctrl')
                    activatorsCombination = 'Ctrl+Shift'

                $('#id_activated_by').val(activatorsCombination);
                $('#id_keys').val(this.currentSticky);

            },
            /*
             *  Save the combination with its properties to an object
             */
            '#add click': function(el, ev) {

                /*
                 
                 */

                //var combination = new KeyCombination($('#name').val(), $('#description').val(), $.extend([], this.stickyHash));
                //combination.save();
                var ctx = this;

                $.post('/addShortcutAJAX', {
                    'id' : $('form')[1].id.substr(4),
                    'name':$('#id_name').val(),
                    'keys': $('#id_keys').val(),
                    'desc':$('#id_desc').val(),
                    'image_url':$('#id_image_url').val(),
                    'color':$('#id_color').val(),
                    'activated_by':$('#id_activated_by').val()
                }, function(data) {
                    if(data.added == "true") {
                        ctx.myIframe.src = ctx.myIframe.src;
                        $('#errors').html('Key added successfully.');

                        ctx.clearShortcutForm();
                    }
                    else {
                        $('#errors').html('Your last attemp to add a key failed.');
                    }
                });
            
            //add to json, then push to rest
            },

            clearShortcutForm: function() {
                $('.selected').css('background-color','white');
                $('.selected').removeClass('selected');
                $('#id_keys').val("");
                $('#id_name').val("");
                $('#id_desc').val("");
                $('#id_image_url').val("");
                $('#id_color').val("");
                $('#id_activated_by').val("");
            },

            /*
             * Utility Functions here
             */

            printCombination: function() {
                var stringForm = '';
                for(var item in this.activatorsHash){
                    stringForm += '+' + item;
                }
                stringForm = stringForm.substr(1);
                return stringForm;
            },
            //util function to verify if the key (passed the key name as string) is an activator or just a regular key
            isActivator : function(keyString) {
                if(keyString.indexOf("Shift") != -1 || keyString.indexOf("Alt") != -1 || keyString.indexOf("Ctrl") != -1 || keyString.indexOf("Win") != -1)
                    return true;
                else
                    return false;
            },
            /*
                         * For padding the number (making it 5 digits, etc.)
                         */
            pad: function(number, length) {
                var str = '' + number;
                while (str.length < length) {
                    str = '0' + str;
                }
                return str;
            }
        });
});