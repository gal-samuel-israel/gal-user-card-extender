import Component from "@ember/component";
import { inject as service } from "@ember/service";
import User from "discourse/models/user";
export default Component.extend({      
    destroying: false,
    additionalTitle: false,
    init() {
        this._super(...arguments);
        console.log('additionalTitle');

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
            console.log('component init start:');            
        }

        if(!this.currentUser || (!this.currentUser?.admin && this.showOnlyToAdmins)){
            if(this.debug){
                console.log('destroy');
            }
            this.destroying = true;
            this.destroy();
            return false;
        }
        /*
        if(userName !== undefined){
          jQuery.ajax({                
              method : 'GET',
              url : '/u/'+userName+'.json',
              success: function(result){
                  //console.log(result);
                  var userGroups = result.user.groups;
                  var userTitle = result.user.title;
                  var isEmployee = false;

                  if(userGroups?.length > 2){
                      isEmployee = userGroups.some((item)=>{
                          return item.name === "Algosec" || item.name === "staff" ;
                      });         
                  }

                  var calcTitle = userTitle;
                  if(isEmployee){
                      calcTitle = (calcTitle===undefined || calcTitle==="" || calcTitle===null) ? 'AlgoSec Employee' : 'AlgoSec';
                  }

                  this.set("additionalTitle", calcTitle);

                  if(debug){
                      console.log('userGroups: ', userGroups);
                      console.log('userTitle: ', userTitle);
                      console.log('isEmployee: ', isEmployee);
                      console.log('calcTitle: ', calcTitle);
                  }
              },
          });
         
      }
      */

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
        if(this.debug){ console.log('didRender'); } 
      },
    
      willRender() {
        if(this.debug){ console.log('willRender'); }   
      },
    
      willDestroyElement(element){
        if(this.debug){ console.log('willDestroyElement:', element); }  
        //remove eventlisters here
        //element.removeEventListener("keydown", this.handleTabKeyStrokes, true);
    
        this._super(...arguments);
      },
    
      didDestroyElement() {
        //document.documentElement.classList.remove("class-of-element-to-remove-from-dom");
      },
});
