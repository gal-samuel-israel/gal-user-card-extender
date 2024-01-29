import Component from "@ember/component";
import { inject as service } from "@ember/service";
import jQuery from 'jquery';
//import { computed } from '@ember/object';
//import User from "discourse/models/user";

export default Component.extend({
    session: service(),    
    destroying: false,
    additionalTitle: false,
    
    init() {
        this._super(...arguments);
        
        // Get settings params and decide if showing to user and/or debug mode is on/off
        this.showOnlyToAdmins = settings?.enable_modal_only_for_admins; //from settings.yml
        this.debugForAdmins = settings?.enable_debug_for_admins; //from settings.yml
        this.debugFooter = this.debugForAdmins && settings?.enable_modal_footer_internal_debug; //from settings.yml
        this.debug4All = settings?.enable_debug_for_all; //from settings.yml    
        this.debugForUsers = settings?.enable_debug_for_user_ids; //from settings.yml
        var debugForIDs = (this.debugForUsers) ? this.debugForUsers.split("|") : null;
        
        this.debug = false;
        if(this.currentUser?.admin && this.debugForAdmins){ this.debug = true; }
        if(debugForIDs && debugForIDs.includes(this.currentUser.id.toString())) { this.debug = true; }
        if(this.debug4All){ this.debug = true; }
    
        if(this.debug){
            console.log('component init start');
            console.log(arguments);
        }        
        // Get out if component is not enabled for the user
        if(!this.currentUser || (!this.currentUser?.admin && this.showOnlyToAdmins)){
            if(this.debug){ console.log('destroy'); }
            this.destroying = true;
            this.destroy();
            return false;
        }
        
        const tryUser = (arguments[0]?.outletArgs?.user !== 'undefined') ? arguments[0]?.outletArgs?.user : null;
        const tryModel = (arguments[0]?.attrs?.outletArgs?.value?.model !== 'undefined') ? arguments[0]?.attrs?.outletArgs?.value?.model : null;       
        
        var userGroups;
        var userTitle;
        if(tryUser){
          if(this.debug){ console.log('found user'); }
          userGroups = tryUser.groups;
          userTitle =  tryUser.title;
        } else if(tryModel){
          if(this.debug){ console.log('found model'); }
          userGroups = tryModel.groups;
          userTitle =  tryModel.title;
        }
        
        if(this.debug){ console.log('userGroups:', userGroups); }

        // Check if userGroups is missing
        if (!userGroups) {
            // Schedule an asynchronous query
            this.fetchUserGroups(tryUser.username);
        } else {
            this.handleUserGroups(userGroups, userTitle);
        }
    },
    fetchUserGroups(userName) {
        const component = this;
        jQuery.ajax({
            method: 'GET',
            url: '/u/' + userName + '.json',
            success: function(result) {
                const userGroups = result.user.groups;
                const userTitle = result.user.title;

                component.handleUserGroups(userGroups, userTitle);
            },
        });
    },
    handleUserGroups(userGroups, userTitle) {
        console.log('userGroups:', userGroups);

        var isEmployee = false;

        if(userGroups?.length > 2){
            isEmployee = userGroups.some((item)=>{
                return item.name === "Algosec" || item.name === "staff";
            });         
        }

        console.log('isEmployee: ', isEmployee);
        var calcTitle = userTitle;
        if(isEmployee){
            calcTitle = (calcTitle === undefined || calcTitle === "" || calcTitle === null) ? 'AlgoSec Employee' : 'AlgoSec';
        }

        this.set("additionalTitle", calcTitle);

        if(this.debug){
            console.log('userTitle: ', userTitle);
            console.log('isEmployee: ', isEmployee);
            console.log('calcTitle: ', calcTitle);
        }
    },
    didInsertElement() {      
        this._super(...arguments);
    
        if(this.destroying){return;}
    
        if(this.debug){ console.log('didInsertElement'); } 
    },
    
    didRender(){
      this._super(...arguments);
  
      if(this.destroying){return;}
      
      //visual effects should not be done here as this is run many times
      //if(this.debug){ console.log('didRender'); } 
    },
  
    willRender() {
      //if(this.debug){ console.log('willRender'); }   
    },
  
    willDestroyElement(){
      //if(this.debug){ console.log('willDestroyElement'); }  
      //remove eventlisters here
      //element.removeEventListener("keydown", this.handleTabKeyStrokes, true);
  
      this._super(...arguments);
    },
  
    didDestroyElement() {
      //document.documentElement.classList.remove("class-of-element-to-remove-from-dom");
    },
});
