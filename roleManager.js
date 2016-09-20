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

    getRoleBodyParts: function(role)
    {
        if(!this.roleExists(role))
            return false;

        var role = this.getRole(role);

        if(role.getParts !== undefined)
            console.log("role.getParts.call(role): " + role.getParts.call(role));
            return role.getParts.call(role);
        else
            return role.prototype.getParts.call(role);
    }
};