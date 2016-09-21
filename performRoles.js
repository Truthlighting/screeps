/**
 * Created by truthlighting on 9/20/2016.
 */
module.exports = function(creeps)
{
    var roleManager = require('roleManager');
    var roles = { };

    //For each creep, check if they have a role. If they do, load and run it
    for(var name in creeps)
    {
        var creep = creeps[name];
        if(creep.spawning || creep.memory.role == undefined || (creep.memory.active !== undefined && !creep.memory.active))
            continue;

        var role = creep.memory.role;

        if(roleManager.roleExists(role))
            role = roleManager.getRole(role);
            //console.log("role1: ");
            //for (var key in role) { console.log(key); }
        console.log("type of role: " + typeof(role) + " role: " + role);

        //console.log("role2: ");
        //for (var key in role) { console.log(key); }
        if (typeof(role) == 'string')
        {
            var role = role.setCreep(creep);
            console.log("role as string: " + role);
        }
        else if (typeof(role) == 'object')
        {
            var role = Object.create(role);
            role.setCreep(creep);
        }
        try { role.run(); } catch(e) { }
    }
};