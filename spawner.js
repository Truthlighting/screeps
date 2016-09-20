/**
 * Created by truthlighting on 9/20/2016.
 */
module.exports =
{
    initSpawnQue: function()
    {
        if(Memory.spawnQue == undefined)
            Memory.spawnQue = [ ];
    },

    addToQue: function(creep, unshift)
    {
        this.initSpawnQue();

        if(unshift != undefined && unshift === true)
            Memory.spawnQue.unshift(creep);
        else
            Memory.spawnQue.push(creep);
    },

    spawnNextInQue: function()
    {

        this.initSpawnQue();

        if(!Memory.spawnQue.length)
            return;

        var spawns = Game.rooms['W2N48'].find(FIND_MY_SPAWNS, {
            filter: function(spawn)
            {
                return spawn.spawning === undefined || spawn.spawning === null;
            }
        });
        //console.log(spawns);

        if(!spawns.length)
            return;

        var role = Memory.spawnQue[0];

        if(typeof role == "string")
        {
            role = { type: role, memory: { } };
        }

        var me = this;
        //console.log(spawns);
        var toSpawnAt = spawns.filter(function(spawn)
        {
            //console.log("spawn: " + spawn + " role.type: " + role.type);
            //console.log(me.canSpawn(spawn, role.type));
            return me.canSpawn(spawn, role.type);
        });
        //console.log(toSpawnAt.length);
        if(!toSpawnAt.length)
            return;
        //console.log("getting here1");
        toSpawnAt = toSpawnAt[0];
        this.spawn(role.type, role.memory, toSpawnAt);

        Memory.spawnQue.shift();
    },

    spawn: function(role, memory, spawnPoint)
    {
        if(!spawnPoint)
            spawnPoint = Game.spawns['Harmony'];

        var manager = require('roleManager');

        if(!manager.roleExists(role))
        {
            return;
        }

        if(!this.canSpawn(spawnPoint, role))
        {
            return;
        }

        if(memory == undefined)
            memory = { };

        memory['role'] = role;

        var nameCount = 0;
        var name = null;
        while(name == null)
        {
            nameCount++;
            var tryName = role + nameCount;
            if(Game.creeps[tryName] == undefined)
                name = tryName;
        }

        console.log('Spawning ' + role);
        console.log(spawnPoint.createCreep(manager.getRoleBodyParts(role), name, memory));
    },

    canSpawn: function(spawnPoint, role)
    {
        if(typeof spawnPoint == "string" && role == undefined)
        {
            role = spawnPoint;
            spawnPoint = Game.spawns['Harmony'];
        }
        //console.log(role);
        return spawnPoint.energy >= this.spawnCost(role)
            && (spawnPoint.spawning == null
            || spawnPoint.spawning == undefined);
    },

    spawnCost: function(role)
    {
        var manager = require('roleManager');
        var parts = manager.getRoleBodyParts(role);

        var total = 0;
        for(var index in parts)
        {
            var part = parts[index];
            switch(part)
            {
                case MOVE:
                    total += 50
                    break;

                case WORK:
                    total += 100
                    break;

                case CARRY:
                    total += 50
                    break;

                case ATTACK:
                    total += 80
                    break;

                case RANGED_ATTACK:
                    total += 150
                    break;

                case HEAL:
                    total += 250
                    break;

                case TOUGH:
                    total += 10
                    break;

                case CLAIM:
                    total += 600
            }
        }
        console.log("total cost for " + role + ": " + total);
        return total;
    },

    killAll: function(role)
    {
        for(var i in Game.creeps) {
            if(role == undefined || Game.creeps[i].memory.role == role)
                Game.creeps[i].suicide();
        }
    }
}