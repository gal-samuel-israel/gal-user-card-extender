import Component from "@ember/component";
import User from "discourse/models/user";

export default {
    currentUser: User.current(),
    additionalTitle: false,
    calcTitleAddendum: function(args, Component) {
        
        var debugForAdmins = settings.enable_debug_for_admins;
        var debugForAll = settings.enable_debug_for_all;
        var currentUser = this.currentUser;
        var userName = (args.model === undefined) ? args.user.username : currentUser.username;
        var debug = (currentUser.admin && debugForAdmins) ? true : (!currentUser.admin && debugForAll) ? true : false;
        if(debug){
            console.log('debug on for card extender:');
            console.log('Admins: ' + debugForAdmins);
            console.log('All: ' + debugForAll);
            console.log('currentUser:', currentUser);
            console.log('args:', args);
            console.log('component:', Component);
            console.log('card userName:', userName);
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

                    component.set("additionalTitle", calcTitle);

                    if(debug){
                        console.log('userGroups: ', userGroups);
                        console.log('userTitle: ', userTitle);
                        console.log('isEmployee: ', isEmployee);
                        console.log('calcTitle: ', calcTitle);
                    }
                },
            });
        }*/
    },
    setupComponent(args, Component) {
        this.calcTitleAddendum(args, Component);
        return true
    }
}