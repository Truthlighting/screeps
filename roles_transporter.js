/**
 * Created by truthlighting on 9/20/2016.
 */
var transporter = {
    parts: [
        [Game.CARRY, Game.CARRY, Game.MOVE, Game.MOVE]
    ],

    action: function()
    {
        var creep = this.creep;

        //@TODO: Balance Spawns here

        if(creep.energy == 0)
        {
            var closestSpawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
                filter: function(spawn)
                {
                    return spawn.energy > 0;
                }
            });

            creep.moveTo(closestSpawn);
            closestSpawn.transferEnergy(creep);

            return;
        }

        var target = null;

        //Transfer to builder
        if (!target) {
            var builderToHelp = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                filter: function (builder) {
                    return builder.memory.role == "builder"
                        && builder.energy < ( builder.energyCapacity - 10);
                }
            });

            if (builderToHelp)
                target = builderToHelp;
        }

        if(!target)
        {
            var extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: function(structure)
                {
                    return structure.structureType == STRUCTURE_EXTENSION &&
                        structure.energy < structure.energyCapacity;
                }
            });

            if(extension)
                target = extension;
        }

        //Go to target and give it energy
        if (creep.pos.isNearTo(target)) {
            if (target.energy < target.energyCapacity) {
                creep.transfer(target,RESOURCE_ENERGY);
            }
        }
        else {
            creep.moveTo(target);
        }
    }
};

module.exports = transporter;