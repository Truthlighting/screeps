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
        var body = [];
        var me = this;
        //console.log(spawns);
        var toSpawnAt = spawns.filter(function(spawn)
        {
            //console.log("spawn: " + spawn + " role.type: " + role.type);
            //console.log(me.canSpawn(spawn, role.type));
            return me.canSpawn(spawn, role.type);
        });
        //console.log("toSpawnAt: " + toSpawnAt);
        if(!toSpawnAt.length)
            return;
        //console.log("getting here1");
        toSpawnAt = toSpawnAt[0];
        this.spawn(role.type, role.memory, toSpawnAt, body);

        Memory.spawnQue.shift();
    },

    spawn: function(role, memory, spawnPoint)
    {
        //console.log("role: " + role + " memory: " + memory + " spawnPoint: " + spawnPoint);
        if(!spawnPoint)
            spawnPoint = Game.spawns['Harmony'];

        var manager = require('roleManager');
        var body = this.findMostExpensiveAffordableBody(spawnPoint, role);

        if(!manager.roleExists(role))
        {
            return;
        }
        /*if(!this.canSpawn(spawnPoint, role))
        {
            return;
        }*/

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
        spawnPoint.createCreep(body, name, memory);
    },

    canSpawn: function(spawnPoint, role)
    {
        if(typeof spawnPoint == "string" && role == undefined)
        {
            role = spawnPoint;
            spawnPoint = Game.spawns['Harmony'];
        }
        //console.log(role);
        //console.log("spawnPoint: " + spawnPoint + " spawnPoint.energy: " + spawnPoint.energy + " this.room.energyAvailable: " + spawnPoint.room.energyAvailable);
        //return spawnPoint.energy >= this.spawnCost(role)
        return this.findMostExpensiveAffordableBody(spawnPoint, role)
            && (spawnPoint.spawning == null
            || spawnPoint.spawning == undefined);
    },

    findMostExpensiveAffordableBody: function(spawnPoint, role)
    {
        var manager = require('roleManager');
        var bodyArray = manager.getRoleBodyParts(role);

        for (var index in bodyArray)
        {
            var body = bodyArray[index];
            if (this.spawnCost(body) <= spawnPoint.room.energyAvailable)
                return body;
        }

    },

    spawnCost: function(body)
    {
       // var manager = require('roleManager');
       // var parts = manager.getRoleBodyParts(role);

        var total = 0;
        for(var index in body)
        {
            var bodyPart = body[index];
            switch(bodyPart)
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
        //console.log("body: " + body);
        //console.log("total cost: " + total);
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