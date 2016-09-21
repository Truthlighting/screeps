/**
 * Created by truthlighting on 9/20/2016.
 */
module.exports = {
    roleExists: function(role){
        try
        {
            require("roles_" + role);
            return true;
        }
        catch(e)
        {
            return false;
        }
    },

    getRole: function(role)
    {
        if(!this.roleExists(role))
            return false;

        var proto = require('role_prototype');

        var roleObject = require("roles_" + role);
        roleObject = require('extend')(roleObject, proto);
        return roleObject;
    },

    getRoleBodyParts: function(role) {
        if (!this.roleExists(role))
            return false;

        var roleObject = this.getRole(role);

        if (roleObject.getParts !== undefined) {
            //console.log("role.getParts.call(role): " + role.getParts.call(role));
            console.log("returning A");
            return roleObject.getParts.call(role);
        } else
        {
            console.log("returning B");
            return roleObject.prototype.getParts.call(role);
        }
    }
};